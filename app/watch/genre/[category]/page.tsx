import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PublicTmdbPage } from "@/components/public-tmdb-page"
import { getTmdbByGenre, getTmdbGenreNames, slugifyTitle } from "@/lib/tmdb"

export const dynamic = "force-dynamic"
export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params
  const genre = (await getTmdbGenreNames()).find((item) => slugifyTitle(item.name) === type)
  return genre ? { title: `Watch ${genre.name} Movies and TV Shows — Rebel Stream`, description: `Browse free ${genre.name} movies and TV shows with live TMDb data.`, keywords: [`free ${genre.name.toLowerCase()} movies`, `free ${genre.name.toLowerCase()} TV shows`, "free movies"] } : { title: "Category not found — Rebel Stream" }
}

export default async function WatchCategoryPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params
  const genre = (await getTmdbGenreNames()).find((item) => slugifyTitle(item.name) === type)
  if (!genre) notFound()
  const { items } = await getTmdbByGenre(genre.id)
  return <PublicTmdbPage title={`Watch ${genre.name} Movies and TV Shows`} description={`Explore popular ${genre.name.toLowerCase()} movies and TV shows, updated from TMDb.`} items={items} breadcrumbs={[{ label: "Categories", href: "/catalog" }, { label: genre.name, href: `/watch/${type}` }]} />
}
