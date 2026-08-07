"use server"

import { sendEmail } from "@/lib/email"

type ContactResult = { ok: true } | { ok: false; error: string }

/**
 * Manda la consulta del formulario de /contacto al dueño de la tienda
 * (NOTIFICATION_EMAIL, o ADMIN_EMAIL si no está seteada esa) usando Resend.
 * Deja el mail del cliente como "reply to" para poder responderle directo.
 */
export async function sendContactMessage(formData: FormData): Promise<ContactResult> {
  const name = (formData.get("name") as string || "").trim()
  const email = (formData.get("email") as string || "").trim()
  const message = (formData.get("message") as string || "").trim()

  if (!name || !email || !message) {
    return { ok: false, error: "Completá tu nombre, mail y mensaje." }
  }

  const recipients = (process.env.NOTIFICATION_EMAIL ?? process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean)

  if (recipients.length === 0) {
    return {
      ok: false,
      error: "La tienda todavía no configuró un mail de contacto. Escribinos por WhatsApp mientras tanto.",
    }
  }

  const html = `
    <div style="font-family: sans-serif; font-size: 14px; color: #292522;">
      <h2 style="color:#5B6B3C;">Nueva consulta desde /contacto</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Mail:</strong> ${email}</p>
      <p><strong>Mensaje:</strong></p>
      <p style="white-space: pre-wrap; border-left: 3px solid #e5e2d8; padding-left: 12px;">${message}</p>
    </div>
  `

  try {
    await sendEmail({
      to: recipients,
      subject: `Consulta de ${name} — Peque Nido`,
      html,
      replyTo: email,
    })
    return { ok: true }
  } catch (err) {
    console.error("[contacto] error al enviar mail:", err)
    return { ok: false, error: "No se pudo enviar tu mensaje. Probá de nuevo o escribinos por WhatsApp." }
  }
}
