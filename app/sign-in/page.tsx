import { redirect } from "next/navigation"
import { getSession } from "@/lib/get-session"
import { AuthForm } from "@/components/auth-form"

export const dynamic = "force-dynamic"

export default async function SignInPage() {
  const session = await getSession()
  if (session?.user) redirect("/admin")

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <AuthForm mode="sign-in" />
    </main>
  )
}
