"use client"

import { useMemo, useState } from "react"

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

function buildEmbedUrl({ type, tmdbId, imdbId, season, episode }: TmdbWatchPlayerProps & { season: number; episode: number }) {
  if (type === "movie") {
    return `https://vsembed.ru/embed/movie/${encodeURIComponent(imdbId?.trim() || `tmdb-${tmdbId}`)}`
  }
  return `https://vsembed.ru/embed/tv/${tmdbId}/${season}/${episode}`
}

export function MovieWatchPlayer({ type, tmdbId, title, imdbId, initialSeason, initialEpisode, episodeCounts = {} }: TmdbWatchPlayerProps) {
  const [season, setSeason] = useState(positiveInteger(initialSeason, 1))
  const [episode, setEpisode] = useState(positiveInteger(initialEpisode, 1))
  const embedUrl = useMemo(
    () => buildEmbedUrl({ type, tmdbId, imdbId, season, episode }),
    [type, tmdbId, imdbId, season, episode],
  )
  const maxEpisode = episodeCounts[season] ?? 999

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <iframe
          key={embedUrl}
          src={embedUrl}
          title={`${title} player`}
          width="100%"
          height="560"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>

      {type !== "movie" && (
        <div className="flex flex-wrap items-center gap-3 px-3 pb-3">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Season
            <select value={season} onChange={(event) => { setSeason(Number(event.target.value)); setEpisode(1) }} className="h-9 rounded-md border border-input bg-background px-2 text-foreground">
              {Array.from({ length: Math.max(10, ...Object.keys(episodeCounts).map(Number), season) }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Episode
            <input type="number" min={1} max={maxEpisode} value={episode} onChange={(event) => setEpisode(Math.max(1, Number(event.target.value) || 1))} className="h-9 w-20 rounded-md border border-input bg-background px-2 text-foreground" />
          </label>
        </div>
      )}
    </div>
  )
}

export { buildEmbedUrl }
export type { TmdbWatchPlayerProps }

