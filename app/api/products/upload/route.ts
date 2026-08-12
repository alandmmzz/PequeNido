import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { isAdminEmail, SESSION_COOKIE, verifyToken } from "@/lib/auth"

/**
 * Autoriza uploads directos del navegador a Vercel Blob (sin pasar por el
 * body de una Server Action). Esto evita el límite de 4.5MB que Vercel le
 * pone al body de las funciones serverless, así que los videos y las
 * imágenes grandes se pueden subir sin problema desde el panel de admin.
 *
 * Esta ruta queda fuera de /admin, así que el middleware no la protege por
 * su cuenta: hay que revisar la sesión acá mismo, si no cualquiera que
 * encuentre esta URL podría conseguir un token válido para subir archivos
 * a tu Blob storage sin estar logueada.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  const email = await verifyToken(token)
  if (!email || !isAdminEmail(email)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ["image/*", "video/*"],
          addRandomSuffix: true,
        }
      },
      onUploadCompleted: async () => {
        // No necesitamos hacer nada acá: el form guarda la URL del blob
        // cuando termina el upload y la manda al crear/editar el producto.
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
