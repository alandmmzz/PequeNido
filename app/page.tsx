import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Leaf, Sparkles, Truck } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductCard } from "@/components/product-card"
import { HeroCarousel } from "@/components/hero-carousel"
import { getProducts } from "@/lib/actions/products"
import { ageRanges, getProductMeta } from "@/lib/products"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const allProducts = await getProducts()
  const destacados = allProducts.filter((p) => p.kind === "toy").slice(0, 4)
  const librosDestacados = allProducts.filter((p) => p.kind === "book").slice(0, 4)

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Carrusel */}
        <HeroCarousel />

        {/* Categorías */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                href: "/juguetes",
                image: "/images/banner-toys.png",
                title: "Juguetes",
                text: "De madera y materiales nobles",
              },
              {
                href: "/libros",
                image: "/images/banner-books.png",
                title: "Libros",
                text: "Para los primeros lectores",
              },
            ].map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group relative flex aspect-[16/9] items-end overflow-hidden rounded-3xl border border-border/70"
              >
                <Image
                  src={cat.image || "/placeholder.svg"}
                  alt={cat.title}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="relative p-6">
                  <h2 className="font-serif text-2xl font-semibold text-background">{cat.title}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-background/90">
                    {cat.text}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Ventajas */}
        <section className="border-y border-border/70 bg-secondary/30">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6">
            {[
              { icon: Leaf, title: "Materiales nobles", text: "Madera, algodón y tintes al agua." },
              { icon: Truck, title: "Envío en 24 a 72 h", text: "Gratis al interior por DAC." },
              { icon: Sparkles, title: "Seleccionado a mano", text: "Cada producto lo probamos antes." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Compra por edad */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="font-serif text-3xl font-semibold text-foreground">Compra por edad</h2>
            <p className="text-muted-foreground">Encuentra el juguete perfecto para cada etapa.</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {ageRanges.map((range) => (
              <Link
                key={range.id}
                href={`/juguetes?edad=${encodeURIComponent(range.id)}`}
                className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-8 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <span className="flex size-14 items-center justify-center rounded-full bg-accent font-serif text-lg font-semibold text-accent-foreground transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                  {range.short.split(" ")[0]}
                </span>
                <span className="text-sm font-medium text-foreground">{range.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Juguetes destacados */}
        <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-foreground">Juguetes destacados</h2>
              <p className="mt-1 text-muted-foreground">Los favoritos de las familias Pequenido.</p>
            </div>
            <Link
              href="/juguetes"
              className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:underline sm:inline-flex"
            >
              Ver todos
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {destacados.map((toy) => (
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
        </section>

        {/* Banner libros */}
        <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
          <div className="overflow-hidden rounded-3xl bg-primary px-6 py-10 text-primary-foreground sm:px-12 sm:py-14">
            <div className="max-w-xl">
              <h2 className="font-serif text-3xl font-semibold text-balance sm:text-4xl">
                Primeras historias para leer juntos
              </h2>
              <p className="mt-3 text-sm leading-relaxed opacity-90 sm:text-base">
                Libros de tela, cartón y tapa dura pensados para pequeñas manos y grandes momentos de calma.
              </p>
              <Link
                href="/libros"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
              >
                Descubrir la colección
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* Libros destacados */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-foreground">Libros para peques</h2>
              <p className="mt-1 text-muted-foreground">Historias que acompañan cada etapa.</p>
            </div>
            <Link
              href="/libros"
              className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:underline sm:inline-flex"
            >
              Ver todos
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {librosDestacados.map((book) => (
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
