"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Info, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { tmdbImage, tmdbTitle, tmdbWatchPath, tmdbYear, type TmdbTitle } from "@/lib/tmdb"

export function TmdbFeaturedHero({ items }: { items: TmdbTitle[] }) {
  const storageKey = "rebel-stream-featured-index"
  const [active, setActive] = useState(0)
  const current = items[active]

  useEffect(() => {
    if (items.length < 2) return
    const saved = Number.parseInt(window.sessionStorage.getItem(storageKey) ?? "0", 10)
    if (Number.isInteger(saved) && saved >= 0) setActive(saved % items.length)
  }, [items.length])

  useEffect(() => {
    if (items.length < 2) return
    const timer = window.setInterval(() => {
      setActive((index) => {
        const next = (index + 1) % items.length
        window.sessionStorage.setItem(storageKey, String(next))
        return next
      })
    }, 7000)
    return () => window.clearInterval(timer)
  }, [items.length])

  if (!current) return null
  const title = tmdbTitle(current)
  const backdrop = tmdbImage(current.backdrop_path, "original") ?? tmdbImage(current.poster_path, "w1280")

  return (
    <section aria-label="Featured popular titles" className="relative isolate min-h-[760px] overflow-hidden border-b border-white/10 md:min-h-[720px]">
      {backdrop && <img src={backdrop} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/70 to-black/15" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/25 to-transparent" />
      <div className="mx-auto flex min-h-[760px] max-w-7xl items-end px-8 pb-24 md:min-h-[720px] md:px-8 md:pb-20">
        <div className="max-w-2xl">
          <p className="mb-6 text-[26px] font-semibold uppercase tracking-[0.24em] text-white/90 md:text-lg">Popular on Rebel Stream</p>
          <h1 className="text-balance text-6xl font-black tracking-tight md:text-7xl">{title}</h1>
          <p className="mt-8 flex items-center gap-5 text-[25px] text-white/75 md:text-lg"><span>{tmdbYear(current)}</span><span aria-hidden="true">•</span><span>{current.media_type === "tv" ? "Series" : "Movie"}</span><span aria-hidden="true">•</span><span>{current.vote_average.toFixed(1)} rating</span></p>
          <p className="mt-8 line-clamp-3 max-w-3xl text-pretty text-[25px] leading-[1.45] text-white/80 md:text-lg">{current.overview}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button render={<Link href={`${tmdbWatchPath(current)}?autoplay=1`} />} nativeButton={false} size="lg" className="h-16 rounded-xl gap-3 px-7 text-2xl font-bold md:h-12 md:text-base"><Play data-icon="inline-start" className="fill-current" />Play</Button>
            <Button render={<Link href={tmdbWatchPath(current)} />} nativeButton={false} size="lg" variant="secondary" className="h-16 rounded-xl gap-3 px-7 text-2xl md:h-12 md:text-base"><Info data-icon="inline-start" />More info</Button>
          </div>
          <div className="mt-8 flex gap-2" aria-label="Featured title selector">
            {items.map((item, index) => <button key={`${item.media_type}-${item.id}`} type="button" aria-label={`Show ${tmdbTitle(item)}`} aria-current={index === active} onClick={() => {
                setActive(index)
                window.sessionStorage.setItem(storageKey, String(index))
              }} className={`h-1.5 rounded-full transition-all ${index === active ? "w-8 bg-primary" : "w-4 bg-foreground/40"}`} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
