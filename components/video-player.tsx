"use client"

import Link from "next/link"
import { SkipForward } from "lucide-react"
import { useEffect, useRef } from "react"

export function VideoPlayer({ url, movieId, title, nextEpisode }: { url: string; movieId: number; title: string; nextEpisode?: { id: number; href: string } }) {
  const counted = useRef(false)
  // Count a view once per mount (fire-and-forget, no account required)
  useEffect(() => {
    if (counted.current) return
    counted.current = true
    fetch(`/api/movies/${movieId}/view`, { method: "POST" }).catch(() => {})
  }, [movieId])

  return (
    <div className="relative h-full w-full bg-black">
      <video
        controls
        autoPlay
        playsInline
        onEnded={() => { if (nextEpisode) window.location.href = nextEpisode.href }}
        className="h-full w-full bg-black"
        src={url}
        crossOrigin="anonymous"
      >
        <track kind="captions" />
      </video>
      {nextEpisode && (
        <Link href={nextEpisode.href} aria-label="Next episode" className="absolute bottom-16 right-4 rounded-md bg-foreground/80 p-3 text-background opacity-0 transition-opacity hover:opacity-100 focus-visible:opacity-100">
          <SkipForward className="h-5 w-5" />
        </Link>
      )}
    </div>
  )
}
