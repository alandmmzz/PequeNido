import Link from "next/link"
import { getProductsAdminPage } from "@/lib/actions/products"
import { ProductList } from "@/components/admin/product-list"

export const dynamic = "force-dynamic"

const PAGE_SIZE = 24

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>
}) {
  const { page: pageParam, q } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const query = q?.trim() ?? ""

  const { items, total } = await getProductsAdminPage({
    offset: (page - 1) * PAGE_SIZE,
    limit: PAGE_SIZE,
    query: query || undefined,
  })

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Productos</h1>
        <Link
          href="/admin/nuevo"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium"
        >
          + Nuevo producto
        </Link>
      </div>

      <ProductList items={items} total={total} page={page} pageSize={PAGE_SIZE} query={query} />
    </div>
  )
}
