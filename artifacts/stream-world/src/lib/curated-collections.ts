import type { GetCatalogParams, TitleDetails } from "@workspace/api-client-react";

export interface CuratedCollection {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  query: GetCatalogParams;
}

export const curatedCollections = [
  {
    slug: "korean-drama",
    title: "Korean Drama",
    eyebrow: "TV · KOREAN LANGUAGE",
    description: "Drama series filtered by TMDb’s Korean-language and drama metadata.",
    query: {
      mediaType: "tv",
      genreId: 18,
      originalLanguage: "ko",
      sortBy: "popularity.desc",
      page: 1,
    },
  },
  {
    slug: "science-fiction-films",
    title: "Science Fiction Films",
    eyebrow: "MOVIES · SCI-FI",
    description: "Feature films tagged as Science Fiction in the TMDb catalog.",
    query: {
      mediaType: "movie",
      genreId: 878,
      sortBy: "popularity.desc",
      page: 1,
    },
  },
  {
    slug: "crime-series",
    title: "Crime Series",
    eyebrow: "TV · CRIME",
    description: "Series carrying the Crime genre in the TMDb catalog.",
    query: {
      mediaType: "tv",
      genreId: 80,
      sortBy: "popularity.desc",
      page: 1,
    },
  },
  {
    slug: "animated-films",
    title: "Animated Films",
    eyebrow: "MOVIES · ANIMATION",
    description: "Movies tagged as Animation in the TMDb catalog.",
    query: {
      mediaType: "movie",
      genreId: 16,
      sortBy: "popularity.desc",
      page: 1,
    },
  },
] satisfies readonly CuratedCollection[];

export function getCuratedCollection(slug: string) {
  return curatedCollections.find((collection) => collection.slug === slug);
}

export function findCuratedCollectionsForTitle(title: TitleDetails) {
  return curatedCollections.filter((collection) => {
    const { mediaType, genreId, originalLanguage } = collection.query;

    return mediaType === title.mediaType
      && (!genreId || title.genres.some((genre) => genre.id === genreId))
      && (!originalLanguage || originalLanguage === title.originalLanguage);
  });
}
