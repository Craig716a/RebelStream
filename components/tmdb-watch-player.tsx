type MovieWatchPlayerProps = {
  tmdbId: number
  title: string
}

function buildEmbedUrl(tmdbId: number) {
  return `https://www.f-movies.org/movie/movie-${tmdbId}`
}

export function MovieWatchPlayer({ tmdbId, title }: MovieWatchPlayerProps) {
  const embedUrl = buildEmbedUrl(tmdbId)

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      <iframe
        src={embedUrl}
        title={`${title} video player`}
        className="absolute inset-0 size-full border-0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  )
}
