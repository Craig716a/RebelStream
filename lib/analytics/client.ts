import type { AnalyticsEventInput, AnalyticsEventPayload } from "./types"

export function sendAnalyticsEvent(event: AnalyticsEventInput) {
  if (typeof navigator === "undefined" || !navigator.sendBeacon || navigator.doNotTrack === "1") return

  const payload: AnalyticsEventPayload = {
    ...event,
    eventId: crypto.randomUUID(),
  }

  navigator.sendBeacon("/api/analytics", new Blob([JSON.stringify(payload)], { type: "application/json" }))
}
