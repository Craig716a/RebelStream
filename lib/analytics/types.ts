export type AnalyticsEventType = "page_view" | "engagement" | "watch_view" | "watch_engagement"

export type AnalyticsMediaType = "movie" | "tv" | "anime"

export type AnalyticsEventPayload = {
  eventId: string
  eventType: AnalyticsEventType
  path: string
  durationSeconds?: number
  mediaId?: string
  mediaType?: AnalyticsMediaType
  mediaTitle?: string
}

export type AnalyticsEventInput = Omit<AnalyticsEventPayload, "eventId">

export type AnalyticsPeriodMetric = {
  label: string
  rangeLabel: string
  pageViews: number
  uniqueVisitors: number
  activeSeconds: number
}

export type DailyAnalyticsPoint = {
  day: string
  label: string
  visitors: number
  pageViews: number
}

export type TopMediaMetric = {
  mediaId: string
  mediaType: AnalyticsMediaType | null
  title: string
  opens: number
  activeSeconds: number
}
