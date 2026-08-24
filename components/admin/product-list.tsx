import Link from "next/link"
import Image from "next/image"
import type { ProductRow } from "@/lib/db/schema"
import { DeleteButton } from "@/components/admin/delete-button"
import { AdminPager } from "@/components/admin/pager"

export function ProductList({
  items,
  total,
  page,
  pageSize,
  query,
}: {
  items: ProductRow[]
  total: number
  page: number
  pageSize: number
  query: string
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div>
      {/* Form nativo (sin JS) para la búsqueda: navega a /admin?q=... y reinicia la página. */}
      <form action="/admin" className="mb-4">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Buscar producto por nombre..."
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        />
      </form>

      <p className="mb-3 text-sm text-muted-foreground">
        {total} producto{total === 1 ? "" : "s"}
        {query && ` que coinciden con "${query}"`}
      </p>

      <div className="space-y-2">
        {items.map((p) => (
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
              <p className="flex items-center gap-2 font-medium">
                {p.name}
                {p.promoPrice != null && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    Promo
                  </span>
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                {p.kind === "toy" ? "Juguete" : "Libro"} ·{" "}
                {p.promoPrice != null ? (
                  <>
                    <span className="line-through">${p.price}</span> ${p.promoPrice}
                  </>
                ) : (
                  <>${p.price}</>
                )}
              </p>
            </div>
            <Link href={`/admin/${p.id}/editar`} className="text-sm text-primary hover:underline">
              Editar
            </Link>
            <DeleteButton id={p.id} name={p.name} />
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-muted-foreground text-sm">
            {total === 0 && !query
              ? "Todavía no hay productos cargados."
              : "Ningún producto coincide con la búsqueda."}
          </p>
        )}
      </div>

      <AdminPager basePath="/admin" page={page} totalPages={totalPages} extraParams={query ? { q: query } : {}} />
    </div>
  )
}
