"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { formatPrice } from "@/lib/products"

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, count } = useCart()

  return (
    <div
      className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      {/* Overlay */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-foreground/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de la compra"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
          <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
            <ShoppingBag className="size-5" aria-hidden="true" />
            Tu carrito
            {count > 0 && <span className="text-sm font-normal text-muted-foreground">({count})</span>}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Cerrar carrito"
          >
            <X className="size-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <ShoppingBag className="size-7" aria-hidden="true" />
            </span>
            <p className="font-medium text-foreground">Tu carrito está vacía</p>
            <p className="text-sm text-muted-foreground">
              Añade juguetes y libros para verlos aquí.
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Seguir comprando
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border/70 overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 py-4">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-secondary/50">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug text-foreground">{item.name}</p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        aria-label={`Quitar ${item.name} de la carrito`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    {item.meta && <p className="text-xs text-muted-foreground">{item.meta}</p>}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="inline-flex size-8 items-center justify-center rounded-full text-foreground hover:bg-muted"
                          aria-label="Reducir cantidad"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="inline-flex size-8 items-center justify-center rounded-full text-foreground hover:bg-muted"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border/70 px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-serif text-lg font-semibold text-foreground">
                  {formatPrice(total)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Envío gratis al interior por DAC. En Montevideo y área metropolitana, costo de
                cadetería calculado al finalizar.
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-4 flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Finalizar compra
              </Link>
              <button
                type="button"
                onClick={closeCart}
                className="mt-2 w-full rounded-full px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Seguir comprando
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
