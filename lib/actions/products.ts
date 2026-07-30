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

// Sube todas las imágenes adicionales elegidas en el input "múltiple" del form.
async function uploadAdditionalImages(formData: FormData) {
  const files = formData.getAll("additionalImageFiles") as File[]
  const urls: string[] = []
  for (const file of files) {
    if (file && file.size > 0) {
      const blob = await put(`productos/galeria/${Date.now()}-${file.name}`, file, {
        access: "public",
      })
      urls.push(blob.url)
    }
  }
  return urls
}

// Sube el video del producto, si se eligió alguno.
async function uploadVideoIfPresent(formData: FormData) {
  const file = formData.get("videoFile") as File | null
  if (file && file.size > 0) {
    const blob = await put(`productos/videos/${Date.now()}-${file.name}`, file, {
      access: "public",
    })
    return blob.url
  }
  return null
}

// Combina las imágenes adicionales que el usuario dejó (no borró) con las nuevas que subió.
function resolveAdditionalImages(formData: FormData, newlyUploaded: string[]) {
  const kept = formData.getAll("keepAdditionalImages").map(String).filter(Boolean)
  return [...kept, ...newlyUploaded]
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
  const uploadedUrl = await uploadImageIfPresent(formData)
  const newAdditionalImages = await uploadAdditionalImages(formData)
  const additionalImages = resolveAdditionalImages(formData, newAdditionalImages)
  const uploadedVideo = await uploadVideoIfPresent(formData)

  await db.insert(products).values({
    slug: `${slugify(name)}-${Date.now().toString(36)}`,
    kind,
    name,
    description: formData.get("description") as string,
    price: Number(formData.get("price")),
    image: uploadedUrl ?? (formData.get("imageUrl") as string),
    additionalImages: additionalImages.length > 0 ? additionalImages : null,
    video: uploadedVideo,
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
  const uploadedUrl = await uploadImageIfPresent(formData)
  const newAdditionalImages = await uploadAdditionalImages(formData)
  const additionalImages = resolveAdditionalImages(formData, newAdditionalImages)

  const removeVideo = formData.get("removeVideo") === "true"
  const uploadedVideo = await uploadVideoIfPresent(formData)
  const video = removeVideo
    ? null
    : uploadedVideo ?? ((formData.get("existingVideoUrl") as string) || null)

  // Limpiar en Blob lo que quedó afuera: imagen principal reemplazada,
  // imágenes de galería que el usuario borró, y el video si se reemplazó o se quitó.
  const removedAdditionalImages = (existing?.additionalImages ?? []).filter(
    (url) => !additionalImages.includes(url),
  )
  await cleanupRemovedBlobs([
    uploadedUrl && existing?.image !== uploadedUrl ? existing?.image : null,
    ...removedAdditionalImages,
    existing?.video && existing.video !== video ? existing.video : null,
  ])

  await db
    .update(products)
    .set({
      kind,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      image: uploadedUrl ?? (formData.get("imageUrl") as string),
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
