"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Film, X } from "lucide-react"
import type { ProductRow } from "@/lib/db/schema"

/**
 * Un <input type="file"> no puede recibir su valor por props (por seguridad
 * del navegador), pero sí se le puede asignar `.files` con un DataTransfer.
 * Este componente mantiene un input oculto sincronizado con la lista de
 * archivos que se maneja en estado en el form, para que viaje en el FormData
 * al enviar (incluye multi-selección hecha en más de un paso).
 */
function HiddenFileList({ name, files }: { name: string; files: File[] }) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const dataTransfer = new DataTransfer()
    files.forEach((file) => dataTransfer.items.add(file))
    ref.current.files = dataTransfer.files
  }, [files])

  return <input ref={ref} type="file" name={name} multiple className="hidden" readOnly />
}

export function ProductForm({
  action,
  initial,
}: {
  action: (formData: FormData) => void
  initial?: ProductRow
}) {
  const [kind, setKind] = useState<"toy" | "book">(initial?.kind ?? "toy")
  const [preview, setPreview] = useState<string | null>(initial?.image ?? null)

  // Imágenes adicionales: las que ya tenía el producto (se pueden quitar)
  // + las nuevas que se eligen ahora (se suben al guardar).
  const [existingGallery, setExistingGallery] = useState<string[]>(initial?.additionalImages ?? [])
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([])
  const newGalleryPreviews = newGalleryFiles.map((f) => URL.createObjectURL(f))

  // Video: el que ya tenía el producto (se puede quitar) o uno nuevo elegido ahora.
  const [existingVideoUrl] = useState<string | null>(initial?.video ?? null)
  const [removeVideo, setRemoveVideo] = useState(false)
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null)
  const newVideoPreview = newVideoFile ? URL.createObjectURL(newVideoFile) : null

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
        <label className="block text-sm font-medium mb-1">Precio (USD)</label>
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
            <select
              name="age"
              defaultValue={initial?.age ?? "0-12m"}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="0-12m">0 - 12 meses</option>
              <option value="12-24m">12 - 24 meses</option>
              <option value="2-4a">2 - 4 años</option>
              <option value="4a+">+4 años</option>
            </select>
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
        {preview && (
          <Image
            src={preview}
            alt="preview"
            width={120}
            height={120}
            className="rounded-md object-cover mb-2 border border-border"
          />
        )}
        <input
          name="imageFile"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) setPreview(URL.createObjectURL(file))
          }}
          className="w-full text-sm"
        />
        {/* Fallback: si no sube archivo, se usa la imagen que ya tenía */}
        <input type="hidden" name="imageUrl" value={initial?.image ?? ""} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Imágenes adicionales</label>
        <p className="text-xs text-muted-foreground mb-2">
          Se muestran en la galería de la ficha del producto, junto a la imagen principal. No
          afectan las miniaturas.
        </p>

        {existingGallery.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {existingGallery.map((url) => (
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
                  onClick={() => setExistingGallery((prev) => prev.filter((u) => u !== url))}
                  className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                  aria-label="Quitar imagen"
                >
                  <X className="size-3" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}

        {newGalleryPreviews.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {newGalleryPreviews.map((url, i) => (
              <div key={url} className="relative">
                <Image
                  src={url}
                  alt="nueva imagen"
                  width={80}
                  height={80}
                  className="rounded-md object-cover border border-primary"
                />
                <button
                  type="button"
                  onClick={() => setNewGalleryFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                  aria-label="Quitar imagen"
                >
                  <X className="size-3" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files ?? [])
            setNewGalleryFiles((prev) => [...prev, ...files])
            e.target.value = ""
          }}
          className="w-full text-sm"
        />

        {/* Imágenes que se mantienen (las que no se borraron) */}
        {existingGallery.map((url) => (
          <input key={url} type="hidden" name="keepAdditionalImages" value={url} />
        ))}
        {/* Los archivos nuevos se mandan aparte porque un <input type=file> no puede
            setearse por JS; los adjuntamos a un input oculto sincronizado con el form. */}
        <HiddenFileList name="additionalImageFiles" files={newGalleryFiles} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Video del producto</label>
        <p className="text-xs text-muted-foreground mb-2">
          Si hay un video cargado, es lo primero que se muestra en la ficha del producto (antes
          que las imágenes).
        </p>

        {existingVideoUrl && !removeVideo && !newVideoFile && (
          <div className="mb-2 flex items-center gap-2">
            <video src={existingVideoUrl} controls className="max-h-40 rounded-md border border-border" />
            <button
              type="button"
              onClick={() => setRemoveVideo(true)}
              className="inline-flex items-center gap-1 text-xs text-destructive hover:underline"
            >
              <X className="size-3" aria-hidden="true" />
              Quitar video
            </button>
          </div>
        )}

        {newVideoPreview && (
          <div className="mb-2 flex items-center gap-2">
            <video src={newVideoPreview} controls className="max-h-40 rounded-md border border-primary" />
            <button
              type="button"
              onClick={() => setNewVideoFile(null)}
              className="inline-flex items-center gap-1 text-xs text-destructive hover:underline"
            >
              <X className="size-3" aria-hidden="true" />
              Cancelar
            </button>
          </div>
        )}

        {!existingVideoUrl && !newVideoFile && (
          <p className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Film className="size-3.5" aria-hidden="true" />
            Este producto todavía no tiene video.
          </p>
        )}

        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              setNewVideoFile(file)
              setRemoveVideo(false)
            }
          }}
          className="w-full text-sm"
        />

        <input
          type="hidden"
          name="existingVideoUrl"
          value={removeVideo ? "" : existingVideoUrl ?? ""}
        />
        <input type="hidden" name="removeVideo" value={removeVideo ? "true" : "false"} />
        <HiddenFileList name="videoFile" files={newVideoFile ? [newVideoFile] : []} />
      </div>

      <button
        type="submit"
        className="bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-medium"
      >
        Guardar
      </button>
    </form>
  )
}
