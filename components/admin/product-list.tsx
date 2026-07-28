"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { ProductRow } from "@/lib/db/schema"
import { DeleteButton } from "@/components/admin/delete-button"

export function ProductList({ items }: { items: ProductRow[] }) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((p) => p.name.toLowerCase().includes(q))
  }, [items, query])

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar producto por nombre..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 mb-4"
      />

      <div className="space-y-2">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 border border-border rounded-md p-3"
          >
            <Image
              src={p.image}
              alt={p.name}
              width={56}
              height={56}
              className="rounded-md object-cover"
            />
            <div className="flex-1">
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-muted-foreground">
                {p.kind === "toy" ? "Juguete" : "Libro"} · ${p.price}
              </p>
            </div>
            <Link href={`/admin/${p.id}/editar`} className="text-sm text-primary hover:underline">
              Editar
            </Link>
            <DeleteButton id={p.id} name={p.name} />
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-muted-foreground text-sm">
            {items.length === 0
              ? "Todavía no hay productos cargados."
              : "Ningún producto coincide con la búsqueda."}
          </p>
        )}
      </div>
    </div>
  )
}
