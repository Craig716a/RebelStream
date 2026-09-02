"use server"

import { db } from "@/lib/db"
import { movies, categories, seasons, episodes } from "@/lib/db/schema"
import { and, desc, eq, ilike, or, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// ---------- Public reads ----------

export async function getCategories() {
  return db.select().from(categories).orderBy(categories.sortOrder)
}

export async function getMoviesByCategory() {
  const cats = await getCategories()
  const rows = await db
    .select()
    .from(movies)
    .orderBy(desc(movies.views), desc(movies.likes), desc(movies.createdAt))
  return cats
    .map((c) => ({
      category: c,
      movies: rows.filter((m) => m.categoryId === c.id),
    }))
    .filter((group) => group.movies.length > 0)
}

// Netflix-style popularity: views lead, likes break ties.
export async function getPopularMovies(limit = 12) {
  return db
    .select()
    .from(movies)
    .orderBy(desc(movies.views), desc(movies.likes), desc(movies.createdAt))
    .limit(limit)
}

export async function getFeaturedMovie() {
  const [popular] = await getPopularMovies(1)
  return popular ?? null
}

export async function getMovieById(id: number) {
  const [movie] = await db.select().from(movies).where(eq(movies.id, id)).limit(1)
  return movie ?? null
}

export async function getSeriesEpisodes(movieId: number) {
  return db
    .select({ episode: episodes, season: seasons })
    .from(episodes)
    .innerJoin(seasons, eq(episodes.seasonId, seasons.id))
    .where(eq(seasons.movieId, movieId))
    .orderBy(seasons.seasonNumber, episodes.episodeNumber)
}

export async function searchMovies(query: string) {
  const q = `%${query}%`
  return db
    .select()
    .from(movies)
    .where(or(ilike(movies.title, q), ilike(movies.description, q)))
    .orderBy(desc(movies.createdAt))
}

// ---------- Engagement (public, no account) ----------

export async function incrementView(id: number) {
  await db
    .update(movies)
    .set({ views: sql`${movies.views} + 1` })
    .where(eq(movies.id, id))
}

export async function toggleLike(id: number, liked: boolean) {
  await db
    .update(movies)
    .set({ likes: sql`GREATEST(${movies.likes} + ${liked ? 1 : -1}, 0)` })
    .where(eq(movies.id, id))
  revalidatePath("/")
  const [movie] = await db.select({ likes: movies.likes }).from(movies).where(eq(movies.id, id))
  return movie?.likes ?? 0
}

// ---------- Admin CRUD ----------

export type MovieInput = {
  title: string
  description: string
  thumbnailUrl: string
  videoUrl: string
  categoryId: number
  year?: number | null
  rating?: string | null
  duration?: string | null
  featured?: boolean
  tmdbId?: string | null
}

export async function getAllMoviesAdmin() {
  const rows = await db
    .select({
      id: movies.id,
      title: movies.title,
      thumbnailUrl: movies.thumbnailUrl,
      videoUrl: movies.videoUrl,
      categoryId: movies.categoryId,
      categoryName: categories.name,
      views: movies.views,
      likes: movies.likes,
      featured: movies.featured,
      isSeries: movies.isSeries,
      createdAt: movies.createdAt,
    })
    .from(movies)
    .leftJoin(categories, eq(movies.categoryId, categories.id))
    .orderBy(desc(movies.createdAt))
  return rows
}

export async function getAdminStats() {
  const [stats] = await db
    .select({
      totalMovies: sql<number>`count(*)::int`,
      totalViews: sql<number>`coalesce(sum(${movies.views}), 0)::int`,
      totalLikes: sql<number>`coalesce(sum(${movies.likes}), 0)::int`,
    })
    .from(movies)
  return stats
}

export async function createMovie(input: MovieInput) {
  if (input.featured) {
    await db.update(movies).set({ featured: false }).where(eq(movies.featured, true))
  }
  await db.insert(movies).values({
    title: input.title,
    description: input.description,
    thumbnailUrl: input.thumbnailUrl,
    videoUrl: input.videoUrl,
    categoryId: input.categoryId,
    year: input.year ?? null,
    rating: input.rating ?? null,
    duration: input.duration ?? null,
    featured: input.featured ?? false,
    tmdbId: input.tmdbId ?? null,
  })
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function updateMovie(id: number, input: MovieInput) {
  if (input.featured) {
    await db
      .update(movies)
      .set({ featured: false })
      .where(and(eq(movies.featured, true)))
  }
  await db
    .update(movies)
    .set({
      title: input.title,
      description: input.description,
      thumbnailUrl: input.thumbnailUrl,
      videoUrl: input.videoUrl,
      categoryId: input.categoryId,
      year: input.year ?? null,
      rating: input.rating ?? null,
      duration: input.duration ?? null,
      featured: input.featured ?? false,
      tmdbId: input.tmdbId ?? null,
      updatedAt: new Date(),
    })
    .where(eq(movies.id, id))
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function deleteMovie(id: number) {
  await db.delete(movies).where(eq(movies.id, id))
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function getSeriesAdmin(movieId: number) {
  const rows = await db
    .select({ season: seasons, episode: episodes })
    .from(seasons)
    .leftJoin(episodes, eq(episodes.seasonId, seasons.id))
    .where(eq(seasons.movieId, movieId))
    .orderBy(seasons.seasonNumber, episodes.episodeNumber)
  return rows
}

export type SeasonInput = { movieId: number; seasonNumber: number; title?: string | null }
export type EpisodeInput = {
  seasonId: number
  episodeNumber: number
  title: string
  description?: string
  thumbnailUrl?: string | null
  videoUrl: string
  duration?: string | null
}

export async function createSeason(input: SeasonInput) {
  await db.insert(seasons).values({ movieId: input.movieId, seasonNumber: input.seasonNumber, title: input.title || null })
  revalidatePath("/admin")
}

export async function deleteSeason(id: number) {
  await db.delete(seasons).where(eq(seasons.id, id))
  revalidatePath("/admin")
}

export async function createEpisode(input: EpisodeInput) {
  await db.insert(episodes).values({
    seasonId: input.seasonId,
    episodeNumber: input.episodeNumber,
    title: input.title,
    description: input.description ?? "",
    thumbnailUrl: input.thumbnailUrl || null,
    videoUrl: input.videoUrl,
    duration: input.duration || null,
  })
  revalidatePath("/admin")
}

export async function updateEpisode(id: number, input: EpisodeInput) {
  await db.update(episodes).set({
    episodeNumber: input.episodeNumber,
    title: input.title,
    description: input.description ?? "",
    thumbnailUrl: input.thumbnailUrl || null,
    videoUrl: input.videoUrl,
    duration: input.duration || null,
  }).where(eq(episodes.id, id))
  revalidatePath("/admin")
}

export async function deleteEpisode(id: number) {
  await db.delete(episodes).where(eq(episodes.id, id))
  revalidatePath("/admin")
}
