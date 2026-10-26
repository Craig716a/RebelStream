import Link from "next/link"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/sonner"
import { AdminSignOut } from "@/components/admin/admin-sign-out"
import { ADMIN_USERNAME } from "@/lib/admin-config"
import { getSession } from "@/lib/get-session"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Admin — Rebel Stream",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session?.user || session.user.username?.toLowerCase() !== ADMIN_USERNAME) redirect("/admin-login")

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-extrabold uppercase tracking-tight text-primary">
              Rebel<span className="text-foreground">Stream</span>
            </span>
            <span className="rounded bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">Admin</span>
          </Link>
          <nav className="ml-auto flex items-center gap-3 text-xs text-muted-foreground sm:text-sm">
            <Link href="/admin" className="hidden hover:text-foreground md:inline">
              Dashboard
            </Link>
            <Link href="/admin/analytics" className="hover:text-foreground">
              Analytics
            </Link>
            <Link href="/" className="hidden hover:text-foreground lg:inline" target="_blank" rel="noreferrer">
              View site
            </Link>
          </nav>
          <AdminSignOut />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <Toaster theme="dark" position="top-center" />
    </div>
  )
}
