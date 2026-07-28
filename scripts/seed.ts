import { db } from "../lib/db"
import { products as productsTable } from "../lib/db/schema"
import { products as mockProducts } from "../lib/products"

async function main() {
  console.log(`Insertando ${mockProducts.length} productos...`)

  for (const p of mockProducts) {
    await db.insert(productsTable).values({
      slug: p.id,
      kind: p.kind,
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,
      age: p.kind === "toy" ? p.age : null,
      material: p.kind === "toy" ? p.material : null,
      format: p.kind === "book" ? p.format : null,
      pages: p.kind === "book" ? p.pages : null,
    }).onConflictDoNothing()
  }

  console.log("Listo. Productos cargados en Neon.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
