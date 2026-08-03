"use client"

import { useMemo, useState } from "react"
import type { OrderItemRow, OrderRow } from "@/lib/db/schema"
import { formatPrice } from "@/lib/products"
import { SHIPPING_ZONE_LABELS } from "@/lib/shipping"
import { OrderStatusSelect } from "@/components/admin/order-status-select"

type OrderWithItems = { order: OrderRow; items: OrderItemRow[] }

const statusLabels: Record<OrderRow["status"], string> = {
  pending: "Pendiente",
  paid: "Pagado",
  rejected: "Rechazado",
  cancelled: "Cancelado",
}

const statusStyles: Record<OrderRow["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-muted text-muted-foreground",
}

const paymentMethodLabels: Record<OrderRow["paymentMethod"], string> = {
  mercadopago: "Mercado Pago",
  transferencia: "Transferencia bancaria",
}

export function OrderList({ orders }: { orders: OrderWithItems[] }) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return orders
    return orders.filter(
      ({ order }) =>
        order.customerName.toLowerCase().includes(q) ||
        order.customerEmail.toLowerCase().includes(q) ||
        order.id.toLowerCase().includes(q),
    )
  }, [orders, query])

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar por cliente, email o ID de pedido..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-4 w-full rounded-md border border-input bg-background px-3 py-2"
      />

      <div className="space-y-3">
        {filtered.map(({ order, items }) => (
          <div key={order.id} className="rounded-md border border-border p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{order.customerName}</p>
                <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString("es-UY")} · #{order.id.slice(0, 8)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  {SHIPPING_ZONE_LABELS[order.shippingZone]}
                </span>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  {paymentMethodLabels[order.paymentMethod]}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.status]}`}>
                  {statusLabels[order.status]}
                </span>
                <OrderStatusSelect id={order.id} status={order.status} />
              </div>
            </div>

            <div className="mt-3 divide-y divide-border/70 border-t border-border/70 pt-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-1.5 text-sm">
                  <span className="text-foreground">
                    {item.quantity}× {item.name}
                  </span>
                  <span className="text-muted-foreground">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3">
              <span className="text-sm text-muted-foreground">
                {order.address ? `${order.address}, ${order.city} (${order.postalCode ?? "-"})` : "Retiro en el local"}
              </span>
              <span className="font-semibold">{formatPrice(order.total)}</span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {orders.length === 0 ? "Todavía no hay pedidos." : "Ningún pedido coincide con la búsqueda."}
          </p>
        )}
      </div>
    </div>
  )
}
