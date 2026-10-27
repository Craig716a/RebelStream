"use client"

import { useEffect } from "react"
import { sendAnalyticsEvent } from "@/lib/analytics/client"
import type { AnalyticsMediaType } from "@/lib/analytics/types"

const heartbeatMs = 30_000

type WatchAnalyticsTrackerProps = {
  type: AnalyticsMediaType
  tmdbId: number
  title: string
}

export function WatchAnalyticsTracker({ type, tmdbId, title }: WatchAnalyticsTrackerProps) {
  useEffect(() => {
    const path = `/watch/${type}/${tmdbId}`
    const media = { mediaId: String(tmdbId), mediaType: type, mediaTitle: title }
    let lastSentAt = Date.now()

    sendAnalyticsEvent({ eventType: "watch_view", path, ...media })

    const flush = (closing = false) => {
      const now = Date.now()
      const durationSeconds = Math.min(30, Math.floor((now - lastSentAt) / 1_000))
      const visible = document.visibilityState === "visible" && document.hasFocus()
      lastSentAt = now
      if (durationSeconds < 1 || (!visible && !closing)) return
      sendAnalyticsEvent({ eventType: "watch_engagement", path, durationSeconds, ...media })
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") flush(true)
    }
    const onPageHide = () => flush(true)
    const interval = window.setInterval(() => flush(), heartbeatMs)

    document.addEventListener("visibilitychange", onVisibilityChange)
    window.addEventListener("pagehide", onPageHide)

    return () => {
      window.clearInterval(interval)
      document.removeEventListener("visibilitychange", onVisibilityChange)
      window.removeEventListener("pagehide", onPageHide)
      flush(true)
    }
  }, [type, tmdbId, title])

  return null
}
