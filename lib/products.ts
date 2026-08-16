import { Baby, Footprints, Blocks, Puzzle, type LucideIcon } from "lucide-react"

export type AgeRange = "0-12m" | "12-24m" | "2-4a" | "4a+"

export const ageRanges: { id: AgeRange; label: string; short: string }[] = [
  { id: "0-12m", label: "0 - 12 meses", short: "0-12 m" },
  { id: "12-24m", label: "12 - 24 meses", short: "12-24 m" },
  { id: "2-4a", label: "2 - 4 años", short: "2-4 años" },
  { id: "4a+", label: "+4 años", short: "+4 años" },
]

/** Un ícono por franja de edad, para usar como badge donde se muestre la edad. */
export const ageIcons: Record<AgeRange, LucideIcon> = {
  "0-12m": Baby,
  "12-24m": Footprints,
  "2-4a": Blocks,
  "4a+": Puzzle,
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU" }).format(price)
}

/**
 * Forma mínima que necesitan estas utilidades. Cualquier producto que venga
 * de la base (ProductRow de lib/db/schema) cumple esta forma, así que estas
 * funciones sirven para lo que traiga getProducts()/getProduct().
 */
type ProductLike = {
  id: string
  kind: "toy" | "book"
  ages?: string[] | null
  format?: string | null
  pages?: number | null
}

type PriceLike = {
  price: number
  promoPrice?: number | null
}

/** True si el producto tiene una promoción cargada. */
export function hasPromo(product: PriceLike): boolean {
  return product.promoPrice != null && product.promoPrice > 0
}

/** Precio a cobrar: el de promo si hay, si no el común. */
export function getEffectivePrice(product: PriceLike): number {
  return hasPromo(product) ? (product.promoPrice as number) : product.price
}

/**
 * Texto corto para mostrar como "meta" en las cards y en la ficha de producto.
 * La edad ya no va acá (se muestra aparte como badges/ícono con AgeBadgeList
 * o AgeIconCircle); esto es solo lo demás: formato/páginas de libros,
 * material de juguetes si hiciera falta más adelante.
 */
export function getProductMeta(product: ProductLike): string {
  if (product.format && product.pages) return `${product.format} · ${product.pages} pág.`
  return product.format ?? ""
}

/**
 * Productos relacionados: prioriza los de la misma edad (juguetes) o el mismo
 * formato (libros) dentro de la misma categoría, y completa con el resto de
 * la categoría si hace falta. Recibe la lista completa (`all`) porque ya no
 * hay un catálogo estático fijo del que tirar: la llama quien haya pedido los
 * productos a la base.
 */
export function getRelatedProducts<T extends ProductLike>(product: T, all: T[], limit = 4): T[] {
  const sameCategory = all.filter((p) => p.kind === product.kind)

  const closest = sameCategory.filter((p) => {
    if (p.id === product.id) return false
    const sharesAge = (p.ages ?? []).some((age) => (product.ages ?? []).includes(age))
    if (product.kind === "toy") return sharesAge
    if (product.kind === "book") return sharesAge || p.format === product.format
    return false
  })

  const rest = sameCategory.filter((p) => p.id !== product.id && !closest.includes(p))

  return [...closest, ...rest].slice(0, limit)
}
