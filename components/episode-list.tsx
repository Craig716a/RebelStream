import Link from "next/link"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Episode, Season } from "@/lib/db/schema"

type Row = { episode: Episode; season: Season }

export function EpisodeList({ movieId, rows }: { movieId: number; rows: Row[] }) {
  if (!rows.length) return null
  const grouped = rows.reduce<Record<number, { season: Season; episodes: Episode[] }>>((acc, row) => {
    acc[row.season.seasonNumber] ??= { season: row.season, episodes: [] }
    acc[row.season.seasonNumber].episodes.push(row.episode)
    return acc
  }, {})
  return (
    <section className="mt-8 space-y-5" aria-labelledby="episodes-heading">
      <h2 id="episodes-heading" className="text-2xl font-bold">Episodes</h2>
      {Object.values(grouped).map(({ season, episodes }) => (
        <div key={season.id} className="space-y-3">
          <h3 className="text-lg font-semibold">Season {season.seasonNumber}{season.title ? ` — ${season.title}` : ""}</h3>
          <div className="divide-y divide-border rounded-lg border border-border">
            {episodes.map((episode) => (
              <div key={episode.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2"><Badge variant="outline">E{episode.episodeNumber}</Badge><span className="font-medium">{episode.title}</span></div>
                  {episode.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{episode.description}</p>}
                </div>
                <Button render={<Link href={`/movie/${movieId}?play=1&episode=${episode.id}`} />} nativeButton={false} size="sm" className="shrink-0 gap-2"><Play className="h-4 w-4 fill-current" /> Play</Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
