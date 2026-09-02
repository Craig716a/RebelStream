import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Owner Portal — Rebel Stream",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default function OwnerPortalEntry() {
  redirect("/admin")
}
