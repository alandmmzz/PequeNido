"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProductCard } from "@/components/product-card"
import { ageRanges, getProductMeta, type AgeRange } from "@/lib/products"
import type { ProductRow } from "@/lib/db/schema"

type Filter = AgeRange | "todos"

export function ToysCatalogue({ items, initialAge }: { items: ProductRow[]; initialAge?: AgeRange }) {
  const [filter, setFilter] = useState<Filter>(initialAge ?? "todos")
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const byAge = filter === "todos" ? items : items.filter((t) => t.age === filter)
    const q = query.trim().toLowerCase()
    if (!q) return byAge
    return byAge.filter(
      (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
    )
  }, [items, filter, query])

  const filters: { id: Filter; label: string }[] = [
    { id: "todos", label: "Todas las edades" },
    ...ageRanges.map((r) => ({ id: r.id as Filter, label: r.label })),
  ]

  return (
    <div>
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar juguetes..."
          aria-label="Buscar juguetes"
          className="w-full rounded-full border border-input bg-background py-2 pl-9 pr-4 text-sm"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filtrar por edad">
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
          No hay productos que coincidan con la búsqueda.
        </p>
      )}
    </div>
  )
}
