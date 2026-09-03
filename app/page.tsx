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
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="h-16" />}>
        <SiteHeader />
      </Suspense>

      <main className="pb-16">
        {popular.length > 0 && <TmdbFeaturedHero items={popular} />}
        <div className="mx-auto max-w-7xl px-4 pt-8">
          <LiveTmdbCatalog />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
