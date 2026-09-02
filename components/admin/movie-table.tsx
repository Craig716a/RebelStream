"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Eye, ThumbsUp, Star } from "lucide-react"
import { deleteMovie } from "@/app/actions/movies"
import type { Category } from "@/lib/db/schema"
import { MovieForm } from "./movie-form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

export type AdminMovie = {
  id: number
  title: string
  thumbnailUrl: string
  videoUrl: string
  categoryId: number
  categoryName: string | null
  views: number
  likes: number
  featured: boolean
}

export function MovieTable({ movies, categories }: { movies: AdminMovie[]; categories: Category[] }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [toDelete, setToDelete] = useState<AdminMovie | null>(null)

  function confirmDelete() {
    if (!toDelete) return
    const id = toDelete.id
    start(async () => {
      try {
        await deleteMovie(id)
        toast.success("Movie deleted")
        setToDelete(null)
        router.refresh()
      } catch {
        toast.error("Could not delete movie")
      }
    })
  }

  if (movies.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
        No movies yet. Click &ldquo;Add movie&rdquo; to upload your first title.
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Likes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movies.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.thumbnailUrl || "/placeholder.svg?height=80&width=128&query=movie"}
                      alt=""
                      className="h-10 w-16 shrink-0 rounded object-cover"
                      crossOrigin="anonymous"
                    />
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 truncate font-medium">
                        {m.title}
                        {m.featured && <Star className="h-3.5 w-3.5 fill-primary text-primary" />}
                      </p>
                      <p className="truncate text-xs text-muted-foreground md:hidden">{m.categoryName}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline">{m.categoryName ?? "—"}</Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-3.5 w-3.5" />
                    {m.views.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    {m.likes.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <MovieForm
                      categories={categories}
                      movie={m}
                      trigger={
                        <Button variant="ghost" size="icon" aria-label={`Edit ${m.title}`}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${m.title}`}
                      onClick={() => setToDelete(m)}
                    >
                      <Trash2 className="h-4 w-4 text-primary" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete movie?</DialogTitle>
            <DialogDescription>
              {toDelete ? `"${toDelete.title}" will be permanently removed.` : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setToDelete(null)} disabled={pending}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} disabled={pending}>
              {pending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
