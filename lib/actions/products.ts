"use server"

import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { put, del } from "@vercel/blob"
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

async function uploadImageIfPresent(formData: FormData) {
  const file = formData.get("imageFile") as File | null
  if (file && file.size > 0) {
    const blob = await put(`productos/${Date.now()}-${file.name}`, file, {
      access: "public",
    })
    return blob.url
  }
  return null
}

export async function createProduct(formData: FormData) {
  const kind = formData.get("kind") as "toy" | "book"
  const name = formData.get("name") as string
  const uploadedUrl = await uploadImageIfPresent(formData)

  await db.insert(products).values({
    slug: `${slugify(name)}-${Date.now().toString(36)}`,
    kind,
    name,
    description: formData.get("description") as string,
    price: Number(formData.get("price")),
    image: uploadedUrl ?? (formData.get("imageUrl") as string),
    age: kind === "toy" ? (formData.get("age") as string) : null,
    material: kind === "toy" ? (formData.get("material") as string) : null,
    format: kind === "book" ? (formData.get("format") as string) : null,
    pages: kind === "book" ? Number(formData.get("pages")) : null,
  })

  revalidatePath("/admin")
  redirect("/admin")
}

export async function updateProduct(id: string, formData: FormData) {
  const kind = formData.get("kind") as "toy" | "book"
  const uploadedUrl = await uploadImageIfPresent(formData)

  await db
    .update(products)
    .set({
      kind,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      image: uploadedUrl ?? (formData.get("imageUrl") as string),
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

  // Si la imagen es de Vercel Blob, la borramos también para no dejar basura
  if (row?.image?.includes("blob.vercel-storage.com")) {
    await del(row.image).catch(() => {})
  }

  await db.delete(products).where(eq(products.id, id))
  revalidatePath("/admin")
}
