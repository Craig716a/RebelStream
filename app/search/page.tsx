import { getCategories, searchMovies } from "@/app/actions/movies"
import { SiteHeader } from "@/components/site-header"
import { MovieCard } from "@/components/movie-card"
import { SiteFooter } from "@/components/site-footer"

export const dynamic = "force-dynamic"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = (q ?? "").trim()
  const [categories, results] = await Promise.all([
    getCategories(),
    query ? searchMovies(query) : Promise.resolve([]),
  ])

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader categories={categories} />
      <main className="mx-auto max-w-[1600px] px-4 pb-16 pt-24 md:px-8">
        <h1 className="mb-6 text-2xl font-bold">
          {query ? (
            <>
              Results for <span className="text-primary">{query}</span>
            </>
          ) : (
            "Search"
          )}
        </h1>

        {query && results.length === 0 && (
          <p className="text-muted-foreground">No titles match your search. Try another term.</p>
        )}

        {!query && <p className="text-muted-foreground">Type a title or genre in the search bar above.</p>}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {results.map((m) => (
            <div key={m.id} className="w-full">
              <MovieCard movie={m} />
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
