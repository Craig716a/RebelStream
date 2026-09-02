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
        <div className="mt-4 flex flex-col gap-3">
          <h1 className="text-balance text-3xl font-bold text-primary md:text-5xl">Browse movies and series</h1>
        </div>
        <LiveTmdbCatalog />
      </main>
    </div>
  )
}
