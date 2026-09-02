import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clapperboard } from "lucide-react"
import { MovieWatchPlayer } from "@/components/tmdb-watch-player"
import { Button } from "@/components/ui/button"
import { getMovieMapping } from "@/lib/movie-mapping"
import { getTmdbTitle, tmdbImage, tmdbTitle } from "@/lib/tmdb"

export const dynamic = "force-dynamic"

type MovieWatchPageProps = {
  params: Promise<{ id: string }>
}

function positiveInteger(value: string) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined
}

export default async function MovieWatchPage({ params }: MovieWatchPageProps) {
  const { id: rawId } = await params
  const id = positiveInteger(rawId)
  const mapping = getMovieMapping(rawId)
  if (!id || !mapping) notFound()

  const title = await getTmdbTitle(id, "movie")
  const name = tmdbTitle(title)
  const poster = tmdbImage(title.poster_path, "w342")
  const runtime = title.runtime ?? title.episode_run_time?.[0]

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
        <Button render={<Link href="/catalog" />} nativeButton={false} variant="ghost" className="w-fit gap-2 px-0">
          <ArrowLeft data-icon="inline-start" />
          Back to catalog
        </Button>
        <section className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xl" aria-label={`${name} video player`}>
          <MovieWatchPlayer uuid={mapping.uuid} slug={mapping.slug} title={name} />
          <div className="flex items-center gap-3 border-t border-border/60 px-4 py-3 text-xs text-muted-foreground md:px-5">
            <Clapperboard className="size-4" aria-hidden="true" />
            <span>Movie player</span>
            <span className="ml-auto">Ad-free player</span>
          </div>
        </section>
        <section className="flex gap-5 border-t border-border/60 pt-6 md:gap-6" aria-labelledby="watch-title">
          {poster && <img src={poster} alt={`${name} poster`} className="hidden h-48 w-32 rounded-lg object-cover shadow-md sm:block" />}
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">Movie{runtime ? ` · ${runtime} min` : ""}</p>
            <h1 id="watch-title" className="text-balance text-3xl font-bold tracking-tight md:text-4xl">{name}</h1>
            <p className="max-w-3xl text-pretty leading-relaxed text-foreground/75">{title.overview || "No synopsis available."}</p>
          </div>
        </section>
      </div>
    </main>
  )
}
