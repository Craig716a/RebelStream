"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createEpisode, createSeason, deleteEpisode, deleteSeason, type EpisodeInput, type SeasonInput } from "@/app/actions/movies"
import type { Episode, Movie, Season } from "@/lib/db/schema"
import { toast } from "sonner"
import { MediaUpload } from "@/components/admin/media-upload"

type Row = { season: Season; episode: Episode | null }
type Series = Pick<Movie, "id" | "title"> & { rows: Row[] }

export function SeriesManager({ series }: { series: Series[] }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [selectedId, setSelectedId] = useState(series[0]?.id ?? 0)
  const [seasonNumber, setSeasonNumber] = useState(1)
  const [seasonTitle, setSeasonTitle] = useState("")
  const [episode, setEpisode] = useState({ seasonId: 0, episodeNumber: 1, title: "", description: "", thumbnailUrl: "", videoUrl: "", duration: "" })
  const selected = series.find((item) => item.id === selectedId)
  const seasons = selected ? Array.from(new Map(selected.rows.map((row) => [row.season.id, row.season])).values()) : []

  function refresh() { router.refresh() }
  function saveSeason(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedId || seasonNumber < 1) return toast.error("Choose a series and valid season number.")
    start(async () => { try { await createSeason({ movieId: selectedId, seasonNumber, title: seasonTitle } as SeasonInput); toast.success("Season added"); setSeasonTitle(""); refresh() } catch { toast.error("Could not add season. Check that the number is unique.") } })
  }
  function saveEpisode(e: React.FormEvent) {
    e.preventDefault()
    if (!episode.seasonId || !episode.title || !episode.videoUrl) return toast.error("Season, title, and video link are required.")
    start(async () => { try { await createEpisode(episode as EpisodeInput); toast.success("Episode added"); setEpisode((value) => ({ ...value, title: "", description: "", thumbnailUrl: "", videoUrl: "", duration: "" })); refresh() } catch { toast.error("Could not add episode. Check that the number is unique.") } })
  }
  if (!series.length) return <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Mark a movie as a series to manage its seasons and episodes here.</div>

  return <div className="space-y-5 rounded-lg border border-border bg-card p-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">Series episodes</h2><p className="text-sm text-muted-foreground">Add seasons and episodes in playback order.</p></div><select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={selectedId} onChange={(e) => { const id = Number(e.target.value); setSelectedId(id); setEpisode((value) => ({ ...value, seasonId: 0 })) }} aria-label="Choose series">{series.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></div>
    <div className="grid gap-5 lg:grid-cols-2">
      <form onSubmit={saveSeason} className="space-y-3 rounded-md border border-border p-4"><h3 className="font-medium">Add season</h3><div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label htmlFor="season-number">Season</Label><Input id="season-number" type="number" min="1" value={seasonNumber} onChange={(e) => setSeasonNumber(Number(e.target.value))} /></div><div className="space-y-1"><Label htmlFor="season-title">Title</Label><Input id="season-title" value={seasonTitle} onChange={(e) => setSeasonTitle(e.target.value)} placeholder="Optional" /></div></div><Button disabled={pending} type="submit" className="gap-2"><Plus className="h-4 w-4" /> Add season</Button></form>
      <form onSubmit={saveEpisode} className="space-y-3 rounded-md border border-border p-4"><h3 className="font-medium">Add episode</h3><div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label htmlFor="episode-season">Season</Label><select id="episode-season" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={episode.seasonId} onChange={(e) => setEpisode({ ...episode, seasonId: Number(e.target.value) })}><option value="0">Choose season</option>{seasons.map((item) => <option key={item.id} value={item.id}>Season {item.seasonNumber}{item.title ? ` — ${item.title}` : ""}</option>)}</select></div><div className="space-y-1"><Label htmlFor="episode-number">Episode</Label><Input id="episode-number" type="number" min="1" value={episode.episodeNumber} onChange={(e) => setEpisode({ ...episode, episodeNumber: Number(e.target.value) })} /></div></div><Input aria-label="Episode title" placeholder="Episode title" value={episode.title} onChange={(e) => setEpisode({ ...episode, title: e.target.value })} /><MediaUpload kind="video" label="Episode video" value={episode.videoUrl} onChange={(url) => setEpisode({ ...episode, videoUrl: url })} /><MediaUpload kind="image" label="Episode thumbnail (optional)" value={episode.thumbnailUrl} onChange={(url) => setEpisode({ ...episode, thumbnailUrl: url })} /><Textarea aria-label="Episode description" placeholder="Description (optional)" rows={2} value={episode.description} onChange={(e) => setEpisode({ ...episode, description: e.target.value })} /><Button disabled={pending || !seasons.length} type="submit" className="gap-2"><Plus className="h-4 w-4" /> Add episode</Button></form>
    </div>
    <div className="space-y-2">{seasons.map((season) => <details key={season.id} className="rounded-md border border-border" open><summary className="flex cursor-pointer list-none items-center justify-between p-3 font-medium"><span>Season {season.seasonNumber}{season.title ? ` — ${season.title}` : ""}</span><ChevronDown className="h-4 w-4" /></summary><div className="space-y-2 border-t border-border p-3">{selected?.rows.filter((row) => row.season.id === season.id && row.episode).map((row) => row.episode && <div key={row.episode.id} className="flex items-center justify-between gap-3 rounded-md bg-muted/40 p-3 text-sm"><span><b>Episode {row.episode.episodeNumber}:</b> {row.episode.title}</span><Button type="button" variant="ghost" size="icon" aria-label={`Delete episode ${row.episode.title}`} disabled={pending} onClick={() => start(async () => { try { await deleteEpisode(row.episode!.id); toast.success("Episode deleted"); refresh() } catch { toast.error("Could not delete episode") } })}><Trash2 className="h-4 w-4 text-primary" /></Button></div>)}{!selected?.rows.some((row) => row.season.id === season.id && row.episode) && <p className="text-sm text-muted-foreground">No episodes yet.</p>}<Button type="button" variant="ghost" size="sm" disabled={pending} onClick={() => start(async () => { try { await deleteSeason(season.id); toast.success("Season deleted"); refresh() } catch { toast.error("Could not delete season") } })}>Delete season</Button></div></details>)}</div>
  </div>
}
