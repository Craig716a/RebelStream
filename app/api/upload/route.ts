import { put } from "@vercel/blob"
import { NextResponse, type NextRequest } from "next/server"

const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const MAX_VIDEO_SIZE = 2 * 1024 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")
    const kind = formData.get("kind") === "video" ? "video" : "image"

    if (!(file instanceof File)) return NextResponse.json({ error: "No file provided" }, { status: 400 })
    const maxSize = kind === "video" ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE
    if (file.size > maxSize) return NextResponse.json({ error: `File is larger than ${kind === "video" ? "2GB" : "10MB"}.` }, { status: 413 })
    if (kind === "image" && !file.type.startsWith("image/")) return NextResponse.json({ error: "Thumbnail must be an image." }, { status: 400 })
    if (kind === "video" && !file.type.startsWith("video/")) return NextResponse.json({ error: "Episode video must be a video file." }, { status: 400 })

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-")
    const blob = await put(`rebel-stream/${kind}s/${crypto.randomUUID()}-${safeName}`, file, { access: "public", addRandomSuffix: false })
    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("[v0] Upload failed", error)
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 })
  }
}

export const runtime = "nodejs"
export const maxDuration = 300
