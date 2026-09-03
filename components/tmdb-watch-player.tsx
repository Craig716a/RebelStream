"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, ListVideo, Maximize, RotateCcw, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type TmdbWatchPlayerProps = {
  type: "movie" | "tv" | "anime"
  tmdbId: number
  title: string
  imdbId?: string | null
  initialSeason?: number
  initialEpisode?: number
  episodeCounts?: Record<number, number>
}

function positiveInteger(value: number | undefined, fallback: number) {
  return Number.isInteger(value) && value && value > 0 ? value : fallback
}

function buildEmbedUrl(
  type: TmdbWatchPlayerProps["type"],
  tmdbId: number,
  season: number,
  episode: number,
) {
  const encodedTmdb = encodeURIComponent(String(tmdbId))

  if (type === "movie") {
    return `https://cinesrc.st/embed/movie/${encodedTmdb}`
  }
  return `https://cinesrc.st/embed/tv/${encodedTmdb}/${season}/${episode}`
}


export function MovieWatchPlayer({ type, tmdbId, title, initialSeason, initialEpisode, episodeCounts = {} }: TmdbWatchPlayerProps) {
  const [season, setSeason] = useState(positiveInteger(initialSeason, 1))
  const [episode, setEpisode] = useState(positiveInteger(initialEpisode, 1))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const playerRef = useRef<HTMLDivElement>(null)
  const embedUrl = useMemo(
    () => buildEmbedUrl(type, tmdbId, season, episode),
    [type, tmdbId, season, episode],
  )

  function advanceAfterEpisode() {
    if (type === "movie") return
    const lastEpisode = episodeCounts[season]
    if (lastEpisode && episode >= lastEpisode) {
      const nextSeason = Object.keys(episodeCounts).map(Number).filter((value) => value > season).sort((a, b) => a - b)[0]
      if (nextSeason) {
        selectEpisode(nextSeason, 1)
        return
      }
    }
    setEpisode((current) => current + 1)
    setDrawerOpen(false)
  }

  useEffect(() => {
    if (type === "movie") return
    function handlePlayerMessage(event: MessageEvent) {
      if (event.origin !== "https://cinesrc.st") return
      const data = typeof event.data === "string" ? event.data.toLowerCase() : event.data?.type?.toString().toLowerCase()
      if (data === "ended" || data === "episodeended" || data === "videoended" ) advanceAfterEpisode()
    }
    window.addEventListener("message", handlePlayerMessage)
    return () => window.removeEventListener("message", handlePlayerMessage)
  }, [type, season, episode, episodeCounts])

  function selectEpisode(nextSeason: number, nextEpisode: number) {
    setSeason(positiveInteger(nextSeason, 1))
    setEpisode(positiveInteger(nextEpisode, 1))
    setDrawerOpen(false)
  }

  function nextEpisode() {
    advanceAfterEpisode()
  }

  async function enterFullscreen() {
    const element = playerRef.current
    if (!element) return
    await element.requestFullscreen?.()
    try {
      const orientation = screen.orientation as ScreenOrientation & { lock?: (orientation: string) => Promise<void> }
      await orientation.lock?.("landscape")
    } catch {
      // Orientation locking is unavailable in some mobile browsers.
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div ref={playerRef} className="relative aspect-video w-full overflow-hidden bg-black">
        <iframe
          key={`${embedUrl}-${season}-${episode}`}
          src={embedUrl}
          title={`${title} ${type === "movie" ? "movie" : `season ${season} episode ${episode}`} player`}
          className="absolute inset-0 size-full border-0"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-forms allow-modals allow-orientation-lock allow-presentation allow-same-origin allow-scripts"
        />
        <Button type="button" variant="secondary" size="icon" className="absolute right-3 top-3 bg-background/90 shadow-lg backdrop-blur-sm" onClick={enterFullscreen} aria-label="Open player fullscreen">
          <Maximize />
        </Button>
        {type !== "movie" && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="absolute right-16 top-3 gap-2 bg-background/90 shadow-lg backdrop-blur-sm hover:bg-background"
            aria-expanded={drawerOpen}
            aria-controls="episode-drawer"
            onClick={() => setDrawerOpen((open) => !open)}
          >
            <ListVideo data-icon="inline-start" />
            Episodes
          </Button>
        )}
      </div>

      <aside className="flex min-h-16 items-center justify-center rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-center text-xs text-muted-foreground" aria-label="Advertisement">
        <span>Advertisement</span>
      </aside>

      {type !== "movie" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-card/70 px-3 py-2 text-sm">
          <span className="font-medium">Season {season} · Episode {episode}</span>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => selectEpisode(season, Math.max(1, episode - 1))} disabled={episode === 1} aria-label="Previous episode">
              <ChevronLeft data-icon="inline-start" />
              Previous
            </Button>
            <Button type="button" size="sm" onClick={nextEpisode} className="gap-2">
              Next episode
              <ChevronRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      )}

      {type === "tv" && drawerOpen && (
        <aside id="episode-drawer" className="rounded-xl border border-border bg-card p-4 shadow-xl" aria-label="Season and episode selector">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Choose an episode</p>
              <p className="text-xs text-muted-foreground">Jump anywhere in the series.</p>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => setDrawerOpen(false)} aria-label="Close episode selector">
              <X />
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <label className="flex min-w-28 flex-col gap-1 text-xs font-medium text-muted-foreground">
              Season
              <div className="relative">
                <select value={season} onChange={(event) => setSeason(Number(event.target.value))} className="h-9 w-full appearance-none rounded-md border border-input bg-background px-3 pr-8 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring">
                  {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => <option key={value} value={value}>Season {value}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-2.5 size-4 text-muted-foreground" aria-hidden="true" />
              </div>
            </label>
            <label className="flex min-w-28 flex-col gap-1 text-xs font-medium text-muted-foreground">
              Episode
              <input type="number" min={1} value={episode} onChange={(event) => setEpisode(Math.max(1, Number(event.target.value) || 1))} className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
            </label>
            <Button type="button" onClick={() => selectEpisode(season, episode)} className="h-9 gap-2">
              <RotateCcw data-icon="inline-start" />
              Load episode
            </Button>
          </div>
        </aside>
      )}
    </div>
  )
}

export { buildEmbedUrl }
export type { TmdbWatchPlayerProps }
