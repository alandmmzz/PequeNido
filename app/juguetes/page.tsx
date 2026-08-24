import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ToysCatalogue } from "@/components/toys-catalogue"
import { getProductsPage } from "@/lib/actions/products"
import { ageRanges, type AgeRange } from "@/lib/products"

export const metadata: Metadata = {
  title: "Juguetes | Peque Nido",
  description:
    "Descubre juguetes de madera y materiales naturales filtrados por edad: 0-12 meses, 12-24 meses, 2-4 años y +4 años.",
}

export const dynamic = "force-dynamic"

const PAGE_SIZE = 24

export default async function JuguetesPage({
  searchParams,
}: {
  searchParams: Promise<{ edad?: string }>
}) {
  const { edad } = await searchParams
  const validAge = ageRanges.find((r) => r.id === edad)?.id as AgeRange | undefined
  const { items: toys, hasMore, total } = await getProductsPage({
    kind: "toy",
    age: validAge,
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
            <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-foreground text-balance">
              Juguetes por edad
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground text-pretty">
              Cada etapa tiene su juego. Filtra por la edad de tu peque y encuentra propuestas seguras que
              estimulan sus sentidos, su motricidad y su imaginación.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <ToysCatalogue
            initialItems={toys}
            initialHasMore={hasMore}
            initialTotal={total}
            initialAge={validAge}
            pageSize={PAGE_SIZE}
          />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
