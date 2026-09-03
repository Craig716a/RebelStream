"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Info, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { tmdbImage, tmdbTitle, tmdbWatchPath, tmdbYear, type TmdbTitle } from "@/lib/tmdb"

export function TmdbFeaturedHero({ items }: { items: TmdbTitle[] }) {
  const [active, setActive] = useState(0)
  const current = items[active]

  useEffect(() => {
    if (items.length < 2) return
    const timer = window.setInterval(() => setActive((index) => (index + 1) % items.length), 7000)
    return () => window.clearInterval(timer)
  }, [items.length])

  if (!current) return null
  const title = tmdbTitle(current)
  const backdrop = tmdbImage(current.backdrop_path, "original") ?? tmdbImage(current.poster_path, "w1280")

  return (
    <section aria-label="Featured popular titles" className="relative isolate min-h-[530px] overflow-hidden border-b border-border md:min-h-[680px]">
      {backdrop && <img src={backdrop} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/75 to-background/15" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/10 to-transparent" />
      <div className="mx-auto flex min-h-[530px] max-w-7xl items-end px-4 pb-16 md:min-h-[680px] md:px-8 md:pb-24">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary">Popular on Rebel Stream</p>
          <h1 className="text-balance text-4xl font-black tracking-tight md:text-7xl">{title}</h1>
          <p className="mt-4 flex items-center gap-3 text-sm text-foreground/75"><span>{tmdbYear(current)}</span><span aria-hidden="true">•</span><span>{current.media_type === "tv" ? "Series" : "Movie"}</span><span aria-hidden="true">•</span><span>{current.vote_average.toFixed(1)} rating</span></p>
          <p className="mt-4 line-clamp-3 max-w-xl text-pretty leading-6 text-foreground/80 md:text-lg">{current.overview}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button render={<Link href={`${tmdbWatchPath(current)}?autoplay=1`} />} nativeButton={false} size="lg" className="gap-2 font-bold"><Play data-icon="inline-start" className="fill-current" />Play</Button>
            <Button render={<Link href={tmdbWatchPath(current)} />} nativeButton={false} size="lg" variant="secondary" className="gap-2"><Info data-icon="inline-start" />More info</Button>
          </div>
          <div className="mt-8 flex gap-2" aria-label="Featured title selector">
            {items.map((item, index) => <button key={`${item.media_type}-${item.id}`} type="button" aria-label={`Show ${tmdbTitle(item)}`} aria-current={index === active} onClick={() => setActive(index)} className={`h-1.5 rounded-full transition-all ${index === active ? "w-8 bg-primary" : "w-4 bg-foreground/40"}`} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
