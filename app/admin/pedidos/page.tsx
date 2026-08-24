import { getOrdersPage, getOrderMonths } from "@/lib/actions/orders"
import { OrderList } from "@/components/admin/order-list"

export const dynamic = "force-dynamic"

const PAGE_SIZE = 24

export default async function AdminPedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; month?: string }>
}) {
  const { page: pageParam, q, month: monthParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const query = q?.trim() ?? ""
  const month = monthParam?.trim() || "todos"

  const [{ items, total }, months] = await Promise.all([
    getOrdersPage({
      offset: (page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      query: query || undefined,
      month: month !== "todos" ? month : undefined,
    }),
    getOrderMonths(),
  ])

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <span className="text-sm text-muted-foreground">
          {total} pedido{total === 1 ? "" : "s"}
        </span>
      </div>

      <OrderList
        orders={items}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        query={query}
        month={month}
        months={months}
      />
    </div>
  )
}
