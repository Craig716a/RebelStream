export type MovieMappingEntry = {
  uuid: string
  slug: string
}

/**
 * Internal playback identifiers for movies in the catalog.
 * The object key is the TMDb movie ID used by the public route.
 */
export const customMovieMap: Record<string, MovieMappingEntry> = {
  "860508": {
    uuid: "9e4ea514-b5eb-4620-b203-5579acda2691",
    slug: "The+Whisper+Man",
  },
}

export function getMovieMapping(tmdbId: string) {
  return customMovieMap[tmdbId]
}
