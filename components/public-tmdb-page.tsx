import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { TmdbGrid } from "@/components/tmdb-grid"
import type { TmdbTitle } from "@/lib/tmdb"

export function PublicTmdbPage({
  title,
  description,
  items,
  breadcrumbs = [],
}: {
  title: string
  description: string
  items: TmdbTitle[]
  breadcrumbs?: Array<{ label: string; href: string }>
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-[1600px] px-4 pb-16 pt-24 md:px-8">
        <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          {breadcrumbs.map((crumb) => <span key={crumb.href}>/ <Link href={crumb.href} className="hover:text-foreground">{crumb.label}</Link></span>)}
        </nav>
        <h1 className="text-balance text-3xl font-bold md:text-5xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-pretty leading-relaxed text-muted-foreground">{description}</p>
        <section aria-label={title} className="mt-8">
          {items.length ? <TmdbGrid items={items} /> : <p className="text-muted-foreground">No titles are available right now.</p>}
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
