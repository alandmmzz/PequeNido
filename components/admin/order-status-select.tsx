"use client"

import { useTransition } from "react"
import { updateOrderStatus } from "@/lib/actions/orders"
import type { OrderRow } from "@/lib/db/schema"

const options: { value: OrderRow["status"]; label: string }[] = [
  { value: "pending", label: "Pendiente" },
  { value: "paid", label: "Pagado" },
  { value: "rejected", label: "Rechazado" },
  { value: "cancelled", label: "Cancelado" },
]

export function OrderStatusSelect({ id, status }: { id: string; status: OrderRow["status"] }) {
  const [isPending, startTransition] = useTransition()

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as OrderRow["status"]
        startTransition(() => {
          updateOrderStatus(id, next)
        })
      }}
      aria-label="Cambiar estado del pedido"
      className="rounded-md border border-input bg-background px-2 py-1 text-sm disabled:opacity-60"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
