import type { MetadataRoute } from "next"
import { getTmdbByType, getTmdbGenreNames, slugifyTitle, tmdbWatchPath } from "@/lib/tmdb"

export const dynamic = "force-dynamic"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rebelstream.vercel.app"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = [1, 2, 3, 4, 5]
  const [moviePages, tvPages, genres] = await Promise.all([
    Promise.all(pages.map((page) => getTmdbByType("movie", page))),
    Promise.all(pages.map((page) => getTmdbByType("tv", page))),
    getTmdbGenreNames(),
  ])
  const movies = moviePages.flatMap((result) => result.items)
  const shows = tvPages.flatMap((result) => result.items)
  const urls = new Map<string, MetadataRoute.Sitemap[number]>()
  const add = (path: string, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "daily", priority = 0.7) => urls.set(path, { url: `${siteUrl}${path}`, lastModified: new Date(), changeFrequency, priority })

  add("/", "daily", 1)
  add("/catalog", "daily", 0.9)
  add("/search", "weekly", 0.7)
  add("/watch/movies", "daily", 0.9)
  add("/watch/tv", "daily", 0.9)
  for (const genre of genres) add(`/watch/genre/${slugifyTitle(genre.name)}`, "daily", 0.75)
  for (const title of [...movies, ...shows]) add(tmdbWatchPath(title), "weekly", 0.65)

  return [...urls.values()].slice(0, 100)
}
