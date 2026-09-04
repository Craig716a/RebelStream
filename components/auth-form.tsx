"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === "sign-up"

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (isSignUp) {
        const { error } = await authClient.signUp.email({ email, password, name })
        if (error) throw new Error(error.message)
      } else {
        const { error } = await authClient.signIn.email({ email, password })
        if (error) throw new Error(error.message)
      }
      router.push("/admin")
      router.refresh()
    } catch (err) {
      setError(isSignUp ? "Could not create account. Try a different email." : "Invalid email or password.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-border bg-card/80 p-8 backdrop-blur">
      <div className="mb-6">
        <span className="text-2xl font-extrabold uppercase tracking-tight text-primary">
          Rebel<span className="text-foreground">Stream</span>
        </span>
        <h1 className="mt-4 text-2xl font-bold">{isSignUp ? "Create admin account" : "Admin sign in"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isSignUp ? "Set up the owner account to manage titles." : "Sign in to access the admin portal."}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {isSignUp && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete={isSignUp ? "new-password" : "current-password"}
          />
        </div>

        {error && <p className="text-sm text-primary">{error}</p>}

        <Button type="submit" className="w-full font-semibold" disabled={loading}>
          {loading ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <Link href="/sign-in" className="text-foreground underline underline-offset-4">
              Sign in
            </Link>
          </>
        ) : (
          <>
            Need to set up the owner account?{" "}
            <Link href="/sign-up" className="text-foreground underline underline-offset-4">
              Create it
            </Link>
          </>
        )}
      </p>
    </div>
  )
}
