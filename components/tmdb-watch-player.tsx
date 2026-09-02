"use client"

import { useMemo } from "react"

type TmdbWatchPlayerProps = {
  type: "movie" | "tv"
  id: number
  season?: number
  episode?: number
}

function buildEmbedUrl({ type, id, season, episode }: TmdbWatchPlayerProps) {
  if (type === "tv") {
    if (!season || !episode) return null
    return `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`
  }

  return `https://vidsrc.to/embed/movie/${id}`
}

export function TmdbWatchPlayer({ type, id, season, episode }: TmdbWatchPlayerProps) {
  const embedUrl = useMemo(() => buildEmbedUrl({ type, id, season, episode }), [type, id, season, episode])

  if (!embedUrl) {
    return (
      <div className="flex aspect-video items-center justify-center bg-black p-6 text-center text-sm text-muted-foreground">
        Select a season and episode to start watching this series.
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      <iframe
        key={embedUrl}
        src={embedUrl}
        title="Video player"
        className="absolute inset-0 size-full border-0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        referrerPolicy="origin"
      />
    </div>
  )
}
