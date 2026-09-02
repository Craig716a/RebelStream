import { Film } from "lucide-react"

export function EmptyState() {
  return (
    <main className="grid min-h-[80vh] place-items-center px-4 pt-16">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
          <Film className="h-8 w-8" />
        </span>
        <h1 className="text-2xl font-bold">No titles yet</h1>
        <p className="text-muted-foreground">
          Rebel Stream is ready, but there is nothing to watch just yet. The site owner can add movies from the admin
          portal.
        </p>
      </div>
    </main>
  )
}
