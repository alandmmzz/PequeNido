import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Nosotros | Peque Nido",
  description:
    "Conoce Peque Nido: una tienda familiar de juguetes y libros con materiales naturales, pensada para acompañar cada etapa del crecimiento.",
}

export default function NosotrosPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Intro */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-primary">Nuestra historia</p>
              <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-foreground text-balance sm:text-5xl">
                Detrás de Peque Nido está Katy, mamá de Emi.
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
                Peque Nido nació después de convertirme en mamá. Con Emi descubrí un mundo nuevo: el de
                acompañar cada etapa, observar cómo juega, qué despierta su curiosidad y qué cosas la hacen
                imaginar, crear y disfrutar.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
                En ese camino empecé a mirar los juguetes y los libros de otra manera. A buscar propuestas
                que fueran lindas, pero también que tuvieran algo más: que invitaran a explorar, imaginar,
                crear y compartir.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
                Así nació Peque Nido.
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/70 bg-secondary/50">
              <Image
                src="/images/about-us.png"
                alt="Manos ordenando juguetes de madera y libros infantiles"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Selección */}
        <section className="border-y border-border/70 bg-secondary/30">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
            <h2 className="font-serif text-3xl font-semibold text-foreground">¿Qué vas a encontrar?</h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
              Una selección de libros, juguetes, juegos de rol y propuestas para crear e imaginar, elegidos
              pensando en distintas etapas de la infancia.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
              Cada producto que llega a Peque Nido pasa por una elección personal. Me pregunto qué puede
              despertar, qué posibilidades de juego ofrece y qué lugar puede ocupar en la vida cotidiana de
              un peque.
            </p>
            <p className="mt-4 font-serif text-xl text-foreground text-pretty">
              Porque creo que no se trata de tener más juguetes, sino de elegir aquellos que realmente
              inviten a jugar.
            </p>
          </div>
        </section>

        {/* Cierre */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="overflow-hidden rounded-3xl bg-primary px-6 py-10 text-primary-foreground sm:px-12 sm:py-14">
            <div className="max-w-xl">
              <h2 className="font-serif text-3xl font-semibold text-balance sm:text-4xl">
                Lo que quiero construir con Peque Nido
              </h2>
              <p className="mt-3 text-sm leading-relaxed opacity-90 sm:text-base">
                Un espacio donde puedas encontrar ideas para regalar, para acompañar una etapa, para
                compartir un momento o simplemente para dejar que un peque explore y descubra a su manera.
              </p>
              <p className="mt-3 text-sm leading-relaxed opacity-90 sm:text-base">
                Porque detrás de cada compra hay alguien que quiere regalar algo más que un objeto. Por eso,
                detrás de cada elección hay mucho de mí, de mi experiencia como mamá y de lo que quiero
                transmitir con Peque Nido.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/juguetes"
                  className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
                >
                  Ver juguetes
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/libros"
                  className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
                >
                  Explorar libros
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
