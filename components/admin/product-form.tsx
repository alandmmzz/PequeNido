"use client"

import { useState } from "react"
import Image from "next/image"
import type { ProductRow } from "@/lib/db/schema"

export function ProductForm({
  action,
  initial,
}: {
  action: (formData: FormData) => void
  initial?: ProductRow
}) {
  const [kind, setKind] = useState<"toy" | "book">(initial?.kind ?? "toy")
  const [preview, setPreview] = useState<string | null>(initial?.image ?? null)

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
        <label className="block text-sm font-medium mb-1">Imagen</label>
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

      <button
        type="submit"
        className="bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-medium"
      >
        Guardar
      </button>
    </form>
  )
}
