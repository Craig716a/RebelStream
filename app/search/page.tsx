import { searchTmdb } from "@/lib/tmdb"
import { SiteHeader } from "@/components/site-header"
import { TmdbGrid } from "@/components/tmdb-grid"
import { SiteFooter } from "@/components/site-footer"

export const dynamic = "force-dynamic"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = (q ?? "").trim()
  const { items: results } = query
    ? await searchTmdb(query)
    : { items: [] }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
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

        <TmdbGrid items={results} />
      </main>
      <SiteFooter />
    </div>
  )
}
