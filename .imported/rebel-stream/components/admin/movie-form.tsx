"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { createMovie, updateMovie, type MovieInput } from "@/app/actions/movies"
import type { Category } from "@/lib/db/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

type MovieRow = {
  id: number
  title: string
  thumbnailUrl: string
  videoUrl: string
  categoryId: number
}

export function MovieForm({
  categories,
  movie,
  trigger,
}: {
  categories: Category[]
  movie?: MovieRow & Partial<MovieInput>
  trigger?: React.ReactNode
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, start] = useTransition()
  const isEdit = !!movie

  const [form, setForm] = useState<MovieInput>({
    title: movie?.title ?? "",
    description: movie?.description ?? "",
    thumbnailUrl: movie?.thumbnailUrl ?? "",
    videoUrl: movie?.videoUrl ?? "",
    categoryId: movie?.categoryId ?? categories[0]?.id ?? 0,
    year: movie?.year ?? null,
    rating: movie?.rating ?? "",
    duration: movie?.duration ?? "",
    featured: movie?.featured ?? false,
  })

  function set<K extends keyof MovieInput>(key: K, value: MovieInput[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.thumbnailUrl || !form.videoUrl || !form.categoryId) {
      toast.error("Title, thumbnail, video link and category are required.")
      return
    }
    start(async () => {
      try {
        if (isEdit) {
          await updateMovie(movie!.id, form)
          toast.success("Movie updated")
        } else {
          await createMovie(form)
          toast.success("Movie added")
        }
        setOpen(false)
        router.refresh()
      } catch {
        toast.error("Something went wrong. Please try again.")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button className="gap-2 font-semibold">
              <Plus className="h-4 w-4" /> Add movie
            </Button>
          )
        }
      />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit movie" : "Add a movie"}</DialogTitle>
          <DialogDescription>
            Thumbnail is a direct image URL. Video accepts YouTube, Vimeo, or a direct file link.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnailUrl">Thumbnail image URL</Label>
            <Input
              id="thumbnailUrl"
              value={form.thumbnailUrl}
              onChange={(e) => set("thumbnailUrl", e.target.value)}
              placeholder="https://.../poster.jpg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video link</Label>
            <Input
              id="videoUrl"
              value={form.videoUrl}
              onChange={(e) => set("videoUrl", e.target.value)}
              placeholder="https://youtube.com/watch?v=... or https://.../video.mp4"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={String(form.categoryId)}
                onValueChange={(v) => set("categoryId", Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={form.year ?? ""}
                onChange={(e) => set("year", e.target.value ? Number(e.target.value) : null)}
                placeholder="2024"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                value={form.rating ?? ""}
                onChange={(e) => set("rating", e.target.value)}
                placeholder="PG-13"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={form.duration ?? ""}
                onChange={(e) => set("duration", e.target.value)}
                placeholder="1h 42m"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              placeholder="What is this title about?"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            Feature on the homepage hero
          </label>

          <DialogFooter>
            <Button type="submit" className="font-semibold" disabled={pending}>
              {pending ? "Saving..." : isEdit ? "Save changes" : "Add movie"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
