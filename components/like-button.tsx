"use client"

import { useState, useTransition } from "react"
import { ThumbsUp } from "lucide-react"
import { toggleLike } from "@/app/actions/movies"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function LikeButton({ movieId }: { movieId: number }) {
  const [liked, setLiked] = useState(false)
  const [pending, start] = useTransition()

  function onClick() {
    const next = !liked
    setLiked(next)
    // Remember locally so a viewer without an account isn't double-counted on this device
    try {
      const key = "rebelstream:likes"
      const set = new Set<number>(JSON.parse(localStorage.getItem(key) || "[]"))
      if (next) set.add(movieId)
      else set.delete(movieId)
      localStorage.setItem(key, JSON.stringify([...set]))
    } catch {}
    start(() => {
      toggleLike(movieId, next).catch(() => setLiked(!next))
    })
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="lg"
      onClick={onClick}
      aria-busy={pending}
      aria-pressed={liked}
      className="gap-2"
    >
      <ThumbsUp className={cn("h-5 w-5", liked && "fill-current text-primary")} />
      {liked ? "Liked" : "Like"}
    </Button>
  )
}
