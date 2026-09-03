const TMDB_API = "https://api.themoviedb.org/3"
const IMAGE_BASE = "https://image.tmdb.org/t/p/w780"

async function tmdbFetch<T>(path: string): Promise<T> {
  const apiKey = process.env.TMDB_API_KEY
  const readAccessToken = process.env.TMDB_API_READ_ACCESS_TOKEN
  if (!apiKey && !readAccessToken) throw new Error("TMDB_API_KEY is not configured")
  const separator = path.includes("?") ? "&" : "?"
  const url = apiKey
    ? `${TMDB_API}${path}${separator}api_key=${encodeURIComponent(apiKey)}`
    : `${TMDB_API}${path}`
  const response = await fetch(url, {
    headers: {
      ...(apiKey ? {} : { Authorization: `Bearer ${readAccessToken}` }),
      accept: "application/json",
    },
    next: { revalidate: 3600 },
  })
  if (!response.ok) throw new Error(`TMDB request failed: ${response.status}`)
  return response.json()
}

export type TmdbTitle = {
  id: number
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  first_air_date?: string
  vote_average: number
  media_type?: "movie" | "tv"
  genre_ids?: number[]
  genre_names?: string[]
}

export function tmdbImage(path: string | null, size = "w780") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null
}

export type TmdbGenre = { id: number; name: string }

export async function getTmdbGenres(type: "movie" | "tv" = "movie") {
  const data = await tmdbFetch<{ genres: TmdbGenre[] }>(`/genre/${type}/list?language=en-US`)
  return data.genres
}

export async function getTmdbPopular(limit = 8) {
  const [movies, shows] = await Promise.all([
    tmdbFetch<{ results: TmdbTitle[] }>(`/movie/popular?language=en-US&page=1`),
    tmdbFetch<{ results: TmdbTitle[] }>(`/tv/popular?language=en-US&page=1`),
  ])
  return [
    ...movies.results.map((item) => ({ ...item, media_type: "movie" as const })),
    ...shows.results.map((item) => ({ ...item, media_type: "tv" as const })),
  ].sort((a, b) => b.vote_average - a.vote_average).slice(0, limit)
}

export async function getTmdbCatalog(page = 1) {
  const data = await tmdbFetch<{ results: TmdbTitle[]; page?: number; total_pages?: number; total_results?: number }>(`/trending/all/week?language=en-US&page=${page}`
  const items = data.results.filter((item) => item.media_type === "movie" || item.media_type === "tv")
  return { items, page: data.page ?? page, total_pages: data.total_pages ?? 1, total_results: data.total_results ?? items.length }
}

export async function getTmdbByGenre(genreId: number, page = 1) {
  const [movies, shows] = await Promise.all([
    tmdbFetch<{ results: TmdbTitle[]; page?: number; total_pages?: number; total_results?: number }>(`/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&language=en-US&page=${page}`),
    tmdbFetch<{ results: TmdbTitle[]; page?: number; total_pages?: number; total_results?: number }>(`/discover/tv?with_genres=${genreId}&sort_by=popularity.desc&language=en-US&page=${page}`),
  ])
  const items = [
    ...movies.results.map((item) => ({ ...item, media_type: "movie" as const })),
    ...shows.results.map((item) => ({ ...item, media_type: "tv" as const })),
  ].sort((a, b) => b.vote_average - a.vote_average)
  return {
    items,
    page,
    total_pages: Math.max(movies.total_pages ?? 1, shows.total_pages ?? 1),
    total_results: (movies.total_results ?? 0) + (shows.total_results ?? 0),
  }
}

export async function getTmdbGenreNames() {
  const [movies, shows] = await Promise.all([getTmdbGenres("movie"), getTmdbGenres("tv")])
  const unique = new Map<number, TmdbGenre>()
  for (const genre of [...movies, ...shows]) unique.set(genre.id, genre)
  return [...unique.values()].sort((a, b) => a.name.localeCompare(b.name))
}

export async function searchTmdb(query: string, page = 1) {
  const data = await tmdbFetch<{ results: TmdbTitle[]; page?: number; total_pages?: number; total_results?: number }>(`/search/multi?query=${encodeURIComponent(query)}&language=en-US&page=${page}&include_adult=false`)
  const items = data.results.filter((item) => item.media_type === "movie" || item.media_type === "tv")
  return { items, page: data.page ?? page, total_pages: data.total_pages ?? 1, total_results: data.total_results ?? items.length }
}

export async function getTmdbTitle(id: number, type: "movie" | "tv") {
  return tmdbFetch<TmdbTitle & { runtime?: number; episode_run_time?: number[] }>(`/${type}/${id}?language=en-US`)
}

export function tmdbTitle(item: TmdbTitle) {
  return item.title ?? item.name ?? "Untitled"
}

export function tmdbYear(item: TmdbTitle) {
  return (item.release_date ?? item.first_air_date ?? "").slice(0, 4)
}

export function slugifyTitle(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "title"
}

export function tmdbWatchPath(item: TmdbTitle) {
  const type = item.media_type === "tv" ? "tv" : "movie"
  return `/watch/${type}/${item.id}`
}

export { IMAGE_BASE }
