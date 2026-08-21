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
    image: "/images/hero-train-set.png",
    alt: "Nene jugando con set de tren de madera Peque Nido",
    eyebrow: "Nueva temporada",
    title: "Juguetes que crecen con tu bebé",
    text: "Madera natural y materiales seguros para acompañar cada etapa, desde los 0 meses.",
    cta: { href: "/juguetes", label: "Ver juguetes" },
  },
  {
    image: "/images/hero-books.png",
    alt: "Libros para bebés y peques",
    eyebrow: "Para leer juntos",
    title: "Primeras historias, grandes momentos",
    text: "Libros de tela, cartón y tapa dura pensados para pequeñas manos.",
    cta: { href: "/libros", label: "Explorar libros" },
  },
  {
    image: "/images/hero-nursery.png",
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
      <div className="relative aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[21/9] lg:max-h-[440px]">
        {slides.map((slide, i) => (
          <div
            key={slide.image}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === current ? 1 : 0 }}
            aria-hidden={i !== current}
          >
            {/* Layout: texto sobre fondo sólido a la izquierda, la foto contenida
                en su propia tarjeta a la derecha (nunca a pantalla completa), así
                el recorte respeta el encuadre original de cada foto. */}
            <div className="mx-auto flex h-full max-w-6xl flex-col-reverse items-center px-6 py-6 sm:flex-row sm:gap-8 sm:px-8 sm:py-0 lg:gap-12">
              <div className="z-10 flex w-full flex-1 flex-col justify-center py-2 sm:py-0">
                <span className="inline-flex w-fit items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  {slide.eyebrow}
                </span>
                <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight tracking-tight text-foreground text-balance sm:text-4xl lg:text-5xl">
                  {slide.title}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
                  {slide.text}
                </p>
                <Link
                  href={slide.cta.href}
                  className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:mt-6"
                >
                  {slide.cta.label}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="relative aspect-[4/5] w-full max-w-[280px] shrink-0 overflow-hidden rounded-3xl shadow-lg sm:aspect-square sm:max-w-sm lg:max-w-md">
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 420px, (min-width: 640px) 384px, 280px"
                  className="object-cover"
                />
                {/* Degradado sutil en el borde izquierdo de la foto, para que se
                    funda con el fondo sólido en vez de cortar en seco. */}
                <div className="absolute inset-y-0 left-0 hidden w-10 bg-gradient-to-r from-secondary/60 to-transparent sm:block" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={prev}
        className="absolute left-3 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-background/80 p-2 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background sm:inline-flex"
        aria-label="Anterior"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-background/80 p-2 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background sm:inline-flex"
        aria-label="Siguiente"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 sm:bottom-4">
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
