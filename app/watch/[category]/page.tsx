import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PublicTmdbPage } from "@/components/public-tmdb-page"
import { getTmdbByGenre, getTmdbGenreNames, slugifyTitle } from "@/lib/tmdb"

export const dynamic = "force-dynamic"
export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params
  const genre = (await getTmdbGenreNames()).find((item) => slugifyTitle(item.name) === category)
  return genre ? { title: `Watch ${genre.name} Movies and TV Shows — Rebel Stream`, description: `Browse ${genre.name} movies and TV shows with live TMDb data.` } : { title: "Category not found — Rebel Stream" }
}

export default async function WatchCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const genre = (await getTmdbGenreNames()).find((item) => slugifyTitle(item.name) === category)
  if (!genre) notFound()
  const { items } = await getTmdbByGenre(genre.id)
  return <PublicTmdbPage title={`Watch ${genre.name} Movies and TV Shows`} description={`Explore popular ${genre.name.toLowerCase()} movies and TV shows, updated from TMDb.`} items={items} breadcrumbs={[{ label: "Categories", href: "/catalog" }, { label: genre.name, href: `/watch/${category}` }]} />
}
