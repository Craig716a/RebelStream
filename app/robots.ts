import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://app-restoration.vercel.app"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: ["/", "/watch", "/catalog", "/movie"] , disallow: ["/admin", "/portal", "/sign-in", "/sign-up", "/api"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
