"use server"

import { cookies } from "next/headers"
import { createToken, isAdminEmail, MAGIC_LINK_TTL_SECONDS, SESSION_COOKIE } from "@/lib/auth"
import { sendEmail } from "@/lib/email"

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000").replace(/\/$/, "")
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
      await sendEmail({
        to: email,
        subject: "Tu acceso al panel de Pequenido",
        html: `
          <p>Hacé click en el siguiente link para entrar al panel de administración de Pequenido:</p>
          <p><a href="${url}">${url}</a></p>
          <p>El link expira en 15 minutos. Si no lo pediste vos, ignorá este mail.</p>
        `,
      })
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