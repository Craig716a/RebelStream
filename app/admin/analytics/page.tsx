import type { Metadata } from "next"
import { Activity, Clapperboard, Eye, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { AnalyticsRefreshButton } from "@/components/admin/analytics-refresh-button"
import { AnalyticsTrendChart } from "@/components/admin/analytics-trend-chart"
import { getAnalyticsDashboardData } from "@/lib/analytics/queries"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Analytics",
  description: "Private visitor and watch-page analytics for Rebel Stream.",
  robots: { index: false, follow: false },
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}

function formatHours(seconds: number) {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3_600) return `${Math.round(seconds / 60)}m`
  return `${(seconds / 3_600).toFixed(1)}h`
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3_600)
  const minutes = Math.floor((seconds % 3_600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m`
  return `${seconds}s`
}

function mediaTypeLabel(type: string | null) {
  if (type === "tv") return "Series"
  if (type === "anime") return "Anime"
  return "Movie"
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-lg font-semibold tabular-nums">{value}</p>
    </div>
  )
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsDashboardData()
  const updatedAt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(data.generatedAt))

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Rebel Stream · Insights</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Analytics</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Anonymous visitor counts and active time across the public site, with today&apos;s most engaged watch pages.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <AnalyticsRefreshButton />
          <p className="text-xs text-muted-foreground">Updated {updatedAt} UTC</p>
        </div>
      </section>

      <section aria-label="Visitors and time by period" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {data.periods.map((period) => (
          <Card key={period.label} className="border-border/70 bg-card/80">
            <CardHeader className="gap-1 pb-3">
              <CardDescription>{period.rangeLabel}</CardDescription>
              <CardTitle className="text-lg">{period.label}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-3 gap-y-4">
              <Metric label="Page views" value={formatCount(period.pageViews)} />
              <Metric label="Unique visitors" value={formatCount(period.uniqueVisitors)} />
              <div className="col-span-2 rounded-lg bg-muted/35 p-3">
                <Metric label="Active time" value={formatHours(period.activeSeconds)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <AnalyticsTrendChart data={data.dailyTrend} />

        <Card className="border-border/70 bg-card/80">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1.5">
                <CardTitle>Top 10 watched today</CardTitle>
                <CardDescription>Ranked by active watch-page time since 00:00 UTC.</CardDescription>
              </div>
              <Badge variant="outline">UTC</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {data.topMedia.length === 0 ? (
              <Empty className="min-h-56 border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Clapperboard aria-hidden="true" />
                  </EmptyMedia>
                  <EmptyTitle>No watch activity yet</EmptyTitle>
                  <EmptyDescription>Today&apos;s list will populate as visitors spend time on watch pages.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ol className="flex flex-col divide-y divide-border">
                {data.topMedia.map((item, index) => (
                  <li
                    key={`${item.mediaType}-${item.mediaId}`}
                    className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <span className="text-sm font-medium tabular-nums text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{mediaTypeLabel(item.mediaType)}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatCount(item.opens)} {item.opens === 1 ? "open" : "opens"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold tabular-nums">{formatDuration(item.activeSeconds)}</p>
                      <p className="text-xs text-muted-foreground">active</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </section>

      <p className="max-w-4xl text-xs leading-relaxed text-muted-foreground">
        Analytics use a hashed first-party visitor ID; raw visitor IDs, IP addresses, and user-agent strings are not stored.
        Visitors who clear cookies may be counted again. Watch time measures visible time on the watch page, not confirmed
        playback inside the third-party player.
      </p>
    </div>
  )
}
