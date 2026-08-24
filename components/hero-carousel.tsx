"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

type Slide = {
  image: string
  alt: string
  eyebrow: string
  title: string
  text: string
  cta: { href: string; label: string }
}

const slides: Slide[] = [
  {
    image: "/images/hero-slide-1.png",
    alt: "Nene jugando con set de tren de madera Peque Nido",
    eyebrow: "Nueva temporada",
    title: "Juguetes que crecen con tu bebé",
    text: "Madera natural y materiales seguros para acompañar cada etapa, desde los 0 meses.",
    cta: { href: "/juguetes", label: "Ver juguetes" },
  },
  {
    image: "/images/hero-slide-2.png",
    alt: "Libros para bebés y peques",
    eyebrow: "Para leer juntos",
    title: "Primeras historias, grandes momentos",
    text: "Libros de tela, cartón y tapa dura pensados para pequeñas manos.",
    cta: { href: "/libros", label: "Explorar libros" },
  },
  {
    image: "/images/hero-slide-3.png",
    alt: "Rincón de juego para bebés",
    eyebrow: "Envíos a todo el país",
    title: "Envío al interior por DAC",
    text: "En Montevideo y área metropolitana lo llevamos por cadetería privada. Recibilo en 24 a 72 hs una vez confirmado el pago.",
    cta: { href: "/envios-y-devoluciones", label: "Ver política de envíos" },
  },
]

export function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((index: number) => {
    setCurrent((index + slides.length) % slides.length)
  }, [])

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    timer.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length)
    }, 5000)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [current])

  return (
    <section
      className="relative overflow-hidden bg-secondary/30"
      aria-roledescription="carrusel"
      aria-label="Destacados de la tienda"
    >
      {/*
        Layout responsive en 2 modos, con el corte en 550px (breakpoint
        custom `min-[550px]:`, no el `sm:` de Tailwind que es 640px):

        - Menos de 550px: apilado. La imagen arriba, ancho completo, con
          proporción de banner (bien achatada, no un cuadrado ni un
          retrato) para que no ocupe media pantalla. El texto abajo.
        - 550px o más: lado a lado, texto a la izquierda / imagen en una
          tarjeta contenida a la derecha. Achicamos bastante la tarjeta y
          el tamaño de letra justo en este primer tramo (550-768px) para
          que el título no se rompa palabra por palabra; a partir de
          md (768px) ya vuelve a crecer con más aire.

        Las flechas de navegación (prev/next) se muestran recién desde
        md (768px): en el tramo angosto de 550-768px no hay margen para
        que convivan con el texto sin superponerse.
      */}
      <div className="relative aspect-[4/5] w-full min-[550px]:aspect-[21/9] lg:max-h-[440px]">
        {slides.map((slide, i) => (
          <div
            key={slide.image}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === current ? 1 : 0 }}
            aria-hidden={i !== current}
          >
            <div className="mx-auto flex h-full max-w-6xl flex-col items-center gap-3 px-5 py-4 min-[550px]:flex-row min-[550px]:gap-5 min-[550px]:px-6 min-[550px]:py-0 md:gap-8 md:px-8 lg:gap-12">
              <div className="z-10 order-2 flex w-full flex-1 flex-col justify-center min-[550px]:order-1 min-[550px]:py-0">
                <span className="inline-flex w-fit items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  {slide.eyebrow}
                </span>
                <h2 className="mt-2 font-serif text-lg font-semibold leading-tight tracking-tight text-foreground text-balance min-[550px]:mt-3 min-[550px]:text-xl md:text-3xl lg:text-5xl">
                  {slide.title}
                </h2>
                <p className="mt-1.5 max-w-md text-xs leading-relaxed text-muted-foreground text-pretty min-[550px]:mt-2 min-[550px]:text-sm md:mt-3 md:text-base">
                  {slide.text}
                </p>
                <Link
                  href={slide.cta.href}
                  className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 min-[550px]:mt-4 md:mt-6 md:px-6 md:py-3 md:text-sm"
                >
                  {slide.cta.label}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="relative order-1 aspect-[16/9] w-full shrink-0 overflow-hidden rounded-2xl shadow-lg min-[550px]:order-2 min-[550px]:aspect-square min-[550px]:w-[38%] min-[550px]:max-w-[170px] min-[550px]:rounded-3xl md:max-w-xs lg:max-w-md">
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 420px, (min-width: 768px) 320px, (min-width: 550px) 170px, 100vw"
                  className="object-cover"
                />
                {/* Degradado sutil en el borde izquierdo de la foto, para que se
                    funda con el fondo sólido en vez de cortar en seco. Solo
                    aplica en el layout lado a lado. */}
                <div className="absolute inset-y-0 left-0 hidden w-8 bg-gradient-to-r from-secondary/60 to-transparent min-[550px]:block" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={prev}
        className="absolute left-3 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-background/80 p-2 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background md:inline-flex"
        aria-label="Anterior"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-background/80 p-2 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background md:inline-flex"
        aria-label="Siguiente"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 min-[550px]:bottom-3 md:bottom-4">
        {slides.map((slide, i) => (
          <button
            key={slide.image}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ir a la diapositiva ${i + 1}`}
            aria-current={i === current}
            className={
              i === current
                ? "h-2 w-6 rounded-full bg-primary transition-all"
                : "h-2 w-2 rounded-full bg-foreground/30 transition-all hover:bg-foreground/50"
            }
          />
        ))}
      </div>
    </section>
  )
}
