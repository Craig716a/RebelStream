import Link from "next/link"
import { Suspense } from "react"
import { getTmdbPopular } from "@/lib/tmdb"
import { SiteHeader } from "@/components/site-header"
import { TmdbFeaturedHero } from "@/components/tmdb-featured-hero"
import { SiteFooter } from "@/components/site-footer"
import { LiveTmdbCatalog } from "@/components/live-tmdb-catalog"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const popular = await getTmdbPopular(10)

  return (
    <div className="min-h-screen bg-black text-white">
      <Suspense fallback={<div className="h-16" />}>
        <SiteHeader />
      </Suspense>

      <main className="pb-[112px] pt-[104px] md:pt-[112px]">
        {popular.length > 0 && <TmdbFeaturedHero items={popular} />}
        <div className="mx-auto max-w-[1120px] px-8 pt-10 sm:px-10">
          <LiveTmdbCatalog />
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto flex h-[76px] max-w-[1120px] items-center justify-around border-t border-white/10 bg-black/95 px-2 backdrop-blur-xl md:hidden"><Link href="/" className="flex flex-col items-center gap-1 text-xs text-white"><span className="text-xl">⌂</span><span>Home</span></Link><Link href="/catalog" className="flex flex-col items-center gap-1 text-xs text-[#777582]"><span className="text-xl">▦</span><span>Movies</span></Link><Link href="/category/tv" className="flex flex-col items-center gap-1 text-xs text-[#777582]"><span className="text-xl">▱</span><span>TV</span></Link><Link href="/category/anime" className="flex flex-col items-center gap-1 text-xs text-[#777582]"><span className="text-xl">✧</span><span>Anime</span></Link><Link href="/search" className="flex flex-col items-center gap-1 text-xs text-[#777582]"><span className="text-xl">›_</span><span>API</span></Link></div>
      <SiteFooter />
    </div>
  )
}
