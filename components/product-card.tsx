"use client"

import Image from "next/image"
import Link from "next/link"
import { Check, ImageOff, ShoppingBag } from "lucide-react"
import { useState } from "react"
import { formatPrice, getEffectivePrice, hasPromo } from "@/lib/products"
import { useCart } from "@/components/cart-provider"
import { AgeBadgeList } from "@/components/age-badge"

type ProductCardProps = {
  id: string
  name: string
  description: string
  price: number
  promoPrice?: number | null
  image: string
  badge?: string
  meta?: string
  ages?: string[]
}

export function ProductCard({
  id,
  name,
  description,
  price,
  promoPrice,
  image,
  badge,
  meta,
  ages,
}: ProductCardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)
  const onPromo = hasPromo({ price, promoPrice })
  const effectivePrice = getEffectivePrice({ price, promoPrice })

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addItem({ id, name, price: effectivePrice, image, meta })
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-shadow hover:shadow-md">
      <Link href={`/producto/${id}`} className="contents">
        <div className="relative aspect-square overflow-hidden bg-secondary/50">
          {!imgFailed ? (
            <Image
              src={image || "/placeholder.svg"}
              alt={name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-muted-foreground">
              <ImageOff className="size-6" aria-hidden="true" />
              <span className="text-xs">Imagen no disponible</span>
            </div>
          )}
          {onPromo && (
            <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
              Promo
            </span>
          )}
          {badge && !onPromo && (
            <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm">
              {badge}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          {ages && ages.length > 0 && <AgeBadgeList ageIds={ages} />}
          {meta && (
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-primary">{meta}</p>
          )}
          <h3 className="mt-1 font-serif text-base font-semibold leading-snug text-foreground text-balance group-hover:underline">
            {name}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{description}</p>

          <div className="mt-4 flex items-center justify-between gap-2 pt-2">
            <span className="flex flex-col leading-tight">
              {onPromo && (
                <span className="text-xs text-muted-foreground line-through">{formatPrice(price)}</span>
              )}
              <span className="text-lg font-semibold text-foreground">{formatPrice(effectivePrice)}</span>
            </span>
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:px-3.5"
              aria-label={`Añadir ${name} a la carrito`}
            >
              {added ? (
                <>
                  <Check className="size-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Añadido</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="size-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Añadir</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Link>
    </article>
  )
}
