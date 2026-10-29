# Stream World

A worldwide movie and series discovery app with TMDb metadata, numbered episodes, recommendations, and regional provider availability.

## Development

The project uses pnpm workspaces and a server-side TMDb API.

```sh
pnpm install
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/stream-world run dev
```

Set `TMDB_API_KEY` in Replit Secrets. Keep it server-side; do not pass it through a `VITE_` variable or commit it.

TMDb supplies title and episode metadata and official trailer references, not full-episode video streams. The player therefore offers official trailers only unless an authorized streaming provider is integrated.
