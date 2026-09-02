import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { categories as categoriesTable, movies as moviesTable } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { getCategories } from "@/app/actions/movies"
import { SiteHeader } from "@/components/site-header"
import { MovieCard } from "@/components/movie-card"
import { SiteFooter } from "@/components/site-footer"

export const dynamic = "force-dynamic"

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [category] = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, slug)).limit(1)
  if (!category) notFound()

  const [allCategories, list] = await Promise.all([
    getCategories(),
    db.select().from(moviesTable).where(eq(moviesTable.categoryId, category.id)).orderBy(desc(moviesTable.createdAt)),
  ])

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader categories={allCategories} />
      <main className="mx-auto max-w-[1600px] px-4 pb-16 pt-24 md:px-8">
        <h1 className="mb-6 text-2xl font-bold md:text-3xl">{category.name}</h1>
        {list.length === 0 ? (
          <p className="text-muted-foreground">No titles in this category yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {list.map((m) => (
              <div key={m.id} className="w-full">
                <MovieCard movie={m} />
              </div>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
