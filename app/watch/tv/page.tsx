import type { Metadata } from "next"
import { PublicTmdbPage } from "@/components/public-tmdb-page"
import { getTmdbByType } from "@/lib/tmdb"

export const dynamic = "force-dynamic"
export const revalidate = 3600
export const metadata: Metadata = {
  title: "Watch TV Shows Online — Rebel Stream",
  description: "Browse free TV shows and series with live TMDb data.",
  keywords: ["free TV shows", "watch free series", "TV shows online"],
}

export default async function WatchTvPage() {
  const { items } = await getTmdbByType("tv")
  return <PublicTmdbPage title="Watch TV Shows" description="Browse popular series, returning favorites, and new TV discoveries." items={items} breadcrumbs={[{ label: "TV Shows", href: "/watch/tv" }]} />
}
