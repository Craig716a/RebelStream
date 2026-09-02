import { NextRequest, NextResponse } from "next/server"
import { getTmdbTitle, tmdbImage } from "@/lib/tmdb"

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")?.trim()
  const type = request.nextUrl.searchParams.get("type") === "tv" ? "tv" : "movie"

  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json({ error: "Enter a valid TMDB ID or URL." }, { status: 400 })
  }

  try {
    const item = await getTmdbTitle(Number(id), type)
    const runtime = type === "movie" ? item.runtime : item.episode_run_time?.[0]
    return NextResponse.json({
      tmdbId: String(item.id),
      title: item.title ?? item.name ?? "",
      description: item.overview ?? "",
      thumbnailUrl: tmdbImage(item.poster_path, "w780") ?? "",
      year: (item.release_date ?? item.first_air_date ?? "").slice(0, 4),
      duration: runtime ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : "",
      rating: item.vote_average ? item.vote_average.toFixed(1) : "",
    })
  } catch {
    return NextResponse.json({ error: "TMDB title could not be found." }, { status: 404 })
  }
}
