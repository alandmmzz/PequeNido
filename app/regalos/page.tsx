import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { GiftsCatalogue } from "@/components/gifts-catalogue"
import { getProductsPage } from "@/lib/actions/products"

export const metadata: Metadata = {
  title: "Regalos | Peque Nido",
  description: "Ideas de regalos especiales para bebés, peques y familias.",
}

export const dynamic = "force-dynamic"

const PAGE_SIZE = 24

export default async function RegalosPage() {
  const { items, hasMore, total } = await getProductsPage({
    kind: "gift",
    offset: 0,
    limit: PAGE_SIZE,
  })

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border/70 bg-secondary/30">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">Catálogo</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-foreground">
              Regalos con intención
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Detalles elegidos para celebrar nacimientos, cumpleaños y cada momento especial.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <GiftsCatalogue
            initialItems={items}
            initialHasMore={hasMore}
            initialTotal={total}
            pageSize={PAGE_SIZE}
          />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
