"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Movie } from "@/lib/db/schema"
import { MovieCard } from "./movie-card"

export function MovieRow({
  title,
  movies,
  ranked = false,
  id,
}: {
  title?: string
  movies: Movie[]
  ranked?: boolean
  id?: string
}) {
  const scroller = useRef<HTMLDivElement>(null)

  function scroll(dir: "left" | "right") {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir === "left" ? -el.clientWidth * 0.8 : el.clientWidth * 0.8, behavior: "smooth" })
  }

  if (movies.length === 0) return null

  return (
    <section id={id} className="group/row relative py-3">
      {title && <h2 className="mb-2 px-4 text-lg font-semibold text-foreground md:px-8">{title}</h2>}
      <div className="relative">
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 z-10 hidden h-full w-10 items-center justify-center bg-gradient-to-r from-background/80 to-transparent opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
        <div
          ref={scroller}
          className="flex gap-2 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] md:px-8 [&::-webkit-scrollbar]:hidden"
        >
          {movies.map((m, i) => (
            <MovieCard key={m.id} movie={m} rank={ranked ? i + 1 : undefined} />
          ))}
        </div>
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 z-10 hidden h-full w-10 items-center justify-center bg-gradient-to-l from-background/80 to-transparent opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>
    </section>
  )
}
