/**
 * Helper compartido para mandar mails transaccionales (login por magic link,
 * confirmación de pedido, etc.) usando Resend. Necesita RESEND_API_KEY
 * configurada — si falta, tira un error claro en vez de fallar en silencio.
 */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error(
      "Falta la variable de entorno RESEND_API_KEY (creá una cuenta gratis en resend.com para poder mandar mails).",
    )
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "Peque Nido <onboarding@resend.dev>",
      to,
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    throw new Error(`No se pudo enviar el mail (${res.status}). ${detail}`)
  }
}
