import Link from "next/link"
import { LiveTmdbCatalog } from "@/components/live-tmdb-catalog"
import { SiteHeader } from "@/components/site-header"

export const dynamic = "force-dynamic"

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader categories={[]} />
      <main className="mx-auto max-w-[1600px] px-4 py-10 md:px-8">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Back</Link>
        <LiveTmdbCatalog />
      </main>
    </div>
  )
}
