import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BooksCatalogue } from "@/components/books-catalogue"
import { getProductsPage } from "@/lib/actions/products"
import { ageRanges, type AgeRange } from "@/lib/products"

export const metadata: Metadata = {
  title: "Libros | Peque Nido",
  description:
    "Libros de tela, cartón y tapa dura para bebés y niños: sensoriales, primeras palabras y cuentos para dormir.",
}

export const dynamic = "force-dynamic"

const PAGE_SIZE = 24

export default async function LibrosPage({
  searchParams,
}: {
  searchParams: Promise<{ edad?: string }>
}) {
  const { edad } = await searchParams
  const validAge = ageRanges.find((r) => r.id === edad)?.id as AgeRange | undefined
  const { items: books, hasMore, total } = await getProductsPage({
    kind: "book",
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
              Libros para peques
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground text-pretty">
              Del primer libro de tela al cuento de buenas noches. Historias resistentes, seguras y llenas de
              ternura para leer una y otra vez.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <BooksCatalogue
            initialItems={books}
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
