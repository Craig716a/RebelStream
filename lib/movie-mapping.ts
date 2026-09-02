export type MovieMappingEntry = {
  uuid: string
  slug: string
}

/**
 * Internal playback identifiers for movies in the catalog.
 * The object key is the TMDb movie ID used by the public route.
 */
export const movieMapping: Record<string, MovieMappingEntry> = {
  "550": {
    uuid: "8f4e4d0a-1d66-4c3f-9b57-2d9a2e7d4f10",
    slug: "fight-club",
  },
}

export function getMovieMapping(tmdbId: string) {
  return movieMapping[tmdbId]
}
