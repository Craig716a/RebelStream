import { Suspense } from "react"
import type { Movie } from "@/lib/db/schema"
import { getCategories, getFeaturedMovie, getMoviesByCategory, getPopularMovies } from "@/app/actions/movies"
import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { MovieRow } from "@/components/movie-row"
import { SiteFooter } from "@/components/site-footer"
import { EmptyState } from "@/components/empty-state"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [categories, featured, popular, grouped] = await Promise.all([
    getCategories(),
    getFeaturedMovie(),
    getPopularMovies(10),
    getMoviesByCategory(),
  ])

  const mixedMovies: Movie[] = grouped
    .flatMap(({ movies }) => movies)
    .filter((movie) => movie.id !== featured?.id)
    .sort(() => Math.random() - 0.5)

  const hasContent = grouped.length > 0 || !!featured

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="h-16" />}>
        <SiteHeader categories={categories} />
      </Suspense>

      {!hasContent ? (
        <EmptyState />
      ) : (
        <main className="pb-16">
          {featured && <Hero movie={featured} />}
          <div className="relative z-20 -mt-8 space-y-2 md:-mt-16">
            {popular.length > 0 && <MovieRow id="popular" title="Popular on Rebel Stream" movies={popular} ranked />}
            {mixedMovies.length > 0 && <MovieRow movies={mixedMovies} />}
          </div>
        </main>
      )}

      <SiteFooter />
    </div>
  )
}
