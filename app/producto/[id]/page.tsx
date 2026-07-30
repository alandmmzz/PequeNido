import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, PackageCheck, ShieldCheck, Truck } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductCard } from "@/components/product-card"
import { ProductGallery } from "@/components/product-gallery"
import { ProductActions } from "@/components/product-actions"
import { getProducts } from "@/lib/actions/products"
import { formatPrice, getProductMeta, getRelatedProducts } from "@/lib/products"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const allProducts = await getProducts()
  const product = allProducts.find((p) => p.id === id)
  if (!product) return {}

  return {
    title: `${product.name} | Pequeñido`,
    description: product.description,
  }
}

export default async function ProductoPage({ params }: Props) {
  const { id } = await params
  const allProducts = await getProducts()
  const product = allProducts.find((p) => p.id === id)

  if (!product) notFound()

  const meta = getProductMeta(product)
  const related = getRelatedProducts(product, allProducts)

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Volver al inicio
          </Link>
        </div>

        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Galería: video primero si existe, después la imagen principal y las adicionales */}
            <ProductGallery
              productName={product.name}
              image={product.image}
              additionalImages={product.additionalImages}
              video={product.video}
            />

            {/* Información del producto */}
            <div className="flex flex-col">
              {meta && (
                <p className="text-sm font-medium uppercase tracking-wide text-primary">{meta}</p>
              )}
              <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 text-lg font-semibold text-foreground">{formatPrice(product.price)}</p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
                {product.description}
              </p>

              {/* Ficha técnica */}
              <dl className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-border/70 bg-secondary/30 p-4 text-sm sm:grid-cols-2">
                {product.kind === "toy" ? (
                  <>
                    <div>
                      <dt className="text-muted-foreground">Edad recomendada</dt>
                      <dd className="font-medium text-foreground">{meta}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Material</dt>
                      <dd className="font-medium text-foreground">{product.material ?? "—"}</dd>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <dt className="text-muted-foreground">Formato</dt>
                      <dd className="font-medium text-foreground">{product.format ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Páginas</dt>
                      <dd className="font-medium text-foreground">{product.pages ?? "—"}</dd>
                    </div>
                  </>
                )}
              </dl>

              <div className="mt-6">
                <ProductActions
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  meta={meta}
                />
              </div>

              {/* Confianza */}
              <div className="mt-8 grid gap-4 border-t border-border/70 pt-6 sm:grid-cols-3">
                {[
                  { icon: Truck, title: "Envío 24-48 h", text: "Gratis a partir de $U 39" },
                  { icon: ShieldCheck, title: "Seguridad certificada", text: "Normativa europea" },
                  { icon: PackageCheck, title: "Revisado a mano", text: "Antes de cada envío" },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex items-start gap-2.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{title}</p>
                      <p className="text-xs text-muted-foreground">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Productos relacionados */}
        {related.length > 0 && (
          <section className="border-t border-border/70 bg-secondary/30">
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                También te puede interesar
              </h2>
              <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {related.map((item) => (
                  <ProductCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    image={item.image}
                    meta={getProductMeta(item)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
