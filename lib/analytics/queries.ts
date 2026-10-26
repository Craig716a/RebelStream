import "server-only"

import { and, desc, eq, gte, isNotNull, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { analyticsEvents } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/get-session"
import type { AnalyticsMediaType, AnalyticsPeriodMetric, DailyAnalyticsPoint, TopMediaMetric } from "./types"

function startOfUtcDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

function startOfUtcWeek(date: Date) {
  const start = startOfUtcDay(date)
  const daysSinceMonday = (start.getUTCDay() + 6) % 7
  start.setUTCDate(start.getUTCDate() - daysSinceMonday)
  return start
}

async function getPeriodMetrics(since: Date): Promise<Omit<AnalyticsPeriodMetric, "label" | "rangeLabel">> {
  const [row] = await db
    .select({
      pageViews: sql<number>`count(*) filter (where ${analyticsEvents.eventType} = 'page_view')`,
      uniqueVisitors: sql<number>`count(distinct ${analyticsEvents.visitorHash}) filter (where ${analyticsEvents.eventType} = 'page_view')`,
      activeSeconds: sql<number>`coalesce(sum(${analyticsEvents.durationSeconds}) filter (where ${analyticsEvents.eventType} in ('engagement', 'watch_engagement')), 0)`,
    })
    .from(analyticsEvents)
    .where(gte(analyticsEvents.occurredAt, since))

  return {
    pageViews: Number(row?.pageViews ?? 0),
    uniqueVisitors: Number(row?.uniqueVisitors ?? 0),
    activeSeconds: Number(row?.activeSeconds ?? 0),
  }
}

async function getDailyTrend(todayStart: Date): Promise<DailyAnalyticsPoint[]> {
  const trendStart = new Date(todayStart)
  trendStart.setUTCDate(trendStart.getUTCDate() - 29)

  const dayBucket = sql<string>`to_char(date_trunc('day', ${analyticsEvents.occurredAt} at time zone 'UTC'), 'YYYY-MM-DD')`
  const rows = await db
    .select({
      day: dayBucket,
      visitors: sql<number>`count(distinct ${analyticsEvents.visitorHash})`,
      pageViews: sql<number>`count(*)`,
    })
    .from(analyticsEvents)
    .where(and(gte(analyticsEvents.occurredAt, trendStart), eq(analyticsEvents.eventType, "page_view")))
    .groupBy(dayBucket)
    .orderBy(dayBucket)

  const byDay = new Map(rows.map((row) => [row.day, row]))
  return Array.from({ length: 30 }, (_, index) => {
    const dayDate = new Date(trendStart)
    dayDate.setUTCDate(dayDate.getUTCDate() + index)
    const day = dayDate.toISOString().slice(0, 10)
    const row = byDay.get(day)

    return {
      day,
      label: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(dayDate),
      visitors: Number(row?.visitors ?? 0),
      pageViews: Number(row?.pageViews ?? 0),
    }
  })
}

async function getTopMedia(todayStart: Date): Promise<TopMediaMetric[]> {
  const activeSeconds = sql<number>`coalesce(sum(${analyticsEvents.durationSeconds}) filter (where ${analyticsEvents.eventType} = 'watch_engagement'), 0)`
  const opens = sql<number>`count(*) filter (where ${analyticsEvents.eventType} = 'watch_view')`
  const rows = await db
    .select({
      mediaId: analyticsEvents.mediaId,
      mediaType: analyticsEvents.mediaType,
      title: analyticsEvents.mediaTitle,
      activeSeconds,
      opens,
    })
    .from(analyticsEvents)
    .where(and(gte(analyticsEvents.occurredAt, todayStart), isNotNull(analyticsEvents.mediaId)))
    .groupBy(analyticsEvents.mediaId, analyticsEvents.mediaType, analyticsEvents.mediaTitle)
    .orderBy(desc(activeSeconds), desc(opens))
    .limit(10)

  return rows.map((row) => ({
    mediaId: row.mediaId ?? "",
    mediaType: (row.mediaType as AnalyticsMediaType | null) ?? null,
    title: row.title ?? "Untitled title",
    activeSeconds: Number(row.activeSeconds ?? 0),
    opens: Number(row.opens ?? 0),
  }))
}

export async function getAnalyticsDashboardData() {
  await requireAdmin()

  const now = new Date()
  const todayStart = startOfUtcDay(now)
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1))
  const periodSpecs = [
    { label: "Today", rangeLabel: "Since 00:00 UTC", since: todayStart },
    { label: "This week", rangeLabel: "Monday to date · UTC", since: startOfUtcWeek(now) },
    { label: "This month", rangeLabel: "Month to date · UTC", since: monthStart },
    { label: "This year", rangeLabel: "Year to date · UTC", since: yearStart },
    { label: "All time", rangeLabel: "Since tracking began", since: new Date(0) },
  ]

  const [periods, dailyTrend, topMedia] = await Promise.all([
    Promise.all(
      periodSpecs.map(async ({ label, rangeLabel, since }) => ({
        label,
        rangeLabel,
        ...(await getPeriodMetrics(since)),
      }))
    ),
    getDailyTrend(todayStart),
    getTopMedia(todayStart),
  ])

  return { periods, dailyTrend, topMedia, generatedAt: now.toISOString() }
}
