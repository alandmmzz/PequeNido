import { NextResponse, type NextRequest } from "next/server"
import { createToken, isAdminEmail, verifyToken, SESSION_COOKIE, SESSION_TTL_SECONDS } from "@/lib/auth"

/**
 * El link del mail apunta acá. Si el token es válido y no expiró, creamos
 * una sesión (cookie firmada, httpOnly) y mandamos al admin a /admin.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")
  const email = await verifyToken(token)

  if (!email || !isAdminEmail(email)) {
    return NextResponse.redirect(new URL("/admin/login?error=invalido", request.url))
  }

  const sessionToken = await createToken(email, SESSION_TTL_SECONDS)
  const response = NextResponse.redirect(new URL("/admin", request.url))
  response.cookies.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  })
  return response
}
