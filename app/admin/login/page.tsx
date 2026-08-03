"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Mail } from "lucide-react"
import { requestMagicLink } from "@/lib/actions/auth"

function LoginForm() {
  const searchParams = useSearchParams()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "invalido" ? "Ese link venció o no es válido. Pedí uno nuevo." : null,
  )
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setLoading(true)
    const result = await requestMagicLink(formData)
    setLoading(false)
    if (result?.error) {
      setError(result.error)
      return
    }
    setSent(true)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
        <h1 className="font-serif text-xl font-semibold text-foreground">Panel de administración</h1>

        {sent ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Si ese email tiene acceso, te mandamos un link para entrar. Revisá tu bandeja (y spam) —
            expira en 15 minutos.
          </p>
        ) : (
          <>
            <p className="mt-1 text-sm text-muted-foreground">
              Ingresá tu email y te mandamos un link para entrar, sin contraseña.
            </p>
            <form action={handleSubmit} className="mt-5 space-y-3">
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="tu@email.com"
                  className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
              >
                {loading ? "Enviando…" : "Mandarme el link"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
