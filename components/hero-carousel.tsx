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
  secondaryCta?: { href: string; label: string }
}

const slides: Slide[] = [
  {
    image: "/images/hero-slide-1-wide.png",
    alt: "Dos niños jugando con juguetes de madera en un espacio cálido",
    eyebrow: "Pequenido",
    title: "Jugar también es crecer.",
    text: "Juguetes y libros pensados para acompañar cada etapa de la infancia.",
    cta: { href: "/juguetes", label: "Explorar juguetes" },
    secondaryCta: { href: "/libros", label: "Descubrir libros" },
  },
  {
    image: "/images/hero-slide-2-wide.png",
    alt: "Libros para bebés y peques",
    eyebrow: "Para leer juntos",
    title: "Primeras historias, grandes momentos",
    text: "Libros de tela, cartón y tapa dura pensados para pequeñas manos.",
    cta: { href: "/libros", label: "Explorar libros" },
  },
  {
    image: "/images/hero-slide-3-wide.png",
    alt: "Rincón de juego para bebés con canasto de peluches y gimnasio de madera",
    eyebrow: "Envíos a todo el país",
    title: "Envíos dentro de Montevideo, Pick Up y envíos a todo el interior",
    text: "Preparamos tu pedido en 24 a 72 hs hábiles.",
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
        - 550px o más: lado a lado, texto a la izquierda / imagen panorámica
          a la derecha, fundida hacia el texto con un degradado suave. El título
          se adapta en el primer tramo (550-768px) y crece desde md.

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
            {/*
              La imagen y el degradado son full-bleed (ocupan todo el ancho
              de la sección, no el max-w-6xl del contenido) para que no
              queden espacios vacíos a los costados en pantallas anchas.
              El contenido de texto sí respeta el max-w-6xl por separado.
            */}
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/80 via-55% to-secondary/5 min-[550px]:bg-gradient-to-r min-[550px]:from-secondary min-[550px]:via-secondary/65 min-[550px]:via-38% min-[550px]:to-transparent" />
            <div className="relative mx-auto flex h-full max-w-6xl flex-col items-center gap-3 px-5 py-4 min-[550px]:flex-row min-[550px]:gap-5 min-[550px]:px-6 min-[550px]:py-0 md:gap-8 md:px-8 lg:gap-12">
              <div className="absolute bottom-12 left-5 right-5 z-10 flex w-auto flex-col justify-end min-[550px]:static min-[550px]:w-full min-[550px]:flex-1 min-[550px]:justify-center">
                <span className="inline-flex w-fit items-center rounded-full bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground min-[550px]:text-xs">
                  {slide.eyebrow}
                </span>
                <h2 className="mt-2 max-w-[21rem] font-serif text-[1.45rem] font-semibold leading-[1.08] tracking-tight text-foreground text-balance min-[550px]:mt-3 min-[550px]:max-w-none min-[550px]:text-xl md:text-3xl lg:text-5xl">
                  {slide.title}
                </h2>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground text-pretty min-[550px]:mt-2 min-[550px]:text-sm md:mt-3 md:text-base">
                  {slide.text}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 min-[550px]:mt-4 md:gap-3 md:mt-6">
                  <Link
                    href={slide.cta.href}
                    className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 min-[550px]:px-5 min-[550px]:py-2.5 min-[550px]:text-xs md:px-6 md:py-3 md:text-sm"
                  >
                    {slide.cta.label}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                  {slide.secondaryCta ? (
                    <Link
                      href={slide.secondaryCta.href}
                      className="inline-flex w-fit items-center gap-2 rounded-full border border-primary px-4 py-2.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10 min-[550px]:px-5 min-[550px]:py-2.5 md:px-6 md:py-3 md:text-sm"
                    >
                      {slide.secondaryCta.label}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  ) : null}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={prev}
        className="absolute left-3 top-1/2 z-30 hidden -translate-y-1/2 items-center justify-center rounded-full bg-background/80 p-2 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background md:inline-flex"
        aria-label="Anterior"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-3 top-1/2 z-30 hidden -translate-y-1/2 items-center justify-center rounded-full bg-background/80 p-2 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background md:inline-flex"
        aria-label="Siguiente"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute bottom-2.5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 min-[550px]:bottom-3 md:bottom-4">
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
