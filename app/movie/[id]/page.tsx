import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, Play } from "lucide-react"
import { getCategories, getMovieById, getSeriesEpisodes } from "@/app/actions/movies"
import { EpisodeList } from "@/components/episode-list"
import { SiteHeader } from "@/components/site-header"
import { MovieWatchPlayer } from "@/components/tmdb-watch-player"
import { getImdbId } from "@/lib/tmdb"
import { LikeButton } from "@/components/like-button"
import { ShareButton } from "@/components/share-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const movie = await getMovieById(Number(id))
  if (!movie) return { title: "Not found — Rebel Stream" }
  const canonicalUrl = `/movie/${movie.id}`
  const description = movie.description || `Discover ${movie.title} on Rebel Stream.`
  return {
    title: movie.title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: movie.isSeries ? "video.tv_show" : "video.movie",
      title: movie.title,
      description,
      url: canonicalUrl,
      siteName: "Rebel Stream",
      images: movie.thumbnailUrl ? [{ url: movie.thumbnailUrl, alt: movie.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: movie.title,
      description,
      images: movie.thumbnailUrl ? [movie.thumbnailUrl] : undefined,
    },
  }
}

export default async function MoviePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ play?: string; episode?: string }>
}) {
  const { id } = await params
  const { play, episode } = await searchParams
  const movie = await getMovieById(Number(id))
  if (!movie) notFound()

  const categories = await getCategories()
  const seriesRows = movie.isSeries ? await getSeriesEpisodes(movie.id) : []
  const imdbId = !movie.isSeries && movie.tmdbId ? await getImdbId(Number(movie.tmdbId), "movie") : null
  const selectedIndex = episode ? Math.max(0, seriesRows.findIndex((row) => row.episode.id === Number(episode))) : 0
  const selected = seriesRows[selectedIndex]
  const isPlaying = play === "1"

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rebelstream.vercel.app"
  const structuredData = {
    "@context": "https://schema.org",
    "@type": movie.isSeries ? "TVSeries" : "Movie",
    name: movie.title,
    description: movie.description || undefined,
    image: movie.thumbnailUrl || undefined,
    url: `${siteUrl}/movie/${movie.id}`,
    ...(movie.year ? { dateCreated: String(movie.year) } : {}),
  }

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <SiteHeader categories={categories} />

      {isPlaying ? (
        <div className="fixed inset-0 z-[60] flex flex-col bg-black">
          <div className="absolute left-4 top-4 z-10">
            <Button
              render={<Link href={`/movie/${movie.id}`} />}
              nativeButton={false}
              variant="secondary"
              size="sm"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </div>
          <MovieWatchPlayer
            type={movie.isSeries ? "tv" : "movie"}
            tmdbId={Number(movie.tmdbId ?? movie.id)}
            imdbId={imdbId}
            title={selected ? `${movie.title} — S${selected.season.seasonNumber} E${selected.episode.episodeNumber}: ${selected.episode.title}` : movie.title}
            initialSeason={selected?.season.seasonNumber}
            initialEpisode={selected?.episode.episodeNumber}
            episodeCounts={Object.fromEntries(seriesRows.map((row) => [row.season.seasonNumber, Math.max(...seriesRows.filter((item) => item.season.seasonNumber === row.season.seasonNumber).map((item) => item.episode.episodeNumber))]))}
          />
        </div>
      ) : (
        <main>
          <div className="absolute left-4 top-20 z-20 md:left-8">
            <Button
              render={<Link href="/" />}
              nativeButton={false}
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </div>
          <div className="relative h-[56vh] min-h-[360px] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={movie.thumbnailUrl || "/placeholder.svg?height=1080&width=1920&query=cinematic backdrop"}
              alt={movie.title}
              className="absolute inset-0 h-full w-full object-cover"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end gap-4 px-4 pb-10 md:px-8">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {movie.year && <span>{movie.year}</span>}
                {movie.rating && <Badge variant="outline">{movie.rating}</Badge>}
                {movie.duration && <span>{movie.duration}</span>}
              </div>
              <h1 className="max-w-2xl text-balance text-3xl font-extrabold md:text-5xl">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  render={<Link href={`/movie/${movie.id}?play=1`} />}
                  nativeButton={false}
                  size="lg"
                  className="gap-2 font-semibold"
                >
                  <Play className="h-5 w-5 fill-current" /> Play
                </Button>
                <LikeButton movieId={movie.id} />
                <ShareButton movieId={movie.id} title={movie.title} />
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-[1600px] px-4 py-8 md:px-8">
            <p className="max-w-3xl text-pretty leading-relaxed text-foreground/80">
              {movie.description || "No description available."}
            </p>
            <EpisodeList movieId={movie.id} rows={seriesRows} />
          </div>
        </main>
      )}
    </div>
  )
}
