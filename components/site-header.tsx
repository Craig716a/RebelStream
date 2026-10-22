"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Bookmark, Clock3, Layers3, Search, Sparkles } from "lucide-react"

export function SiteHeader() {
  const router = useRouter()
  const params = useSearchParams()
  const [query, setQuery] = useState(params.get("q") ?? "")
  const [searchOpen, setSearchOpen] = useState(false)

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const controls = [
    { icon: Search, label: "Search", action: () => setSearchOpen((open) => !open) },
    { icon: Bookmark, label: "Saved", href: "/search?saved=1" },
    { icon: Clock3, label: "History", href: "/search?history=1" },
    { icon: Layers3, label: "Movies", href: "/catalog" },
    { icon: Sparkles, label: "Discover", href: "/category/popular" },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[104px] max-w-[1120px] items-center gap-3 px-5 sm:h-[112px] sm:px-8">
        <Link href="/" aria-label="Rebel Stream home" className="flex shrink-0 items-center gap-3">
          <span className="grid size-14 place-items-center rounded-xl bg-white text-[22px] font-medium tracking-tight text-black shadow-sm">fx</span>
          <span className="text-[25px] font-bold tracking-[-0.06em] text-white">frame<span className="font-black">xTV</span></span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          {controls.map(({ icon: Icon, label, href, action }) => href ? (
            <Link key={label} href={href} aria-label={label} className="grid size-[52px] place-items-center rounded-2xl border border-white/10 bg-[#080808] text-[#a5a3b0] transition hover:border-white/30 hover:text-white">
              <Icon className="size-6" strokeWidth={1.8} />
            </Link>
          ) : (
            <button key={label} type="button" aria-label={label} onClick={action} className="grid size-[52px] place-items-center rounded-2xl border border-white/10 bg-[#080808] text-[#a5a3b0] transition hover:border-white/30 hover:text-white">
              <Icon className="size-6" strokeWidth={1.8} />
            </button>
          ))}
        </div>
      </div>
      {searchOpen && <form onSubmit={submit} className="border-t border-white/10 bg-black px-5 py-3"><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search movies and series" className="h-12 w-full rounded-xl border border-white/15 bg-[#111] px-4 text-base text-white outline-none placeholder:text-[#777] focus:border-white/40" /></form>}
      <nav className="mx-auto flex h-[76px] max-w-[1120px] items-center justify-around border-t border-white/10 bg-black px-2 md:hidden" aria-label="Mobile navigation">
        {[[Layers3, "Home", "/"], [Search, "Movies", "/catalog"], [Clock3, "TV", "/category/tv"], [Sparkles, "Anime", "/category/anime"], [Bookmark, "API", "/search"]].map(([Icon, label, href]) => <Link key={label as string} href={href as string} className="flex min-w-14 flex-col items-center gap-1 text-[12px] text-[#777582]"><Icon className="size-6" strokeWidth={1.8} /><span>{label as string}</span></Link>)}
      </nav>
    </header>
  )
}
