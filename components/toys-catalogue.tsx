"use client"

import { useMemo, useState, useTransition } from "react"
import { Search, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProductCard } from "@/components/product-card"
import { ageRanges, ageIcons, type AgeRange } from "@/lib/products"
import { getProductsPage } from "@/lib/actions/products"
import type { ProductRow } from "@/lib/db/schema"

type Filter = AgeRange | "todos"

export function ToysCatalogue({
  initialItems,
  initialHasMore,
  initialTotal,
  initialAge,
  pageSize,
}: {
  initialItems: ProductRow[]
  initialHasMore: boolean
  initialTotal: number
  initialAge?: AgeRange
  pageSize: number
}) {
  const [filter, setFilter] = useState<Filter>(initialAge ?? "todos")
  const [query, setQuery] = useState("")
  const [items, setItems] = useState(initialItems)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [total, setTotal] = useState(initialTotal)
  const [isPending, startTransition] = useTransition()

  // La búsqueda por texto filtra sobre lo ya cargado (no vuelve a pedir al
  // servidor), así que solo encuentra coincidencias entre los productos que
  // ya se mostraron en pantalla — si lo que buscás está más adelante, un
  // "Cargar más" antes de buscar lo trae.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
  }, [items, query])

  function changeFilter(next: Filter) {
    setFilter(next)
    setQuery("")
    startTransition(async () => {
      const age = next === "todos" ? undefined : next
      const result = await getProductsPage({ kind: "toy", age, offset: 0, limit: pageSize })
      setItems(result.items)
      setHasMore(result.hasMore)
      setTotal(result.total)
    })
  }

  function loadMore() {
    startTransition(async () => {
      const age = filter === "todos" ? undefined : filter
      const result = await getProductsPage({ kind: "toy", age, offset: items.length, limit: pageSize })
      setItems((prev) => [...prev, ...result.items])
      setHasMore(result.hasMore)
    })
  }

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
          const Icon = f.id !== "todos" ? ageIcons[f.id as AgeRange] : null
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => changeFilter(f.id)}
              aria-pressed={active}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              {Icon && <Icon className="size-4" aria-hidden="true" />}
              {f.label}
            </button>
          )
        })}
      </div>

      <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
        {query ? `${filtered.length} de ${items.length} cargados` : `${items.length} de ${total} producto${total === 1 ? "" : "s"}`}
      </p>

      {filtered.length > 0 ? (
        <div className={cn("mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4", isPending && "opacity-60")}>
          {filtered.map((toy) => (
            <ProductCard
              key={toy.id}
              id={toy.id}
              name={toy.name}
              description={toy.description}
              price={toy.price}
              promoPrice={toy.promoPrice}
              image={toy.image}
              ages={toy.ages ?? undefined}
            />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-muted-foreground">
          No hay productos que coincidan con la búsqueda.
        </p>
      )}

      {!query && hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-60"
          >
            {isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            Cargar más
          </button>
        </div>
      )}
    </div>
  )
}
