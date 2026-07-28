import { notFound } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"
import { getProduct, updateProduct } from "@/lib/actions/products"

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

  const updateWithId = updateProduct.bind(null, id)

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Editar producto</h1>
      <ProductForm action={updateWithId} initial={product} />
    </div>
  )
}
