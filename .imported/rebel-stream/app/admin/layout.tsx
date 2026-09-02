import { redirect } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { getSession } from "@/lib/get-session"
import { AdminSignOut } from "@/components/admin/admin-sign-out"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "Admin — Rebel Stream",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session?.user) redirect("/sign-in")

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-extrabold uppercase tracking-tight text-primary">
              Rebel<span className="text-foreground">Stream</span>
            </span>
            <span className="rounded bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">Admin</span>
          </Link>
          <nav className="ml-4 hidden items-center gap-4 text-sm text-muted-foreground md:flex">
            <Link href="/admin" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/" className="hover:text-foreground" target="_blank">
              View site
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{session.user.email}</span>
            <AdminSignOut />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <Toaster theme="dark" position="top-center" />
    </div>
  )
}
