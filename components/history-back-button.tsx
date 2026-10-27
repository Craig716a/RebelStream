"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

type HistoryBackButtonProps = {
  fallbackHref?: string
  label?: string
}

export function HistoryBackButton({ fallbackHref = "/", label = "Back" }: HistoryBackButtonProps) {
  const router = useRouter()

  function goBack() {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push(fallbackHref)
  }

  return (
    <Button type="button" variant="ghost" className="w-fit gap-2 px-0" onClick={goBack}>
      <ArrowLeft data-icon="inline-start" />
      {label}
    </Button>
  )
}
