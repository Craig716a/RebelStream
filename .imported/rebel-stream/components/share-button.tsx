"use client"

import { useState } from "react"
import { Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function ShareButton({ movieId, title }: { movieId: number; title: string }) {
  const [copied, setCopied] = useState(false)

  async function onShare() {
    const url = `${window.location.origin}/movie/${movieId}`
    const shareData = { title: `Rebel Stream — ${title}`, text: `Watch ${title} on Rebel Stream`, url }
    try {
      if (navigator.share && /Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        await navigator.share(shareData)
        return
      }
    } catch {
      // user cancelled native share; fall through to copy
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("Link copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy link")
    }
  }

  return (
    <Button type="button" variant="secondary" size="lg" onClick={onShare} className="gap-2">
      {copied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
      {copied ? "Copied" : "Share"}
    </Button>
  )
}
