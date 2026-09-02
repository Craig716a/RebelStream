import Link from "next/link"
import { Play, Info } from "lucide-react"
import type { Movie } from "@/lib/db/schema"
import { Button } from "@/components/ui/button"

export function Hero({ movie }: { movie: Movie }) {
  return (
    <section className="relative h-[70vh] min-h-[420px] w-full md:h-[85vh]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={movie.thumbnailUrl || "/placeholder.svg?height=1080&width=1920&query=cinematic movie backdrop"}
        alt={movie.title}
        className="absolute inset-0 h-full w-full object-cover"
        crossOrigin="anonymous"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="relative z-10 flex h-full max-w-[1600px] flex-col justify-end gap-4 px-4 pb-16 md:px-8 md:pb-24">
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">Featured</span>
        <h1 className="max-w-2xl text-balance text-3xl font-extrabold leading-tight md:text-6xl">{movie.title}</h1>
        {movie.description && (
          <p className="max-w-xl text-pretty text-sm text-foreground/80 md:text-base line-clamp-3">
            {movie.description}
          </p>
        )}
        <div className="mt-2 flex items-center gap-3">
          <Button
            render={<Link href={`/movie/${movie.id}?play=1`} />}
            nativeButton={false}
            size="lg"
            className="gap-2 font-semibold"
          >
            <Play className="h-5 w-5 fill-current" /> Play
          </Button>
          <Button
            render={<Link href={`/movie/${movie.id}`} />}
            nativeButton={false}
            size="lg"
            variant="secondary"
            className="gap-2 font-semibold"
          >
            <Info className="h-5 w-5" /> More Info
          </Button>
        </div>
      </div>
    </section>
  )
}
