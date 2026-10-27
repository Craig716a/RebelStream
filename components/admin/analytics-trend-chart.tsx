"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { DailyAnalyticsPoint } from "@/lib/analytics/types"

const chartConfig = {
  visitors: {
    label: "Unique visitors",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

type AnalyticsTrendChartProps = {
  data: DailyAnalyticsPoint[]
}

export function AnalyticsTrendChart({ data }: AnalyticsTrendChartProps) {
  return (
    <Card className="border-border/70 bg-card/80">
      <CardHeader>
        <CardTitle>Visitor trend</CardTitle>
        <CardDescription>Unique first-party visitors over the last 30 UTC days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <AreaChart data={data} accessibilityLayer>
            <defs>
              <linearGradient id="visitor-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-visitors)" stopOpacity={0.32} />
                <stop offset="95%" stopColor="var(--color-visitors)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={4}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={32}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Area
              dataKey="visitors"
              type="monotone"
              stroke="var(--color-visitors)"
              strokeWidth={2}
              fill="url(#visitor-area)"
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
