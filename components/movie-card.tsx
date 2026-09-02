import Link from "next/link"
import { Play } from "lucide-react"
import type { Movie } from "@/lib/db/schema"

export function MovieCard({ movie, rank }: { movie: Movie; rank?: number }) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group relative block w-[160px] shrink-0 md:w-[220px]"
      aria-label={movie.title}
    >
      <div className="relative aspect-video overflow-hidden rounded-md bg-muted ring-0 transition-all duration-200 group-hover:ring-2 group-hover:ring-primary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={movie.thumbnailUrl || "/placeholder.svg?height=320&width=480&query=movie"}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="absolute bottom-2 left-2 flex translate-y-2 items-center gap-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
            <Play className="h-4 w-4 fill-current" />
          </span>
        </div>
        {typeof rank === "number" && (
          <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-xs font-bold text-primary-foreground">
            #{rank}
          </span>
        )}
      </div>
      <p className="mt-2 truncate text-sm text-foreground/90">{movie.title}</p>
      {movie.year && <p className="text-xs text-muted-foreground">{movie.year}</p>}
    </Link>
  )
}
