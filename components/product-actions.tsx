"use client"

import { useState } from "react"
import { Check, Minus, Plus, ShoppingBag } from "lucide-react"
import { useCart } from "@/components/cart-provider"

type ProductActionsProps = {
  id: string
  name: string
  price: number
  image: string
  meta?: string
}

export function ProductActions({ id, name, price, image, meta }: ProductActionsProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    for (let i = 0; i < quantity; i++) {
      addItem({ id, name, price, image, meta }) // price ya viene calculado (promo o común) desde la página del producto
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="inline-flex items-center gap-1 rounded-full border border-border bg-background p-1">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="inline-flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted disabled:opacity-40"
          aria-label="Restar unidad"
          disabled={quantity <= 1}
        >
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <span className="w-8 text-center text-sm font-semibold text-foreground" aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(9, q + 1))}
          className="inline-flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
          aria-label="Sumar unidad"
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        {added ? (
          <>
            <Check className="size-4" aria-hidden="true" />
            Añadido a la carrito
          </>
        ) : (
          <>
            <ShoppingBag className="size-4" aria-hidden="true" />
            Añadir a la carrito
          </>
        )}
      </button>
    </div>
  )
}
