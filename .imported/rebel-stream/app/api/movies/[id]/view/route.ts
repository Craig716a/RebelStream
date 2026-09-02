import { incrementView } from "@/app/actions/movies"
import { NextResponse } from "next/server"

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const movieId = Number(id)
  if (!Number.isInteger(movieId)) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
  await incrementView(movieId)
  return NextResponse.json({ ok: true })
}
