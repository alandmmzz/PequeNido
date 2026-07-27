import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Leaf, Sparkles, Truck } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductCard } from "@/components/product-card"
import { ageRanges, books, toys } from "@/lib/products"

export default function HomePage() {
  const destacados = toys.slice(0, 4)
  const librosDestacados = books.slice(0, 4)

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 lg:pt-16">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                <Leaf className="size-3.5" aria-hidden="true" />
                Materiales naturales y seguros
              </span>
              <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
                Juguetes y libros que crecen con tu bebé
              </h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
                En Pequeñido elegimos cada pieza con cariño para acompañar el juego, el descanso y los
                primeros descubrimientos, desde los 0 meses en adelante.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/juguetes"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Ver juguetes
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/libros"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Explorar libros
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/70 bg-secondary/50">
                <Image
                  src="/images/hero.png"
                  alt="Juguetes de madera y libros para bebés sobre una manta de lino"
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Ventajas */}
        <section className="border-y border-border/70 bg-secondary/30">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6">
            {[
              { icon: Leaf, title: "Materiales nobles", text: "Madera, algodón y tintes al agua." },
              { icon: Truck, title: "Envío en 24-48 h", text: "Gratis a partir de 39 €." },
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
                href={`/juguetes?edad=${range.id}`}
                className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-border/70 bg-card px-4 py-8 text-center transition-colors hover:border-primary hover:bg-accent/40"
              >
                <span className="flex size-14 items-center justify-center rounded-full bg-accent font-serif text-lg font-semibold text-accent-foreground">
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
              <p className="mt-1 text-muted-foreground">Los favoritos de las familias Pequeñido.</p>
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
            {destacados.map((toy) => {
              const range = ageRanges.find((r) => r.id === toy.age)
              return (
                <ProductCard
                  key={toy.id}
                  name={toy.name}
                  description={toy.description}
                  price={toy.price}
                  image={toy.image}
                  meta={range?.short}
                />
              )
            })}
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
                name={book.name}
                description={book.description}
                price={book.price}
                image={book.image}
                meta={book.format}
              />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
