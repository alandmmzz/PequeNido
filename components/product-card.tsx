"use client"

import Image from "next/image"
import { Check, ShoppingBag } from "lucide-react"
import { useState } from "react"
import { formatPrice } from "@/lib/products"
import { useCart } from "@/components/cart-provider"

type ProductCardProps = {
  id: string
  name: string
  description: string
  price: number
  image: string
  badge?: string
  meta?: string
}

export function ProductCard({ id, name, description, price, image, badge, meta }: ProductCardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem({ id, name, price, image, meta })
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-shadow hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-secondary/50">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm">
            {badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {meta && <p className="text-xs font-medium uppercase tracking-wide text-primary">{meta}</p>}
        <h3 className="mt-1 font-serif text-base font-semibold leading-snug text-foreground text-balance">
          {name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{description}</p>

        <div className="mt-4 flex items-center justify-between gap-2 pt-2">
          <span className="text-lg font-semibold text-foreground">{formatPrice(price)}</span>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            aria-label={`Añadir ${name} a la cesta`}
          >
            {added ? (
              <>
                <Check className="size-4" aria-hidden="true" />
                Añadido
              </>
            ) : (
              <>
                <ShoppingBag className="size-4" aria-hidden="true" />
                Añadir
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
