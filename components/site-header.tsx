"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function SiteHeader(_props?: { categories?: unknown[] }) {
  const router = useRouter()
  const params = useSearchParams()
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState(params.get("q") ?? "")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80" : "bg-gradient-to-b from-black/80 to-transparent",
      )}
    >
      <div className="mx-auto flex min-h-16 max-w-[1600px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 md:h-16 md:flex-nowrap md:gap-6 md:px-8 md:py-0">
        <Link href="/" className="min-w-0 shrink-0">
          <span className="text-3xl font-extrabold uppercase tracking-tight text-primary md:text-4xl">
            Rebel<span className="text-primary">Stream</span>
          </span>
        </Link>

        <div className="hidden flex-1 md:block" />

        <div className="order-3 flex w-full items-center gap-2 md:order-none md:ml-auto md:w-auto">
          <form onSubmit={submit} className="flex min-w-0 flex-1 items-center md:flex-none">
            <div
              className={cn(
                "flex min-w-0 w-full items-center overflow-hidden rounded-md border border-border bg-black/60 px-2 transition-all duration-300 md:w-9 md:border-transparent md:bg-transparent md:px-0",
                searchOpen && "md:w-64 md:border-border md:bg-black/60 md:px-2",
              )}
            >
              <button
                type="button"
                aria-label="Search"
                onClick={() => setSearchOpen((v) => !v)}
                className="grid h-9 w-9 shrink-0 place-items-center text-foreground"
              >
                <Search className="h-5 w-5" />
              </button>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Titles, genres"
                className={cn(
                  "h-9 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground",
                  !searchOpen && "md:pointer-events-none",
                )}
              />
              {searchOpen && query && (
                <button type="button" aria-label="Clear search" onClick={() => setQuery("")}>
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </header>
  )
}
