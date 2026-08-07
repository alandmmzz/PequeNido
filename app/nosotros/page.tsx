import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Heart, Leaf, ShieldCheck, Sparkles } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Nosotros | Peque Nido",
  description:
    "Conoce Peque Nido: una tienda familiar de juguetes y libros con materiales naturales, pensada para acompañar cada etapa del crecimiento.",
}

const valores = [
  {
    icon: Leaf,
    title: "Materiales naturales",
    text: "Madera, algodón y tintes al agua. Nada de plásticos innecesarios ni químicos agresivos.",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad primero",
    text: "Cada producto cumple la normativa europea de seguridad infantil y lo revisamos a mano.",
  },
  {
    icon: Heart,
    title: "Hecho con cariño",
    text: "Seleccionamos piezas de pequeños talleres y marcas que cuidan cada detalle.",
  },
  {
    icon: Sparkles,
    title: "Juego con sentido",
    text: "Juguetes y libros que acompañan el desarrollo real de cada etapa, sin prisas.",
  },
]

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
                Un proyecto familiar para crecer jugando
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
                Peque Nido nació de una idea sencilla: rodear a los más pequeños de juguetes y libros
                bonitos, seguros y duraderos. Buscábamos objetos con alma, de esos que pasan de mano en
                mano y acompañan durante años, y no los encontrábamos fácilmente. Así que decidimos
                reunirlos nosotros.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
                Hoy seleccionamos a mano cada pieza de nuestro catálogo pensando en cómo juega, descubre y
                descansa un bebé en cada etapa, desde los primeros meses hasta los primeros cuentos leídos
                en familia.
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/70 bg-secondary/50">
              <Image
                src="/images/nosotros.png"
                alt="Manos ordenando juguetes de madera y libros infantiles"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="border-y border-border/70 bg-secondary/30">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl font-semibold text-foreground">En qué creemos</h2>
              <p className="mt-2 text-muted-foreground">
                Cuatro principios que guían todo lo que ponemos en la tienda.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {valores.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-border/70 bg-card p-6">
                  <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cierre */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="overflow-hidden rounded-3xl bg-primary px-6 py-10 text-primary-foreground sm:px-12 sm:py-14">
            <div className="max-w-xl">
              <h2 className="font-serif text-3xl font-semibold text-balance sm:text-4xl">
                Gracias por confiar en Peque Nido
              </h2>
              <p className="mt-3 text-sm leading-relaxed opacity-90 sm:text-base">
                Detrás de cada pedido hay una familia como la tuya. Descubre nuestra selección de juguetes y
                libros y encuentra el compañero perfecto para cada etapa.
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
