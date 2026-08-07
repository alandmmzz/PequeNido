import { NextResponse, type NextRequest } from "next/server"
import { verifyToken, isAdminEmail, SESSION_COOKIE } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // BYPASS TEMPORAL — SOLO PARA HOY, mientras el dominio de Resend no está
  // verificado y no se puede mandar el magic link. Deja pasar a /admin sin
  // login mientras ADMIN_BYPASS_OPEN=true esté seteada en Vercel.
  // Para volver a cerrar el panel: borrar esa variable de entorno en Vercel
  // (Settings → Environment Variables) y hacer un redeploy. No hace falta
  // tocar código de nuevo.
  if (process.env.ADMIN_BYPASS_OPEN === "true") {
    return NextResponse.next()
  }

  // El login y la verificación del magic link tienen que quedar accesibles
  // sin sesión (si no, nadie podría loguearse nunca).
  if (pathname === "/admin/login" || pathname === "/admin/verify") {
    return NextResponse.next()
  }

  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value
  const email = await verifyToken(sessionToken)

  if (!email || !isAdminEmail(email)) {
    const loginUrl = new URL("/admin/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
