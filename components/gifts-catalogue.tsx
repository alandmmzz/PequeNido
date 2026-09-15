"use client"

import { useState } from "react"
import { getProductsPage } from "@/lib/actions/products"
import { ProductCard } from "@/components/product-card"
import type { ProductRow } from "@/lib/db/schema"

export function GiftsCatalogue({
  initialItems,
  initialHasMore,
  initialTotal,
  pageSize,
}: {
  initialItems: ProductRow[]
  initialHasMore: boolean
  initialTotal: number
  pageSize: number
}) {
  const [items, setItems] = useState(initialItems)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)

  async function loadMore() {
    setLoading(true)
    try {
      const result = await getProductsPage({ kind: "gift", offset: items.length, limit: pageSize })
      setItems((previous) => [...previous, ...result.items])
      setHasMore(result.hasMore)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <p className="mb-6 text-sm text-muted-foreground">
        {items.length} de {initialTotal} productos
      </p>
      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((gift) => (
            <ProductCard
              key={gift.id}
              id={gift.id}
              name={gift.name}
              description={gift.description}
              price={gift.price}
              promoPrice={gift.promoPrice}
              image={gift.image}
              ages={gift.ages ?? []}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="font-serif text-xl font-semibold text-foreground">Próximamente</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Estamos preparando una selección de regalos especiales.
          </p>
        </div>
      )}
      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-60"
          >
            {loading ? "Cargando..." : "Cargar más"}
          </button>
        </div>
      )}
    </div>
  )
}
