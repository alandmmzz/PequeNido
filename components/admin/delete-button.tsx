"use client"

import { deleteProduct } from "@/lib/actions/products"

export function DeleteButton({ id, name }: { id: string; name: string }) {
  return (
    <button
      onClick={() => {
        if (confirm(`¿Borrar "${name}"? Esta acción no se puede deshacer.`)) {
          deleteProduct(id)
        }
      }}
      className="text-sm text-destructive hover:underline"
    >
      Borrar
    </button>
  )
}
