"use client"

import { useEffect, useRef } from "react"
import { resolveVideoSource } from "@/lib/video"

export function VideoPlayer({ url, movieId, title }: { url: string; movieId: number; title: string }) {
  const counted = useRef(false)
  const source = resolveVideoSource(url)

  // Count a view once per mount (fire-and-forget, no account required)
  useEffect(() => {
    if (counted.current) return
    counted.current = true
    fetch(`/api/movies/${movieId}/view`, { method: "POST" }).catch(() => {})
  }, [movieId])

  if (source.kind === "file") {
    return (
      <video
        controls
        autoPlay
        playsInline
        className="h-full w-full bg-black"
        src={source.src}
        crossOrigin="anonymous"
      >
        <track kind="captions" />
      </video>
    )
  }

  return (
    <iframe
      title={title}
      src={source.embedUrl}
      className="h-full w-full bg-black"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowFullScreen
    />
  )
}
