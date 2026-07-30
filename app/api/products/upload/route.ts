import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"

/**
 * Autoriza uploads directos del navegador a Vercel Blob (sin pasar por el
 * body de una Server Action). Esto evita el límite de 4.5MB que Vercel le
 * pone al body de las funciones serverless, así que los videos y las
 * imágenes grandes se pueden subir sin problema desde el panel de admin.
 */
export async function POST(request: Request): Promise<NextResponse> {
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
