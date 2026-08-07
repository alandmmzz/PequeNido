"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, MessageCircle, Send } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { sendContactMessage } from "@/lib/actions/contact"
import { CONTACT_EMAIL, WHATSAPP_DEFAULT_MESSAGE, WHATSAPP_NUMBER } from "@/lib/contact-info"

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37a4 4 0 1 1-7.914 1.174 4 4 0 0 1 7.914-1.174z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

const canales = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    text: "Es la vía más rápida para consultas sobre pedidos, stock o envíos.",
    href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`,
    label: "Escribir por WhatsApp",
  },
  {
    icon: Mail,
    title: "Mail",
    text: "Para consultas más largas o si preferís que quede todo por escrito.",
    href: `mailto:${CONTACT_EMAIL}`,
    label: CONTACT_EMAIL,
  },
  {
    icon: InstagramIcon,
    title: "Instagram",
    text: "Seguinos para ver novedades, reposiciones y sorteos.",
    href: "https://instagram.com/pequenido.uy",
    label: "@pequenido.uy",
  },
]

export default function ContactoPage() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setStatus("idle")
    setErrorMsg(null)

    const result = await sendContactMessage(formData)

    setLoading(false)
    if (result.ok) {
      setStatus("ok")
    } else {
      setStatus("error")
      setErrorMsg(result.error)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">Estamos para ayudarte</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-foreground text-balance sm:text-5xl">
            Contacto
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty">
            ¿Tenés dudas sobre un producto, tu pedido o los envíos? Escribinos por el canal que prefieras o
            dejanos tu consulta acá abajo y te respondemos a la brevedad.
          </p>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
            {/* Canales de contacto */}
            <div className="flex flex-col gap-4">
              {canales.map(({ icon: Icon, title, text, href, label }) => (
                <a
                  key={title}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-5 transition-colors hover:border-primary/40"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                    <span className="mt-2 inline-block text-sm font-medium text-primary">{label}</span>
                  </div>
                </a>
              ))}

              <div className="rounded-2xl border border-border/70 bg-secondary/40 p-5 text-sm text-muted-foreground">
                Antes de escribirnos, puede que tu duda ya esté resuelta en nuestra{" "}
                <Link href="/envios-y-devoluciones" className="font-medium text-foreground hover:underline">
                  política de envíos y devoluciones
                </Link>
                .
              </div>
            </div>

            {/* Formulario */}
            <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
              <h2 className="font-serif text-xl font-semibold text-foreground">Dejanos tu consulta</h2>
              <p className="mt-1 text-sm text-muted-foreground">Te respondemos por mail apenas la vemos.</p>

              {status === "ok" ? (
                <div className="mt-6 rounded-xl border border-primary/30 bg-accent/20 p-5 text-sm text-foreground">
                  ¡Gracias por escribirnos! Recibimos tu mensaje y te vamos a responder a la brevedad.
                </div>
              ) : (
                <form action={handleSubmit} className="mt-6 space-y-5">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Nombre y apellido</label>
                    <input
                      name="name"
                      required
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Mensaje</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="Contanos en qué te podemos ayudar"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    />
                  </div>

                  {status === "error" && errorMsg ? (
                    <p className="text-sm text-destructive">{errorMsg}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
                  >
                    <Send className="size-4" aria-hidden="true" />
                    {loading ? "Enviando..." : "Enviar mensaje"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
