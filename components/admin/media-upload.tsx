"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export function MediaUpload({ kind, value, onChange, label }: { kind: "image" | "video"; value: string; onChange: (url: string) => void; label: string }) {
  const [pending, setPending] = useState(false)
  async function upload(file: File) {
    setPending(true)
    try {
      const data = new FormData()
      data.append("file", file)
      data.append("kind", kind)
      const response = await fetch("/api/upload", { method: "POST", body: data })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      onChange(result.url)
      toast.success(`${label} uploaded`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed")
    } finally { setPending(false) }
  }
  return <div className="space-y-2"><label className="text-sm font-medium">{label}</label><div className="flex gap-2"><Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={kind === "image" ? "Upload or paste image URL" : "Upload or paste video URL"} /><Button type="button" variant="outline" disabled={pending} onClick={() => document.getElementById(`upload-${kind}-${label.replace(/\s/g, "-")}`)?.click()} className="shrink-0 gap-2"><Upload className="h-4 w-4" />{pending ? "Uploading" : "Upload"}</Button><input id={`upload-${kind}-${label.replace(/\s/g, "-")}`} type="file" accept={kind === "image" ? "image/*" : "video/*"} className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) void upload(file); e.currentTarget.value = "" }} /></div></div>
}
