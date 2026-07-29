"use client"

import { useEffect } from "react"
import { useCart } from "@/components/cart-provider"

export function ClearCartOnMount() {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
    // Solo queremos que corra una vez, al entrar a la página de éxito.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
