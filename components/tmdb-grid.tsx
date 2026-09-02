import Link from "next/link"
import { tmdbImage, tmdbTitle, tmdbWatchPath, tmdbYear, type TmdbTitle } from "@/lib/tmdb"

export function TmdbGrid({ items }: { items: TmdbTitle[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {items.map((item) => (
        <Link key={`${item.media_type}-${item.id}`} href={tmdbWatchPath(item)} className="group min-w-0">
          <div className="aspect-[2/3] overflow-hidden rounded-md bg-muted">
            {tmdbImage(item.poster_path) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={tmdbImage(item.poster_path)!} alt={`${tmdbTitle(item)} poster`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            ) : <div className="flex h-full items-center justify-center p-3 text-center text-sm text-muted-foreground">No poster</div>}
          </div>
          <h2 className="mt-2 truncate font-semibold">{tmdbTitle(item)}</h2>
          <p className="text-sm text-muted-foreground">{tmdbYear(item)} · {item.media_type === "tv" ? "Series" : "Movie"}</p>
        </Link>
      ))}
    </div>
  )
}
