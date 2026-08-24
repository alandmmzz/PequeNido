"use server"

import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { and, desc, eq, sql } from "drizzle-orm"
import { del } from "@vercel/blob"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getProducts() {
  return db.select().from(products).orderBy(products.createdAt)
}

/**
 * Versión paginada, para el catálogo público (Juguetes/Libros) con el botón
 * "Cargar más". Filtra en la propia consulta a Neon (kind + edad opcional),
 * no trae todo el catálogo de una — así el tamaño de página real limita
 * cuánto se descarga, no solo cuánto se pinta en pantalla.
 */
export async function getProductsPage({
  kind,
  age,
  offset,
  limit,
}: {
  kind: "toy" | "book"
  age?: string
  offset: number
  limit: number
}) {
  const conditions = [eq(products.kind, kind)]
  if (age) {
    // "ages" es un array de Postgres; esto chequea que el valor esté contenido.
    conditions.push(sql`${products.ages} @> ARRAY[${age}]::text[]`)
  }

  const where = and(...conditions)

  const [items, [{ count }]] = await Promise.all([
    db
      .select()
      .from(products)
      .where(where)
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(products).where(where),
  ])

  return { items, hasMore: offset + items.length < count, total: count }
}

/**
 * Versión paginada para la lista de productos del admin, con "Página
 * siguiente/anterior" y búsqueda por nombre (server-side, así busca en
 * todo el catálogo y no solo en la página cargada).
 */
export async function getProductsAdminPage({
  offset,
  limit,
  query,
}: {
  offset: number
  limit: number
  query?: string
}) {
  const where = query ? sql`${products.name} ILIKE ${"%" + query + "%"}` : undefined

  const [items, [{ count }]] = await Promise.all([
    db
      .select()
      .from(products)
      .where(where)
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(products).where(where),
  ])

  return { items, total: count }
}
  const [row] = await db.select().from(products).where(eq(products.id, id))
  return row
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // saca acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

// Borra de Vercel Blob las imágenes/video que ya no se usan (reemplazados o quitados).
async function cleanupRemovedBlobs(removed: (string | null | undefined)[]) {
  for (const url of removed) {
    if (url && url.includes("blob.vercel-storage.com")) {
      await del(url).catch(() => {})
    }
  }
}

export async function createProduct(formData: FormData) {
  const kind = formData.get("kind") as "toy" | "book"
  const name = formData.get("name") as string
  const additionalImages = formData.getAll("additionalImages").map(String).filter(Boolean)
  const video = (formData.get("videoUrl") as string) || null
  const promoPriceRaw = (formData.get("promoPrice") as string) || ""

  await db.insert(products).values({
    slug: `${slugify(name)}-${Date.now().toString(36)}`,
    kind,
    name,
    description: formData.get("description") as string,
    price: Number(formData.get("price")),
    promoPrice: promoPriceRaw ? Number(promoPriceRaw) : null,
    image: formData.get("imageUrl") as string,
    additionalImages: additionalImages.length > 0 ? additionalImages : null,
    video,
    ages: (() => {
      const selected = formData.getAll("ages").map(String).filter(Boolean)
      return selected.length > 0 ? selected : null
    })(),
    material: kind === "toy" ? (formData.get("material") as string) : null,
    format: kind === "book" ? (formData.get("format") as string) : null,
    pages: kind === "book" ? Number(formData.get("pages")) : null,
  })

  revalidatePath("/admin")
  redirect("/admin")
}

export async function updateProduct(id: string, formData: FormData) {
  const [existing] = await db.select().from(products).where(eq(products.id, id))

  const kind = formData.get("kind") as "toy" | "book"
  const image = formData.get("imageUrl") as string
  const additionalImages = formData.getAll("additionalImages").map(String).filter(Boolean)
  const video = (formData.get("videoUrl") as string) || null
  const promoPriceRaw = (formData.get("promoPrice") as string) || ""

  // Limpiar en Blob lo que quedó afuera: imagen principal reemplazada,
  // imágenes de galería que el usuario borró, y el video si se reemplazó o se quitó.
  const removedAdditionalImages = (existing?.additionalImages ?? []).filter(
    (url) => !additionalImages.includes(url),
  )
  await cleanupRemovedBlobs([
    existing?.image !== image ? existing?.image : null,
    ...removedAdditionalImages,
    existing?.video !== video ? existing?.video : null,
  ])

  await db
    .update(products)
    .set({
      kind,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      promoPrice: promoPriceRaw ? Number(promoPriceRaw) : null,
      image,
      additionalImages: additionalImages.length > 0 ? additionalImages : null,
      video,
      ages: (() => {
        const selected = formData.getAll("ages").map(String).filter(Boolean)
        return selected.length > 0 ? selected : null
      })(),
      material: kind === "toy" ? (formData.get("material") as string) : null,
      format: kind === "book" ? (formData.get("format") as string) : null,
      pages: kind === "book" ? Number(formData.get("pages")) : null,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id))

  revalidatePath("/admin")
  redirect("/admin")
}

export async function deleteProduct(id: string) {
  const [row] = await db.select().from(products).where(eq(products.id, id))

  // Borramos de Vercel Blob todo lo asociado al producto para no dejar basura
  await cleanupRemovedBlobs([row?.image, row?.video, ...(row?.additionalImages ?? [])])

  await db.delete(products).where(eq(products.id, id))
  revalidatePath("/admin")
}
