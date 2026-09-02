import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { getSession } from "@/lib/get-session"

export const metadata: Metadata = {
  title: "Owner Portal — Rebel Stream",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function OwnerPortalEntry() {
  const session = await getSession()
  redirect(session?.user ? "/admin" : "/sign-in")
}
