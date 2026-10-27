import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/get-session"
import { ADMIN_USERNAME } from "@/lib/admin-config"
import { AdminLoginForm } from "@/components/admin-login-form"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Administrator sign in",
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage() {
  const session = await getSession()
  if (session?.user?.username?.toLowerCase() === ADMIN_USERNAME) redirect("/admin")

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Link href="/" className="mx-auto text-lg font-extrabold uppercase tracking-tight text-primary">
          Rebel<span className="text-foreground">Stream</span>
        </Link>
        <AdminLoginForm />
        <p className="text-center text-xs text-muted-foreground">Private administrative access only.</p>
      </div>
    </main>
  )
}
