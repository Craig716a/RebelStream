import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clapperboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MovieWatchPlayer } from "@/components/tmdb-watch-player"
import { getImdbId, getTmdbTitle, tmdbImage, tmdbTitle } from "@/lib/tmdb"

export const dynamic = "force-dynamic"

type MovieWatchPageProps = {
  params: Promise<{ slug: string; id: string }>
}

function positiveInteger(value: string) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined
}

export default async function MovieWatchPage({ params }: MovieWatchPageProps) {
  const { slug, id: rawId } = await params
  const id = positiveInteger(rawId)
  if (!id) notFound()

  let title
  try {
    title = await getTmdbTitle(id, "movie")
  } catch {
    notFound()
  }

  const name = tmdbTitle(title)
  // The numeric TMDb ID is authoritative. Keep the slug in the URL for readability,
  // but do not reject valid movies when a title changes or the slug is differently encoded.
  void slug
  const poster = tmdbImage(title.poster_path, "w342")
  const runtime = title.runtime ?? title.episode_run_time?.[0]
  const imdbId = await getImdbId(id, "movie")

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
        <Button render={<Link href="/catalog" />} nativeButton={false} variant="ghost" className="w-fit gap-2 px-0">
          <ArrowLeft data-icon="inline-start" />
          Back to catalog
        </Button>
        <section className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xl" aria-label={`${name} video player`}>
          <MovieWatchPlayer type="movie" tmdbId={id} title={name} imdbId={imdbId} />
          <div className="flex items-center gap-3 border-t border-border/60 px-4 py-3 text-xs text-muted-foreground md:px-5">
            <Clapperboard className="size-4" aria-hidden="true" />
            <span>Movie player</span>
            <span className="ml-auto">RebelStream</span>
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
