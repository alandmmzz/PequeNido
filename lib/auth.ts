// Firma y verifica tokens simples (HMAC-SHA256) usando Web Crypto, que
// funciona tanto en el runtime de Node (Server Actions, Route Handlers)
// como en el runtime Edge (middleware) — así no dependemos de ninguna
// librería extra para el login por magic link del panel de admin.

function getSecret() {
  const secret = process.env.AUTH_SECRET
  if (!secret) {
    throw new Error(
      "Falta la variable de entorno AUTH_SECRET (una clave larga y random para firmar la sesión de /admin).",
    )
  }
  return secret
}

function base64UrlEncode(input: string) {
  return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function base64UrlDecode(input: string) {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(input.length / 4) * 4, "=")
  return atob(padded)
}

async function hmac(data: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data))
  return base64UrlEncode(String.fromCharCode(...new Uint8Array(sig)))
}

/** Crea un token firmado con el email y una fecha de expiración (en segundos desde ahora). */
export async function createToken(email: string, ttlSeconds: number) {
  const payload = JSON.stringify({ email: email.toLowerCase(), exp: Date.now() + ttlSeconds * 1000 })
  const payloadB64 = base64UrlEncode(payload)
  const signature = await hmac(payloadB64)
  return `${payloadB64}.${signature}`
}

/** Verifica un token firmado y devuelve el email si es válido y no expiró. */
export async function verifyToken(token: string | undefined | null): Promise<string | null> {
  if (!token) return null
  const [payloadB64, signature] = token.split(".")
  if (!payloadB64 || !signature) return null

  const expectedSignature = await hmac(payloadB64)
  if (signature !== expectedSignature) return null

  try {
    const { email, exp } = JSON.parse(base64UrlDecode(payloadB64)) as { email: string; exp: number }
    if (Date.now() > exp) return null
    return email
  } catch {
    return null
  }
}

export function isAdminEmail(email: string) {
  const allowed = (process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  return allowed.includes(email.trim().toLowerCase())
}

export const SESSION_COOKIE = "admin_session"
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30 // 30 días
export const MAGIC_LINK_TTL_SECONDS = 60 * 15 // 15 minutos
