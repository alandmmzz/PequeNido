import { getOrders } from "@/lib/actions/orders"
import { OrderList } from "@/components/admin/order-list"

export const dynamic = "force-dynamic"

export default async function AdminPedidosPage() {
  const orders = await getOrders()

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <span className="text-sm text-muted-foreground">
          {orders.length} pedido{orders.length === 1 ? "" : "s"}
        </span>
      </div>

      <OrderList orders={orders} />
    </div>
  )
}
