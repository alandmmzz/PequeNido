"use server"

import { cookies } from "next/headers"
import { createToken, isAdminEmail, MAGIC_LINK_TTL_SECONDS, SESSION_COOKIE } from "@/lib/auth"

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000").replace(/\/$/, "")
}

async function sendMagicLinkEmail(email: string, url: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error(
      "Falta la variable de entorno RESEND_API_KEY (creá una cuenta gratis en resend.com para poder mandar el mail de acceso).",
    )
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "Pequenido <onboarding@resend.dev>",
      to: email,
      subject: "Tu acceso al panel de Pequenido",
      html: `
        <p>Hacé click en el siguiente link para entrar al panel de administración de Pequenido:</p>
        <p><a href="${url}">${url}</a></p>
        <p>El link expira en 15 minutos. Si no lo pediste vos, ignorá este mail.</p>
      `,
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    throw new Error(`No se pudo enviar el mail (${res.status}). ${detail}`)
  }
}

/**
 * Pide un magic link para entrar a /admin. Por seguridad, siempre devuelve
 * el mismo mensaje genérico exista o no ese email entre los admins — así no
 * se puede usar este formulario para averiguar qué mails están autorizados.
 */
export async function requestMagicLink(formData: FormData) {
  const email = (formData.get("email") as string)?.trim()

  if (!email) {
    return { error: "Ingresá un email." }
  }

  if (isAdminEmail(email)) {
    try {
      const token = await createToken(email, MAGIC_LINK_TTL_SECONDS)
      const url = `${getBaseUrl()}/admin/verify?token=${encodeURIComponent(token)}`
      await sendMagicLinkEmail(email, url)
    } catch (err) {
      console.error("Error mandando el magic link:", err)
      return { error: err instanceof Error ? err.message : "No se pudo mandar el mail." }
    }
  }

  return { sent: true }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
