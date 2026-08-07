"use client"

import { useState } from "react"
import Image from "next/image"
import { upload } from "@vercel/blob/client"
import { Film, Loader2, X } from "lucide-react"
import type { ProductRow } from "@/lib/db/schema"

// Subimos los archivos directo desde el navegador a Vercel Blob (en vez de
// mandarlos al server action) para no chocar con el límite de 4.5MB que
// Vercel le pone al body de las funciones serverless. El form termina
// mandando solamente las URLs ya subidas.
async function uploadToBlob(file: File, folder: string) {
  const blob = await upload(`productos/${folder}/${Date.now()}-${file.name}`, file, {
    access: "public",
    handleUploadUrl: "/api/products/upload",
  })
  return blob.url
}

export function ProductForm({
  action,
  initial,
}: {
  action: (formData: FormData) => void
  initial?: ProductRow
}) {
  const [kind, setKind] = useState<"toy" | "book">(initial?.kind ?? "toy")

  // Imagen principal: la que se usa en thumbnails/tarjetas.
  const [imageUrl, setImageUrl] = useState(initial?.image ?? "")
  const [uploadingImage, setUploadingImage] = useState(false)

  // Imágenes adicionales: se suben apenas se eligen, así que en todo
  // momento este array son URLs reales (ya sea de antes o recién subidas).
  const [galleryUrls, setGalleryUrls] = useState<string[]>(initial?.additionalImages ?? [])
  const [uploadingGallery, setUploadingGallery] = useState(false)

  // Video del producto.
  const [videoUrl, setVideoUrl] = useState<string | null>(initial?.video ?? null)
  const [uploadingVideo, setUploadingVideo] = useState(false)

  const isUploading = uploadingImage || uploadingGallery || uploadingVideo

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      setImageUrl(await uploadToBlob(file, "principal"))
    } catch {
      alert("No se pudo subir la imagen. Probá de nuevo.")
    } finally {
      setUploadingImage(false)
      e.target.value = ""
    }
  }

  async function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setUploadingGallery(true)
    try {
      const urls = await Promise.all(files.map((file) => uploadToBlob(file, "galeria")))
      setGalleryUrls((prev) => [...prev, ...urls])
    } catch {
      alert("No se pudieron subir una o más imágenes. Probá de nuevo.")
    } finally {
      setUploadingGallery(false)
      e.target.value = ""
    }
  }

  async function handleVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingVideo(true)
    try {
      setVideoUrl(await uploadToBlob(file, "videos"))
    } catch {
      alert("No se pudo subir el video. Probá de nuevo.")
    } finally {
      setUploadingVideo(false)
      e.target.value = ""
    }
  }

  return (
    <form action={action} className="max-w-xl space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">Tipo de producto</label>
        <div className="flex gap-2">
          {(["toy", "book"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={`px-4 py-2 rounded-md border text-sm ${
                kind === k
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border"
              }`}
            >
              {k === "toy" ? "Juguete" : "Libro"}
            </button>
          ))}
        </div>
        <input type="hidden" name="kind" value={kind} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          name="name"
          defaultValue={initial?.name}
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          name="description"
          defaultValue={initial?.description}
          required
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Precio (UYU)</label>
        <input
          name="price"
          type="number"
          step="0.01"
          defaultValue={initial?.price}
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        />
      </div>

      {kind === "toy" ? (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Edad recomendada</label>
            <p className="text-xs text-muted-foreground mb-2">Se puede marcar más de una.</p>
            <div className="flex flex-wrap gap-3">
              {[
                { id: "0-12m", label: "0 - 12 meses" },
                { id: "12-24m", label: "12 - 24 meses" },
                { id: "2-4a", label: "2 - 4 años" },
                { id: "4a+", label: "+4 años" },
              ].map((range) => (
                <label key={range.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="ages"
                    value={range.id}
                    defaultChecked={initial?.ages?.includes(range.id) ?? false}
                    className="size-4 rounded border-input"
                  />
                  {range.label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Material</label>
            <input
              name="material"
              defaultValue={initial?.material ?? ""}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Formato</label>
            <input
              name="format"
              defaultValue={initial?.format ?? ""}
              placeholder="Tapa dura, blando, etc."
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Páginas</label>
            <input
              name="pages"
              type="number"
              defaultValue={initial?.pages ?? ""}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Imagen principal</label>
        <p className="text-xs text-muted-foreground mb-2">
          Es la que se muestra en las tarjetas de producto y en las miniaturas del catálogo.
        </p>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="preview"
            width={120}
            height={120}
            className="rounded-md object-cover mb-2 border border-border"
          />
        )}
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={uploadingImage}
            className="w-full text-sm"
          />
          {uploadingImage && <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" aria-hidden="true" />}
        </div>
        <input type="hidden" name="imageUrl" value={imageUrl} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Imágenes adicionales</label>
        <p className="text-xs text-muted-foreground mb-2">
          Se muestran en la galería de la ficha del producto, junto a la imagen principal. No
          afectan las miniaturas.
        </p>

        {galleryUrls.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {galleryUrls.map((url) => (
              <div key={url} className="relative">
                <Image
                  src={url}
                  alt="imagen adicional"
                  width={80}
                  height={80}
                  className="rounded-md object-cover border border-border"
                />
                <button
                  type="button"
                  onClick={() => setGalleryUrls((prev) => prev.filter((u) => u !== url))}
                  className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                  aria-label="Quitar imagen"
                >
                  <X className="size-3" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryChange}
            disabled={uploadingGallery}
            className="w-full text-sm"
          />
          {uploadingGallery && <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" aria-hidden="true" />}
        </div>

        {galleryUrls.map((url) => (
          <input key={url} type="hidden" name="additionalImages" value={url} />
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Video del producto</label>
        <p className="text-xs text-muted-foreground mb-2">
          Si hay un video cargado, es lo primero que se muestra en la ficha del producto (antes
          que las imágenes).
        </p>

        {videoUrl && (
          <div className="mb-2 flex items-center gap-2">
            <video src={videoUrl} controls className="max-h-40 rounded-md border border-border" />
            <button
              type="button"
              onClick={() => setVideoUrl(null)}
              className="inline-flex items-center gap-1 text-xs text-destructive hover:underline"
            >
              <X className="size-3" aria-hidden="true" />
              Quitar video
            </button>
          </div>
        )}

        {!videoUrl && !uploadingVideo && (
          <p className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Film className="size-3.5" aria-hidden="true" />
            Este producto todavía no tiene video.
          </p>
        )}

        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            disabled={uploadingVideo}
            className="w-full text-sm"
          />
          {uploadingVideo && <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" aria-hidden="true" />}
        </div>

        <input type="hidden" name="videoUrl" value={videoUrl ?? ""} />
      </div>

      <button
        type="submit"
        disabled={isUploading}
        className="bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-medium disabled:opacity-50"
      >
        {isUploading ? "Esperá a que termine de subir..." : "Guardar"}
      </button>
    </form>
  )
}
