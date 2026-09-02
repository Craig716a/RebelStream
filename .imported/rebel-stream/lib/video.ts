export type VideoSource =
  | { kind: "youtube"; embedUrl: string }
  | { kind: "vimeo"; embedUrl: string }
  | { kind: "file"; src: string }
  | { kind: "iframe"; embedUrl: string }

export function resolveVideoSource(url: string): VideoSource {
  const trimmed = (url ?? "").trim()

  // YouTube: watch, youtu.be, shorts, embed
  const yt =
    trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/) ?? null
  if (yt) {
    return { kind: "youtube", embedUrl: `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1` }
  }

  // Vimeo
  const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) {
    return { kind: "vimeo", embedUrl: `https://player.vimeo.com/video/${vimeo[1]}` }
  }

  // Direct file
  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(trimmed)) {
    return { kind: "file", src: trimmed }
  }

  // Fallback: attempt to embed as iframe
  return { kind: "iframe", embedUrl: trimmed }
}
