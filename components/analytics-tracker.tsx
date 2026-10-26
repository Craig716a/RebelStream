"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { sendAnalyticsEvent } from "@/lib/analytics/client"

const heartbeatMs = 30_000
const activityWindowMs = 60_000

function isExcludedPath(path: string) {
  return path.startsWith("/admin") || path.startsWith("/api") || path === "/sign-in" || path === "/sign-up"
}

export function AnalyticsTracker() {
  const pathname = usePathname()
  const pathnameRef = useRef(pathname)
  const lastActivityAt = useRef(Date.now())
  const lastSentAt = useRef(Date.now())
  const lastPageViewPath = useRef<string | null>(null)
  pathnameRef.current = pathname

  useEffect(() => {
    if (!pathname || isExcludedPath(pathname) || lastPageViewPath.current === pathname) return
    lastPageViewPath.current = pathname
    sendAnalyticsEvent({ eventType: "page_view", path: pathname })
  }, [pathname])

  useEffect(() => {
    const markActivity = () => {
      const now = Date.now()
      if (now - lastActivityAt.current > 1_000) lastActivityAt.current = now
    }

    const flush = (closing = false) => {
      const now = Date.now()
      const durationSeconds = Math.min(30, Math.floor((now - lastSentAt.current) / 1_000))
      const currentPath = pathnameRef.current
      const active = now - lastActivityAt.current <= activityWindowMs
      const visible = document.visibilityState === "visible" && document.hasFocus()
      lastSentAt.current = now

      if (
        durationSeconds < 1 ||
        (!visible && !closing) ||
        !active ||
        !currentPath ||
        isExcludedPath(currentPath) ||
        currentPath.startsWith("/watch/")
      ) {
        return
      }

      sendAnalyticsEvent({ eventType: "engagement", path: currentPath, durationSeconds })
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") flush(true)
    }
    const onPageHide = () => flush(true)
    const activityEvents = ["pointerdown", "pointermove", "keydown", "scroll", "touchstart"] as const

    activityEvents.forEach((eventName) => window.addEventListener(eventName, markActivity, { passive: true }))
    document.addEventListener("visibilitychange", onVisibilityChange)
    window.addEventListener("pagehide", onPageHide)
    const interval = window.setInterval(() => flush(), heartbeatMs)

    return () => {
      window.clearInterval(interval)
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, markActivity))
      document.removeEventListener("visibilitychange", onVisibilityChange)
      window.removeEventListener("pagehide", onPageHide)
      flush(true)
    }
  }, [])

  return null
}
