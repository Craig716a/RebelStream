import { createHash, randomUUID } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { analyticsEvents } from "@/lib/db/schema"
import type { AnalyticsEventType, AnalyticsMediaType } from "@/lib/analytics/types"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const visitorCookieName = "rebelstream_visitor"
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const allowedTypes = new Set<AnalyticsEventType>(["page_view", "engagement", "watch_view", "watch_engagement"])
const allowedMediaTypes = new Set<AnalyticsMediaType>(["movie", "tv", "anime"])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isExcludedPath(path: string) {
  return path.startsWith("/admin") || path.startsWith("/api") || path === "/sign-in" || path === "/sign-up"
}

function getTrustedOrigins() {
  const origins = new Set<string>()
  const addOrigin = (value?: string) => {
    if (!value) return
    try {
      origins.add(new URL(value.includes("://") ? value : `https://${value}`).origin)
    } catch {}
  }

  addOrigin(process.env.BETTER_AUTH_URL)
  if (process.env.NODE_ENV === "development") {
    origins.add("http://localhost:3000")
    addOrigin(process.env.V0_RUNTIME_URL)
    addOrigin(process.env.V0_DEV_APP_URL)
    addOrigin(process.env.V0_BUILD_URL)
    addOrigin(process.env.V0_SANDBOX_URL)
  } else {
    addOrigin(process.env.VERCEL_URL)
    addOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL)
  }

  return origins
}

function emptyResponse(status = 204) {
  return new NextResponse(null, { status, headers: { "Cache-Control": "no-store" } })
}

export async function POST(request: NextRequest) {
  if (request.headers.get("dnt") === "1") return emptyResponse()

  const origin = request.headers.get("origin")
  if (origin && origin !== request.nextUrl.origin && !getTrustedOrigins().has(origin)) return emptyResponse(403)
  if (request.headers.get("sec-fetch-site") === "cross-site") return emptyResponse(403)

  const contentLength = Number(request.headers.get("content-length") ?? 0)
  if (!Number.isFinite(contentLength) || contentLength > 4_096) return emptyResponse(413)
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) return emptyResponse(415)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return emptyResponse(400)
  }

  if (!isRecord(body)) return emptyResponse(400)

  const eventId = typeof body.eventId === "string" ? body.eventId : ""
  const eventType = body.eventType
  const path = typeof body.path === "string" ? body.path : ""

  if (!uuidPattern.test(eventId) || typeof eventType !== "string" || !allowedTypes.has(eventType as AnalyticsEventType)) {
    return emptyResponse(400)
  }
  if (!path.startsWith("/") || path.startsWith("//") || path.length > 240 || path.includes("?") || path.includes("#")) {
    return emptyResponse(400)
  }
  if (isExcludedPath(path)) return emptyResponse()

  const typedEvent = eventType as AnalyticsEventType
  const isWatchEvent = typedEvent === "watch_view" || typedEvent === "watch_engagement"
  const rawDuration = body.durationSeconds ?? 0
  if (typeof rawDuration !== "number" || !Number.isInteger(rawDuration)) return emptyResponse(400)

  const isDurationEvent = typedEvent === "engagement" || typedEvent === "watch_engagement"
  if ((isDurationEvent && (rawDuration < 1 || rawDuration > 30)) || (!isDurationEvent && rawDuration !== 0)) {
    return emptyResponse(400)
  }
  if (typedEvent === "engagement" && path.startsWith("/watch/")) return emptyResponse(400)
  if (isWatchEvent && !path.startsWith("/watch/")) return emptyResponse(400)

  let mediaId: string | null = null
  let mediaType: AnalyticsMediaType | null = null
  let mediaTitle: string | null = null

  if (isWatchEvent) {
    const rawMediaId = body.mediaId
    const rawMediaType = body.mediaType
    const rawMediaTitle = body.mediaTitle
    if (
      typeof rawMediaId !== "string" ||
      !/^\d{1,15}$/.test(rawMediaId) ||
      Number(rawMediaId) < 1 ||
      typeof rawMediaType !== "string" ||
      !allowedMediaTypes.has(rawMediaType as AnalyticsMediaType) ||
      typeof rawMediaTitle !== "string"
    ) {
      return emptyResponse(400)
    }
    mediaId = rawMediaId
    mediaType = rawMediaType as AnalyticsMediaType
    mediaTitle = rawMediaTitle.trim().slice(0, 160) || "Untitled title"
  }

  const storedVisitorId = request.cookies.get(visitorCookieName)?.value
  const visitorId = storedVisitorId && uuidPattern.test(storedVisitorId) ? storedVisitorId : randomUUID()
  const visitorHash = createHash("sha256").update(visitorId).digest("hex")

  await db
    .insert(analyticsEvents)
    .values({
      eventId,
      visitorHash,
      eventType: typedEvent,
      path,
      mediaId,
      mediaType,
      mediaTitle,
      durationSeconds: rawDuration,
      occurredAt: new Date(),
    })
    .onConflictDoNothing({ target: analyticsEvents.eventId })

  const response = emptyResponse()
  if (!storedVisitorId || !uuidPattern.test(storedVisitorId)) {
    response.cookies.set(visitorCookieName, visitorId, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === "development" ? "none" : "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    })
  }
  return response
}
