import { ProductForm } from "@/components/admin/product-form"
import { createProduct } from "@/lib/actions/products"

export default function NuevoProductoPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Nuevo producto</h1>
      <ProductForm action={createProduct} />
    </div>
  )
}
