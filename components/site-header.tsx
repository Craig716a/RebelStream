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
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-6 px-4 md:px-8">
        <Link href="/" className="shrink-0">
          <span className="text-3xl font-extrabold uppercase tracking-tight text-primary md:text-4xl">
            Rebel<span className="text-primary">Stream</span>
          </span>
        </Link>

        <div className="flex-1" />

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/sign-in"
            aria-label="Admin sign in"
            title="Admin sign in"
            className="h-2 w-2 shrink-0 rounded-full bg-foreground/35 transition-colors hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          />
          <form onSubmit={submit} className="flex items-center">
            <div
              className={cn(
                "flex items-center overflow-hidden rounded-md border transition-all duration-300",
                searchOpen ? "w-44 border-border bg-black/60 px-2 md:w-64" : "w-9 border-transparent",
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
                  "h-9 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground",
                  !searchOpen && "pointer-events-none",
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
