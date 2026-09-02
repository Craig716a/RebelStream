import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getTmdbTitle, tmdbImage, tmdbTitle } from "@/lib/tmdb"
import { Button } from "@/components/ui/button"
import { TmdbWatchPlayer } from "@/components/tmdb-watch-player"
import { findLegalArchiveVideo, legalMediaUnavailableMessage, sampleMediaUrl } from "@/lib/legal-media"

export const dynamic = "force-dynamic"

export default async function TmdbWatchPage({ params, searchParams }: { params: Promise<{ type: string; id: string }>; searchParams: Promise<{ source?: string }> }) {
  const { type, id } = await params
  if (type !== "movie" && type !== "tv") notFound()
  const title = await getTmdbTitle(Number(id), type)
  const name = tmdbTitle(title)
  const runtime = title.runtime ?? title.episode_run_time?.[0]
  const legalMatch = type === "movie" ? await findLegalArchiveVideo(name) : null
  const unavailableMessage = legalMediaUnavailableMessage(name)
  const initialSource = legalMatch?.url ?? sampleMediaUrl(Number(id))
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        <Button render={<Link href="/catalog" />} nativeButton={false} variant="ghost" className="mb-6 gap-2"><ArrowLeft className="h-4 w-4" /> Back to catalog</Button>
        <div className="overflow-hidden rounded-lg bg-black shadow-2xl">
          <TmdbWatchPlayer
            source={initialSource}
            unavailableMessage={unavailableMessage}
          />
        </div>
        <section className="mt-8 flex gap-5">
          {tmdbImage(title.poster_path, "w342") && <img src={tmdbImage(title.poster_path, "w342")!} alt={`${name} poster`} className="hidden h-40 w-28 rounded object-cover sm:block" />}
          <div><p className="text-sm text-muted-foreground">{type === "tv" ? "Series" : "Movie"}{runtime ? ` · ${runtime} min` : ""}</p><h1 className="mt-1 text-3xl font-bold">{name}</h1><p className="mt-3 max-w-3xl text-pretty leading-relaxed text-foreground/80">{title.overview || "No synopsis available."}</p></div>
        </section>
      </div>
    </main>
  )
}
