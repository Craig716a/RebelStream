import type { TitleDetails } from "@workspace/api-client-react";

export function getLanguageName(languageCode: string) {
  try {
    return new Intl.DisplayNames(["en"], { type: "language" }).of(languageCode)
      || languageCode.toUpperCase();
  } catch {
    return languageCode.toUpperCase();
  }
}

export function getTitleDescription(overview: string) {
  const normalized = overview.replace(/\s+/g, " ").trim();
  if (normalized.length <= 180) return normalized;
  return `${normalized.slice(0, 177).trimEnd()}…`;
}

export function createTitleStructuredData(title: TitleDetails, canonicalUrl: string) {
  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": title.mediaType === "tv" ? "TVSeries" : "Movie",
    name: title.title,
    description: title.overview || undefined,
    image: title.backdropPath || title.posterPath
      ? `https://image.tmdb.org/t/p/w1280${title.backdropPath || title.posterPath}`
      : undefined,
    datePublished: title.releaseDate?.slice(0, 4) || undefined,
    inLanguage: title.originalLanguage || undefined,
    genre: title.genres.map((genre) => genre.name),
    url: canonicalUrl,
    identifier: {
      "@type": "PropertyValue",
      propertyID: "TMDb",
      value: String(title.id),
    },
  };

  if (title.voteAverage > 0 && title.voteCount > 0) {
    structuredData.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: title.voteAverage,
      ratingCount: title.voteCount,
      bestRating: 10,
      worstRating: 0,
    };
  }

  if (title.cast.length > 0) {
    structuredData.actor = title.cast.slice(0, 4).map((person) => ({
      "@type": "Person",
      name: person.name,
      ...(person.character ? { characterName: person.character } : {}),
    }));
  }

  if (title.mediaType === "movie" && title.director) {
    structuredData.director = { "@type": "Person", name: title.director };
  }

  if (title.mediaType === "tv" && title.creatorNames.length > 0) {
    structuredData.creator = title.creatorNames.slice(0, 3).map((name) => ({
      "@type": "Person",
      name,
    }));
  }

  if (title.mediaType === "tv") {
    if (title.numberOfSeasons !== null) {
      structuredData.numberOfSeasons = title.numberOfSeasons;
    }
    if (title.numberOfEpisodes !== null) {
      structuredData.numberOfEpisodes = title.numberOfEpisodes;
    }
  }

  return structuredData;
}
