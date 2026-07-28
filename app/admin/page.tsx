import Link from "next/link"
import Image from "next/image"
import { getProducts } from "@/lib/actions/products"
import { DeleteButton } from "@/components/admin/delete-button"

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

      <div className="space-y-2">
        {items.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 border border-border rounded-md p-3"
          >
            <Image
              src={p.image}
              alt={p.name}
              width={56}
              height={56}
              className="rounded-md object-cover"
            />
            <div className="flex-1">
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-muted-foreground">
                {p.kind === "toy" ? "Juguete" : "Libro"} · ${p.price}
              </p>
            </div>
            <Link href={`/admin/${p.id}/editar`} className="text-sm text-primary hover:underline">
              Editar
            </Link>
            <DeleteButton id={p.id} name={p.name} />
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-muted-foreground text-sm">Todavía no hay productos cargados.</p>
        )}
      </div>
    </div>
  )
}
