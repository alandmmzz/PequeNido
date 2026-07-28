import Link from "next/link"
import { getProducts } from "@/lib/actions/products"
import { ProductList } from "@/components/admin/product-list"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const items = await getProducts()

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

      <ProductList items={items} />
    </div>
  )
}
