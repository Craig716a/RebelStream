import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rebelstream.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticRoutes = ["/", "/search"]
  return staticRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }))
}
