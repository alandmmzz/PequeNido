"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { ProductCard } from "@/components/product-card"
import { ageRanges, getProductMeta, type AgeRange } from "@/lib/products"
import type { ProductRow } from "@/lib/db/schema"

type Filter = AgeRange | "todos"

export function ToysCatalogue({ items, initialAge }: { items: ProductRow[]; initialAge?: AgeRange }) {
  const [filter, setFilter] = useState<Filter>(initialAge ?? "todos")

  const filtered = useMemo(
    () => (filter === "todos" ? items : items.filter((t) => t.age === filter)),
    [items, filter],
  )

  const filters: { id: Filter; label: string }[] = [
    { id: "todos", label: "Todas las edades" },
    ...ageRanges.map((r) => ({ id: r.id as Filter, label: r.label })),
  ]

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por edad">
        {filters.map((f) => {
          const active = filter === f.id
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={active}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
      </p>

      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {filtered.map((toy) => (
            <ProductCard
              key={toy.id}
              id={toy.id}
              name={toy.name}
              description={toy.description}
              price={toy.price}
              image={toy.image}
              meta={getProductMeta(toy)}
            />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-muted-foreground">
          No hay productos para esta edad todavía.
        </p>
      )}
    </div>
  )
}
