import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session?.user || session.user.email.toLowerCase() !== "craigbt33@gmail.com") throw new Error("Unauthorized")
  return session.user
}
