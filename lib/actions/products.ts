"use server"

import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { del } from "@vercel/blob"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getProducts() {
  return db.select().from(products).orderBy(products.createdAt)
}

export async function getProduct(id: string) {
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

  await db.insert(products).values({
    slug: `${slugify(name)}-${Date.now().toString(36)}`,
    kind,
    name,
    description: formData.get("description") as string,
    price: Number(formData.get("price")),
    image: formData.get("imageUrl") as string,
    additionalImages: additionalImages.length > 0 ? additionalImages : null,
    video,
    age: kind === "toy" ? (formData.get("age") as string) : null,
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
      image,
      additionalImages: additionalImages.length > 0 ? additionalImages : null,
      video,
      age: kind === "toy" ? (formData.get("age") as string) : null,
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
