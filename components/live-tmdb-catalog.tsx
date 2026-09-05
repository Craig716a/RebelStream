"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { tmdbImage, tmdbTitle, tmdbWatchPath, tmdbYear, type TmdbGenre, type TmdbTitle } from "@/lib/tmdb"

export function LiveTmdbCatalog() {
  const [items, setItems] = useState<TmdbTitle[]>([])
  const [genres, setGenres] = useState<TmdbGenre[]>([])
  const [genre, setGenre] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState("")
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const controller = new AbortController()
    setPage(1)
    setLoading(true)
    setError("")
    fetch(`/api/tmdb/catalog${genre ? `?genre=${genre}&page=1` : "?page=1"}`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Catalog unavailable")
        return data
      })
      .then((data) => {
        setItems(data.items)
        setGenres(data.genres)
        setTotalPages(data.total_pages)
        setTotalResults(data.total_results)
      })
      .catch((err) => { if (err.name !== "AbortError") setError(err.message) })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [genre])

  async function loadMore() {
    if (loadingMore || page >= totalPages) return
    setLoadingMore(true)
    try {
      const response = await fetch(`/api/tmdb/catalog?${genre ? `genre=${genre}&` : ""}page=${page + 1}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to load more titles")
      setItems((current) => {
        const seen = new Set(current.map((item) => `${item.media_type}-${item.id}`))
        return [...current, ...data.items.filter((item: TmdbTitle) => !seen.has(`${item.media_type}-${item.id}`))]
      })
      setPage(data.page)
      setTotalPages(data.total_pages)
      setTotalResults(data.total_results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load more titles")
    } finally {
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    const sentinel = loadMoreRef.current
    if (!sentinel || page >= totalPages || loading) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore()
      },
      { rootMargin: "900px 0px" },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [page, totalPages, loading, loadingMore, genre])

  return (
    <section aria-label="TMDB catalog" className="mt-8">
      <div className="mb-6 flex max-w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Movie categories">
        <button type="button" onClick={() => setGenre("")} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs ${!genre ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>Popular</button>
        {genres.filter((item) => !["Action", "Adventure"].includes(item.name)).map((item) => <button key={item.id} type="button" onClick={() => setGenre(String(item.id))} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs ${genre === String(item.id) ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{item.name}</button>)}
      </div>
      {loading && <p className="py-16 text-center text-muted-foreground">Loading movies and series…</p>}
      {error && <p role="alert" className="py-16 text-center text-destructive">{error}</p>}
      {!loading && !error && <>
        <p className="mb-4 text-sm text-muted-foreground">Showing {items.length.toLocaleString()} of {totalResults.toLocaleString()} titles</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">{items.map((item) => <Link key={`${item.media_type}-${item.id}`} href={tmdbWatchPath(item)} className="group min-w-0"><div className="aspect-[2/3] overflow-hidden rounded-md bg-muted">{item.poster_path ? <img src={tmdbImage(item.poster_path)!} alt={`${tmdbTitle(item)} poster`} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" /> : <div className="flex h-full items-center justify-center p-3 text-center text-sm text-muted-foreground">No poster</div>}</div><h2 className="mt-2 truncate font-semibold">{tmdbTitle(item)}</h2><p className="text-sm text-muted-foreground">{tmdbYear(item)} · {item.media_type === "tv" ? "Series" : "Movie"}</p></Link>)}</div>
        {page < totalPages && <div ref={loadMoreRef} className="flex min-h-24 items-center justify-center py-8" aria-live="polite">{loadingMore && <p className="text-sm text-muted-foreground">Loading more titles…</p>}</div>}
      </>}
    </section>
  )
}
