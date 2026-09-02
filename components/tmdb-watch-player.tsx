"use client"

import { FormEvent, useState } from "react"

export function TmdbWatchPlayer({ source, unavailableMessage }: { source?: string; unavailableMessage?: string }) {
  const [videoSource, setVideoSource] = useState(source ?? "")
  const [input, setInput] = useState(source ?? "")
  const [message, setMessage] = useState("")

  function submitSource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextSource = input.trim()
    if (!nextSource || !nextSource.startsWith("http")) {
      setMessage("Enter a valid direct MP4 or HLS URL.")
      return
    }
    setMessage("")
    setVideoSource(nextSource)
  }

  return (
    <div className="bg-black">
      {videoSource ? (
        <video key={videoSource} className="aspect-video w-full" controls autoPlay playsInline src={videoSource}>
          <track kind="captions" />
        </video>
      ) : (
        <div className="flex aspect-video items-center justify-center p-6 text-center text-muted-foreground">
          {unavailableMessage ?? "Add a direct video URL to start playback."}
        </div>
      )}
      <form onSubmit={submitSource} className="flex flex-col gap-2 border-t border-white/10 p-3 sm:flex-row">
        <label htmlFor="video-source" className="sr-only">Direct video URL</label>
        <input id="video-source" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Paste a direct MP4 or HLS URL" className="min-w-0 flex-1 rounded border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:border-white/60" />
        <button type="submit" className="rounded bg-white px-4 py-2 text-sm font-semibold text-black">Play URL</button>
      </form>
      {message && <p role="alert" className="px-3 pb-3 text-sm text-red-300">{message}</p>}
    </div>
  )
}
