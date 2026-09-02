"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

type Metadata = { tmdbId: string; title: string; description: string; thumbnailUrl: string; year: string; duration: string; rating: string }

export function TmdbMetadataPicker({ type, onApply }: { type: "movie" | "tv"; onApply: (metadata: Metadata) => void }) {
  const [value, setValue] = useState("")
  const [pending, setPending] = useState(false)

  async function lookup() {
    const match = value.match(/(?:movie|tv)\/(\d+)/) ?? value.match(/\d+/)
    const id = match ? (typeof match === "object" ? match[1] : match[0]) : ""
    if (!id) return toast.error("Enter a TMDB ID or TMDB link.")
    setPending(true)
    try {
      const response = await fetch(`/api/tmdb/lookup?id=${id}&type=${type}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      onApply(data)
      toast.success("TMDB metadata applied")
    } catch (error) { toast.error(error instanceof Error ? error.message : "TMDB lookup failed") }
    finally { setPending(false) }
  }

  return <div className="space-y-2 rounded-md border border-border bg-muted/30 p-3">
    <Label htmlFor={`tmdb-${type}`}>Import from TMDB (optional)</Label>
    <div className="flex gap-2"><Input id={`tmdb-${type}`} value={value} onChange={(event) => setValue(event.target.value)} placeholder={`TMDB ${type === "tv" ? "series" : "movie"} ID or link`} /><Button type="button" variant="secondary" onClick={lookup} disabled={pending}>{pending ? "Loading..." : "Fetch metadata"}</Button></div>
    <p className="text-xs text-muted-foreground">Fills title, description, year, rating, duration, thumbnail, and TMDB ID. You can still edit everything below.</p>
  </div>
}
