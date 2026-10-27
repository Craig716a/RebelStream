"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export function AdminSignOut() {
  const router = useRouter()

  async function onSignOut() {
    await authClient.signOut()
    router.replace("/admin-login")
    router.refresh()
  }

  return (
    <Button variant="secondary" size="sm" onClick={onSignOut} className="gap-2">
      <LogOut data-icon="inline-start" /> Sign out
    </Button>
  )
}
