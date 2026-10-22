"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CircleUserRound, Info, Play, Share2, Star } from "lucide-react"
import { tmdbImage, tmdbTitle, tmdbWatchPath, tmdbYear, type TmdbTitle } from "@/lib/tmdb"

export function TmdbFeaturedHero({ items }: { items: TmdbTitle[] }) {
  const [active, setActive] = useState(0)
  const current = items[active]
  useEffect(() => { const timer = window.setInterval(() => setActive((index) => (index + 1) % items.length), 7000); return () => window.clearInterval(timer) }, [items.length])
  if (!current) return null
  const title = tmdbTitle(current)
  const backdrop = tmdbImage(current.backdrop_path, "original") ?? tmdbImage(current.poster_path, "w1280")
  return <section className="relative isolate min-h-[560px] overflow-hidden border-b border-white/10 bg-black pt-[180px] sm:min-h-[610px]" aria-label="Featured film">
    {backdrop && <img src={backdrop} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-65" />}
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/75 to-black/20" />
    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/20 to-black/25" />
    <div className="relative mx-auto flex min-h-[380px] max-w-[1120px] flex-col justify-end px-8 pb-12 sm:px-10 sm:pb-16">
      <div className="mb-7 flex items-center gap-4 font-mono text-sm uppercase tracking-[0.16em] text-[#b8b6c0]"><span className="rounded-md border border-white/25 px-3 py-2">Featured film</span><span className="flex items-center gap-1 text-amber-300"><Star className="size-4 fill-current" />{current.vote_average.toFixed(1)}</span></div>
      <h1 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-6xl">{title}</h1>
      <p className="mt-5 flex items-center gap-3 font-mono text-lg text-[#d1ced7]"><span>{tmdbYear(current)}</span><span>•</span><span>{current.media_type === "tv" ? "Series" : "Movie"}</span></p>
      <p className="mt-6 line-clamp-2 max-w-3xl text-lg leading-8 text-[#dedbe2]">{current.overview}</p>
      <div className="mt-8 flex gap-4"><Link href={`${tmdbWatchPath(current)}?autoplay=1`} className="flex h-[60px] flex-1 items-center justify-center gap-3 rounded-2xl bg-white px-5 text-lg font-bold text-black sm:flex-none sm:min-w-[220px]"><Play className="size-6 fill-current" />Watch Now</Link><Link href={tmdbWatchPath(current)} className="flex h-[60px] flex-1 items-center justify-center gap-3 rounded-2xl border border-white/20 bg-[#161619] px-5 text-lg font-semibold text-white sm:flex-none sm:min-w-[170px]"><Info className="size-6" />Details</Link><button type="button" className="hidden h-[60px] min-w-[155px] items-center justify-center gap-3 rounded-2xl border border-white/20 bg-[#161619] px-5 text-lg font-semibold text-white sm:flex"><Share2 className="size-6" />Share</button></div>
    </div>
  </section>
}
