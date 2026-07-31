import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductCard } from "@/components/product-card"
import { getProducts } from "@/lib/actions/products"
import { getProductMeta } from "@/lib/products"

export const metadata: Metadata = {
  title: "Libros | Pequenido",
  description:
    "Libros de tela, cartón y tapa dura para bebés y niños: sensoriales, primeras palabras y cuentos para dormir.",
}

export const dynamic = "force-dynamic"

export default async function LibrosPage() {
  const allProducts = await getProducts()
  const books = allProducts.filter((p) => p.kind === "book")

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
          <p className="text-sm text-muted-foreground">{books.length} productos</p>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {books.map((book) => (
              <ProductCard
                key={book.id}
                id={book.id}
                name={book.name}
                description={book.description}
                price={book.price}
                image={book.image}
                meta={getProductMeta(book)}
              />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
