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
    image: "/images/hero-toys.png",
    alt: "Juguetes de madera para bebés",
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
    eyebrow: "Envío gratis +$U 39",
    title: "Todo para su rincón favorito",
    text: "Seleccionamos a mano cada pieza para el juego, el descanso y los descubrimientos.",
    cta: { href: "/juguetes", label: "Descubrir" },
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
      className="relative overflow-hidden"
      aria-roledescription="carrusel"
      aria-label="Destacados de la tienda"
    >
      <div className="relative aspect-[3/4] w-full sm:aspect-[21/9] lg:aspect-[24/8]">
        {slides.map((slide, i) => (
          <div
            key={slide.image}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === current ? 1 : 0 }}
            aria-hidden={i !== current}
          >
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/55 to-transparent" />

            <div className="relative mx-auto flex h-full max-w-6xl items-center px-6 pb-14 sm:px-8 sm:pb-0">
              <div className="max-w-lg">
                <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
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
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:mt-6"
                >
                  {slide.cta.label}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
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

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
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
