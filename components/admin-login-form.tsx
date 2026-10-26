"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, LockKeyhole } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { ADMIN_USERNAME } from "@/lib/admin-config"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function AdminLoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState(ADMIN_USERNAME)
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    try {
      const result = await authClient.signIn.username({ username: username.trim(), password })
      if (result.error) {
        setError("Unable to sign in. Check your username and password.")
        return
      }
      router.replace("/admin")
      router.refresh()
    } catch {
      setError("Unable to sign in. Check your username and password.")
    } finally {
      setPending(false)
    }
  }

  return (
    <Card className="border-border/70 bg-card/90 shadow-2xl shadow-black/20">
      <CardHeader className="gap-3">
        <div className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
          <LockKeyhole aria-hidden="true" className="size-5" />
        </div>
        <div className="flex flex-col gap-1.5">
          <CardTitle className="text-2xl">Administrator sign in</CardTitle>
          <CardDescription>Use the private Rebel Stream administrator credentials.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="admin-username">Username</FieldLabel>
              <Input
                id="admin-username"
                name="username"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="admin-password">Password</FieldLabel>
              <Input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Field>
          </FieldGroup>
          <FieldError>{error}</FieldError>
          <Button type="submit" className="w-full" disabled={pending} aria-busy={pending}>
            {pending ? "Signing in…" : "Sign in"}
            {!pending && <ArrowRight data-icon="inline-end" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
