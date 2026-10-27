import { auth } from "@/lib/auth"
import { ADMIN_USERNAME } from "@/lib/admin-config"
import { headers } from "next/headers"

export async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session?.user || session.user.username?.toLowerCase() !== ADMIN_USERNAME) throw new Error("Unauthorized")
  return session.user
}
