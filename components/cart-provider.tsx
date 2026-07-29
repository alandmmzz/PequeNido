"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { CartDrawer } from "@/components/cart-drawer"

const CART_STORAGE_KEY = "pequenido:cart"

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  meta?: string
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  count: number
  total: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  // Empieza en false a propósito: el primer render (servidor y cliente) tiene
  // que coincidir con carrito vacío para evitar un mismatch de hidratación.
  // Recién después de montar leemos localStorage y lo activamos.
  const [hydrated, setHydrated] = useState(false)

  // Cargar el carrito guardado (una sola vez, al montar en el cliente).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch (err) {
      console.error("No se pudo leer el carrito guardado:", err)
    } finally {
      setHydrated(true)
    }
  }, [])

  // Guardar en localStorage cada vez que cambie el carrito, pero solo
  // después de haber cargado lo anterior (si no, pisaríamos lo guardado
  // con el carrito vacío inicial antes de leerlo).
  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (err) {
      console.error("No se pudo guardar el carrito:", err)
    }
  }, [items, hydrated])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, quantity } : i)),
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const count = useMemo(() => items.reduce((n, i) => n + i.quantity, 0), [items])
  const total = useMemo(() => items.reduce((n, i) => n + i.price * i.quantity, 0), [items])

  const value = useMemo(
    () => ({
      items,
      count,
      total,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, count, total, isOpen, openCart, closeCart, addItem, removeItem, updateQuantity, clearCart],
  )

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider")
  return ctx
}