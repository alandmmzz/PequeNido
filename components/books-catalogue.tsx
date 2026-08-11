"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { getProductMeta } from "@/lib/products"
import type { ProductRow } from "@/lib/db/schema"

export function BooksCatalogue({ items }: { items: ProductRow[] }) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (b) => b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q),
    )
  }, [items, query])

  return (
    <div>
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar libros..."
          aria-label="Buscar libros"
          className="w-full rounded-full border border-input bg-background py-2 pl-9 pr-4 text-sm"
        />
      </div>

      <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
      </p>

      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {filtered.map((book) => (
            <ProductCard
              key={book.id}
              id={book.id}
              name={book.name}
              description={book.description}
              price={book.price}
              promoPrice={book.promoPrice}
              image={book.image}
              meta={getProductMeta(book)}
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
