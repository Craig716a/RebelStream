import { NextResponse } from "next/server"
import { getTmdbByGenre, getTmdbCatalog, getTmdbGenreNames } from "@/lib/tmdb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const genre = Number(searchParams.get("genre"))
    const page = Math.min(Math.max(Number(searchParams.get("page")) || 1, 1), 500)
    const [genres, items] = await Promise.all([
      getTmdbGenreNames(),
      Number.isInteger(genre) && genre > 0 ? getTmdbByGenre(genre, page) : getTmdbCatalog(page),
    ])
    const totalPages = Math.min(500, items.total_pages ?? 1)
    return NextResponse.json({ genres, items: items.items, page, total_pages: totalPages, total_results: items.total_results ?? 0 })
  } catch (error) {
    console.error("[v0] TMDB catalog request failed", error)
    return NextResponse.json({ error: "Unable to load the TMDB catalog" }, { status: 502 })
  }
}
