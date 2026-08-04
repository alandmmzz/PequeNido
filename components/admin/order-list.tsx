"use client"

import { useMemo, useState } from "react"
import { Download } from "lucide-react"
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

/** Clave "YYYY-MM" a partir de una fecha, para agrupar pedidos por mes. */
function monthKey(date: Date | string) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number)
  const label = new Date(year, month - 1, 1).toLocaleDateString("es-UY", { month: "long", year: "numeric" })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

/** Escapa un valor para que no rompa el CSV si tiene comas, comillas o saltos de línea. */
function csvCell(value: string | number) {
  const str = String(value)
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

function downloadSalesSummary(monthKeyValue: string, ordersInMonth: OrderWithItems[]) {
  const header = ["Fecha", "Cliente", "Email", "Teléfono", "Método de pago", "Entrega", "Estado", "Total"]
  const rows = ordersInMonth.map(({ order }) => [
    new Date(order.createdAt).toLocaleDateString("es-UY"),
    order.customerName,
    order.customerEmail,
    order.customerPhone,
    paymentMethodLabels[order.paymentMethod],
    SHIPPING_ZONE_LABELS[order.shippingZone],
    statusLabels[order.status],
    order.total,
  ])

  const paidOrders = ordersInMonth.filter(({ order }) => order.status === "paid")
  const totalFacturado = paidOrders.reduce((sum, { order }) => sum + order.total, 0)

  const lines = [
    header.map(csvCell).join(","),
    ...rows.map((row) => row.map(csvCell).join(",")),
    "",
    csvCell(`Total de pedidos: ${ordersInMonth.length}`),
    csvCell(`Pedidos pagados: ${paidOrders.length}`),
    csvCell(`Total facturado (solo pagados): ${formatPrice(totalFacturado)}`),
  ]

  const csv = "\uFEFF" + lines.join("\n") // BOM adelante para que Excel muestre bien los acentos
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `pequenido-ventas-${monthKeyValue}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function OrderList({ orders }: { orders: OrderWithItems[] }) {
  const [query, setQuery] = useState("")

  const months = useMemo(() => {
    const keys = new Set(orders.map(({ order }) => monthKey(order.createdAt)))
    return Array.from(keys).sort((a, b) => (a < b ? 1 : -1))
  }, [orders])

  const [month, setMonth] = useState<string>("todos")

  const byMonth = useMemo(
    () => (month === "todos" ? orders : orders.filter(({ order }) => monthKey(order.createdAt) === month)),
    [orders, month],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return byMonth
    return byMonth.filter(
      ({ order }) =>
        order.customerName.toLowerCase().includes(q) ||
        order.customerEmail.toLowerCase().includes(q) ||
        order.customerPhone.toLowerCase().includes(q) ||
        order.id.toLowerCase().includes(q),
    )
  }, [byMonth, query])

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar por cliente, email o ID de pedido..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-[240px] flex-1 rounded-md border border-input bg-background px-3 py-2"
        />

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="todos">Todos los meses</option>
          {months.map((key) => (
            <option key={key} value={key}>
              {monthLabel(key)}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => downloadSalesSummary(month === "todos" ? "todos" : month, byMonth)}
          disabled={byMonth.length === 0}
          className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary/50 disabled:opacity-50"
        >
          <Download className="size-4" aria-hidden="true" />
          Descargar resumen{month !== "todos" ? ` de ${monthLabel(month).toLowerCase()}` : ""}
        </button>
      </div>

      <div className="space-y-3">
        {filtered.map(({ order, items }) => (
          <div key={order.id} className="rounded-md border border-border p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{order.customerName}</p>
                <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                <a
                  href={`tel:${order.customerPhone}`}
                  className="text-sm font-medium text-foreground hover:underline"
                >
                  {order.customerPhone}
                </a>
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
            {orders.length === 0
              ? "Todavía no hay pedidos."
              : byMonth.length === 0
                ? "No hay pedidos en ese mes."
                : "Ningún pedido coincide con la búsqueda."}
          </p>
        )}
      </div>
    </div>
  )
}
