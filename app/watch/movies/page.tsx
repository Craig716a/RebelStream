import type { Metadata } from "next"
import { PublicTmdbPage } from "@/components/public-tmdb-page"
import { getTmdbByType } from "@/lib/tmdb"

export const dynamic = "force-dynamic"
export const revalidate = 3600
export const metadata: Metadata = {
  title: "Watch Movies Online — Rebel Stream",
  description: "Browse popular movies, new releases, and highly rated films with live TMDb data.",
}

export default async function WatchMoviesPage() {
  const { items } = await getTmdbByType("movie")
  return <PublicTmdbPage title="Watch Movies" description="Explore popular movies and discover your next film night pick." items={items} breadcrumbs={[{ label: "Movies", href: "/watch/movies" }]} />
}
