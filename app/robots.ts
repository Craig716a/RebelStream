import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rebelstream.vercel.app"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: ["/", "/movie/", "/category/", "/search"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
