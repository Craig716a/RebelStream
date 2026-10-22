import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rebelstream.vercel.app"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{
      userAgent: "*",
      allow: ["/", "/watch", "/catalog", "/movie/", "/category/", "/search"],
      disallow: ["/admin", "/portal", "/sign-in", "/sign-up", "/api"],
    }],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
