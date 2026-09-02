type MovieWatchPlayerProps = {
  uuid: string
  slug: string
  title: string
}

function buildEmbedUrl({ uuid, slug }: MovieWatchPlayerProps) {
  return `https://xstreamx.films365.org/movie/${encodeURIComponent(uuid)}/${encodeURIComponent(slug)}`
}

export function MovieWatchPlayer({ uuid, slug, title }: MovieWatchPlayerProps) {
  const embedUrl = buildEmbedUrl({ uuid, slug, title })

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
