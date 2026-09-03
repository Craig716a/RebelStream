import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clapperboard } from "lucide-react"
import { getImdbId, getTmdbTitle, tmdbImage, tmdbTitle } from "@/lib/tmdb"
import { Button } from "@/components/ui/button"
import { MovieWatchPlayer } from "@/components/tmdb-watch-player"

export const dynamic = "force-dynamic"

type WatchPageProps = {
  params: Promise<{ type: string; id: string }>
  searchParams: Promise<{ season?: string; episode?: string }>
}

function positiveInteger(value: string | undefined, fallback?: number) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export default async function TmdbWatchPage({ params, searchParams }: WatchPageProps) {
  const [{ type, id: rawId }, query] = await Promise.all([params, searchParams])
  if (type !== "movie" && type !== "tv" && type !== "anime") notFound()

  const id = positiveInteger(rawId)
  if (!id) notFound()

  const title = await getTmdbTitle(id, type === "movie" ? "movie" : "tv")
  const name = tmdbTitle(title)
  const runtime = title.runtime ?? title.episode_run_time?.[0]
  const season = positiveInteger(query.season, 1)
  const episode = positiveInteger(query.episode, 1)
  const imdbId = type === "movie" ? await getImdbId(id, "movie") : null
  const episodeCounts = type === "movie" ? {} : Object.fromEntries((title.seasons ?? []).filter((item) => item.season_number > 0 && item.episode_count > 0).map((item) => [item.season_number, item.episode_count]))

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
        <Button render={<Link href="/catalog" />} nativeButton={false} variant="ghost" className="w-fit gap-2 px-0">
          <ArrowLeft data-icon="inline-start" />
          Back to catalog
        </Button>

        <section className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xl" aria-label={`${name} video player`}>
          <MovieWatchPlayer type={type} tmdbId={id} title={name} imdbId={imdbId} initialSeason={season} initialEpisode={episode} episodeCounts={episodeCounts} />
          <div className="flex items-center gap-3 border-t border-border/60 px-4 py-3 text-xs text-muted-foreground md:px-5">
            <Clapperboard className="size-4" aria-hidden="true" />
            <span>{type === "movie" ? "Movie player" : type === "anime" ? "Anime player" : "Series player"}</span>
            <span className="ml-auto">Filmu player</span>
          </div>
        </section>

        <section className="flex gap-5 border-t border-border/60 pt-6 md:gap-6" aria-labelledby="watch-title">
          {tmdbImage(title.poster_path, "w342") && (
            <img src={tmdbImage(title.poster_path, "w342")!} alt={`${name} poster`} className="hidden h-48 w-32 rounded-lg object-cover shadow-md sm:block" />
          )}
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              {type === "movie" ? "Movie" : type === "anime" ? `Anime · S${season} E${episode}` : `Series · S${season} E${episode}`}{runtime ? ` · ${runtime} min` : ""}
            </p>
            <h1 id="watch-title" className="text-balance text-3xl font-bold tracking-tight md:text-4xl">{name}</h1>
            <p className="max-w-3xl text-pretty leading-relaxed text-foreground/75">{title.overview || "No synopsis available."}</p>
          </div>
        </section>
      </div>
    </main>
  )
}
