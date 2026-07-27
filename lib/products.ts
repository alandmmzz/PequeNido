export type AgeRange = "0-12m" | "12-24m" | "2-4a" | "4a+"

export const ageRanges: { id: AgeRange; label: string; short: string }[] = [
  { id: "0-12m", label: "0 - 12 meses", short: "0-12 m" },
  { id: "12-24m", label: "12 - 24 meses", short: "12-24 m" },
  { id: "2-4a", label: "2 - 4 años", short: "2-4 años" },
  { id: "4a+", label: "+4 años", short: "+4 años" },
]

export type Toy = {
  id: string
  name: string
  description: string
  price: number
  image: string
  age: AgeRange
  material: string
}

export type Book = {
  id: string
  name: string
  description: string
  price: number
  image: string
  format: string
  pages: number
}

export const toys: Toy[] = [
  {
    id: "sonajero-madera",
    name: "Sonajero de madera y silicona",
    description: "Ligero y fácil de agarrar, estimula el tacto y el oído desde los primeros meses.",
    price: 12.9,
    image: "/images/toy-rattle.png",
    age: "0-12m",
    material: "Madera de haya y silicona alimentaria",
  },
  {
    id: "gimnasio-actividades",
    name: "Gimnasio de actividades",
    description: "Arco de madera con colgantes de fieltro para el juego boca arriba y boca abajo.",
    price: 49.9,
    image: "/images/toy-playgym.png",
    age: "0-12m",
    material: "Madera natural y fieltro",
  },
  {
    id: "mordedor-anilla",
    name: "Mordedor anilla suave",
    description: "Alivia las molestias de la dentición con superficies de distintas texturas.",
    price: 9.9,
    image: "/images/toy-teether.png",
    age: "0-12m",
    material: "Silicona y madera",
  },
  {
    id: "apilable-anillas",
    name: "Apilable de anillas",
    description: "Clásico juego de encajar que trabaja la coordinación y el reconocimiento de tamaños.",
    price: 18.5,
    image: "/images/toy-stacker.png",
    age: "12-24m",
    material: "Madera pintada al agua",
  },
  {
    id: "bloques-construccion",
    name: "Bloques de construcción",
    description: "Piezas de madera en tonos suaves para apilar, ordenar y dar rienda suelta a la imaginación.",
    price: 29.9,
    image: "/images/toy-blocks.png",
    age: "12-24m",
    material: "Madera de haya",
  },
  {
    id: "puzzle-animales",
    name: "Puzzle de animales",
    description: "Encajables de madera con formas de animales para las primeras asociaciones.",
    price: 16.9,
    image: "/images/toy-puzzle.png",
    age: "2-4a",
    material: "Madera contrachapada",
  },
  {
    id: "cocina-juguete",
    name: "Cocinita de madera",
    description: "Set de cocina con accesorios para fomentar el juego simbólico y la autonomía.",
    price: 79.9,
    image: "/images/toy-kitchen.png",
    age: "2-4a",
    material: "Madera y algodón",
  },
  {
    id: "juego-mesa",
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
    name: "Mi primer libro de tela",
    description: "Libro sensorial blandito con solapas y texturas para descubrir con las manos.",
    price: 11.9,
    image: "/images/book-fabric.png",
    format: "Tela",
    pages: 8,
  },
  {
    id: "libro-animales",
    name: "Animales del mundo",
    description: "Libro de cartón resistente con ilustraciones sencillas de animales.",
    price: 9.9,
    image: "/images/book-animals.png",
    format: "Cartoné",
    pages: 16,
  },
  {
    id: "libro-buenas-noches",
    name: "Cuentos de buenas noches",
    description: "Historias cortas y calmadas para acompañar el momento de dormir.",
    price: 14.9,
    image: "/images/book-bedtime.png",
    format: "Tapa dura",
    pages: 32,
  },
  {
    id: "libro-texturas",
    name: "Toca y siente",
    description: "Libro de texturas para estimular el tacto y la curiosidad del bebé.",
    price: 12.5,
    image: "/images/book-textures.png",
    format: "Cartoné",
    pages: 10,
  },
  {
    id: "libro-palabras",
    name: "Mis primeras palabras",
    description: "Vocabulario ilustrado para aprender los nombres de las cosas cotidianas.",
    price: 10.9,
    image: "/images/book-words.png",
    format: "Cartoné",
    pages: 24,
  },
  {
    id: "libro-bosque",
    name: "Un paseo por el bosque",
    description: "Cuento ilustrado que invita a descubrir la naturaleza y sus habitantes.",
    price: 15.9,
    image: "/images/book-forest.png",
    format: "Tapa dura",
    pages: 40,
  },
]

export function formatPrice(price: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(price)
}
