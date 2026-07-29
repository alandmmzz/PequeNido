export type AgeRange = "0-12m" | "12-24m" | "2-4a" | "4a+"

export const ageRanges: { id: AgeRange; label: string; short: string }[] = [
  { id: "0-12m", label: "0 - 12 meses", short: "0-12 m" },
  { id: "12-24m", label: "12 - 24 meses", short: "12-24 m" },
  { id: "2-4a", label: "2 - 4 años", short: "2-4 años" },
  { id: "4a+", label: "+4 años", short: "+4 años" },
]

export type Toy = {
  id: string
  kind: "toy"
  name: string
  description: string
  price: number
  image: string
  age: AgeRange
  material: string
}

export type Book = {
  id: string
  kind: "book"
  name: string
  description: string
  price: number
  image: string
  format: string
  pages: number
}

export type Product = Toy | Book

export const toys: Toy[] = [
  {
    id: "sonajero-madera",
    kind: "toy",
    name: "Sonajero de madera y silicona",
    description: "Ligero y fácil de agarrar, estimula el tacto y el oído desde los primeros meses.",
    price: 12.9,
    image: "/images/toy-rattle.png",
    age: "0-12m",
    material: "Madera de haya y silicona alimentaria",
  },
  {
    id: "gimnasio-actividades",
    kind: "toy",
    name: "Gimnasio de actividades",
    description: "Arco de madera con colgantes de fieltro para el juego boca arriba y boca abajo.",
    price: 49.9,
    image: "/images/toy-playgym.png",
    age: "0-12m",
    material: "Madera natural y fieltro",
  },
  {
    id: "mordedor-anilla",
    kind: "toy",
    name: "Mordedor anilla suave",
    description: "Alivia las molestias de la dentición con superficies de distintas texturas.",
    price: 9.9,
    image: "/images/toy-teether.png",
    age: "0-12m",
    material: "Silicona y madera",
  },
  {
    id: "apilable-anillas",
    kind: "toy",
    name: "Apilable de anillas",
    description: "Clásico juego de encajar que trabaja la coordinación y el reconocimiento de tamaños.",
    price: 18.5,
    image: "/images/toy-stacker.png",
    age: "12-24m",
    material: "Madera pintada al agua",
  },
  {
    id: "bloques-construccion",
    kind: "toy",
    name: "Bloques de construcción",
    description: "Piezas de madera en tonos suaves para apilar, ordenar y dar rienda suelta a la imaginación.",
    price: 29.9,
    image: "/images/toy-blocks.png",
    age: "12-24m",
    material: "Madera de haya",
  },
  {
    id: "puzzle-animales",
    kind: "toy",
    name: "Puzzle de animales",
    description: "Encajables de madera con formas de animales para las primeras asociaciones.",
    price: 16.9,
    image: "/images/toy-puzzle.png",
    age: "2-4a",
    material: "Madera contrachapada",
  },
  {
    id: "cocina-juguete",
    kind: "toy",
    name: "Cocinita de madera",
    description: "Set de cocina con accesorios para fomentar el juego simbólico y la autonomía.",
    price: 79.9,
    image: "/images/toy-kitchen.png",
    age: "2-4a",
    material: "Madera y algodón",
  },
  {
    id: "juego-mesa",
    kind: "toy",
    name: "Juego de mesa infantil",
    description: "Primer juego de reglas sencillas para compartir en familia y aprender a esperar el turno.",
    price: 24.9,
    image: "/images/toy-boardgame.png",
    age: "4a+",
    material: "Cartón reciclado y madera",
  },
]

export const books: Book[] = [
  {
    id: "libro-tela",
    kind: "book",
    name: "Mi primer libro de tela",
    description: "Libro sensorial blandito con solapas y texturas para descubrir con las manos.",
    price: 11.9,
    image: "/images/book-fabric.png",
    format: "Tela",
    pages: 8,
  },
  {
    id: "libro-animales",
    kind: "book",
    name: "Animales del mundo",
    description: "Libro de cartón resistente con ilustraciones sencillas de animales.",
    price: 9.9,
    image: "/images/book-animals.png",
    format: "Cartoné",
    pages: 16,
  },
  {
    id: "libro-buenas-noches",
    kind: "book",
    name: "Cuentos de buenas noches",
    description: "Historias cortas y calmadas para acompañar el momento de dormir.",
    price: 14.9,
    image: "/images/book-bedtime.png",
    format: "Tapa dura",
    pages: 32,
  },
  {
    id: "libro-texturas",
    kind: "book",
    name: "Toca y siente",
    description: "Libro de texturas para estimular el tacto y la curiosidad del bebé.",
    price: 12.5,
    image: "/images/book-textures.png",
    format: "Cartoné",
    pages: 10,
  },
  {
    id: "libro-palabras",
    kind: "book",
    name: "Mis primeras palabras",
    description: "Vocabulario ilustrado para aprender los nombres de las cosas cotidianas.",
    price: 10.9,
    image: "/images/book-words.png",
    format: "Cartoné",
    pages: 24,
  },
  {
    id: "libro-bosque",
    kind: "book",
    name: "Un paseo por el bosque",
    description: "Cuento ilustrado que invita a descubrir la naturaleza y sus habitantes.",
    price: 15.9,
    image: "/images/book-forest.png",
    format: "Tapa dura",
    pages: 40,
  },
]

export function formatPrice(price: number) {
  return new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU" }).format(price)
}

/** Todos los productos (juguetes + libros) en un solo listado. */
export const products: Product[] = [...toys, ...books]

/** Devuelve el producto (juguete o libro) que corresponde a un id, o undefined si no existe. */
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

/** Texto corto para mostrar como "meta" en las cards y en la ficha de producto. */
export function getProductMeta(product: Product): string {
  if (product.kind === "toy") {
    const range = ageRanges.find((r) => r.id === product.age)
    return range?.label ?? range?.short ?? ""
  }
  return `${product.format} · ${product.pages} pág.`
}

/**
 * Productos relacionados: prioriza los de la misma edad (juguetes) o el mismo
 * formato (libros) dentro de la misma categoría, y completa con el resto de la
 * categoría si hace falta.
 */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = product.kind === "toy" ? toys : books

  const closest = sameCategory.filter((p) => {
    if (p.id === product.id) return false
    if (product.kind === "toy" && p.kind === "toy") return p.age === product.age
    if (product.kind === "book" && p.kind === "book") return p.format === product.format
    return false
  })

  const rest = sameCategory.filter((p) => p.id !== product.id && !closest.includes(p))

  return [...closest, ...rest].slice(0, limit)
}
