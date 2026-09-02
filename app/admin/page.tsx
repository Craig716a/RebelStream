import { Film, Eye, ThumbsUp } from "lucide-react"
import { getAdminStats, getAllMoviesAdmin, getCategories, getSeriesAdmin } from "@/app/actions/movies"
import { MovieForm } from "@/components/admin/movie-form"
import { SeriesManager } from "@/components/admin/series-manager"
import { MovieTable } from "@/components/admin/movie-table"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const [stats, movies, categories] = await Promise.all([
    getAdminStats(),
    getAllMoviesAdmin(),
    getCategories(),
  ])
  const series = await Promise.all(
    movies.filter((movie) => movie.isSeries).map(async (movie) => ({
      id: movie.id,
      title: movie.title,
      rows: await getSeriesAdmin(movie.id),
    })),
  )

  const cards = [
    { label: "Total movies", value: stats.totalMovies, icon: Film },
    { label: "Total views", value: stats.totalViews, icon: Eye },
    { label: "Total likes", value: stats.totalLikes, icon: ThumbsUp },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage your catalog. Views and likes are private to you.
          </p>
        </div>
        <MovieForm categories={categories} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-5">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/15 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-2xl font-bold tabular-nums">{value.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">All titles</h2>
        <MovieTable movies={movies} categories={categories} />
      </div>

      <SeriesManager series={series} />
    </div>
  )
}
