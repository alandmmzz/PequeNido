import { ageRanges, ageIcons, type AgeRange } from "@/lib/products"

/** Chip con ícono + texto. Para usar donde ya se explica qué es (ficha técnica, admin, etc). */
export function AgeBadge({ ageId }: { ageId: string }) {
  const range = ageRanges.find((r) => r.id === ageId)
  const Icon = ageIcons[ageId as AgeRange]
  if (!range || !Icon) return null

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
      <Icon className="size-3.5" aria-hidden="true" />
      {range.short}
    </span>
  )
}

/** Lista de chips, una por cada edad del producto. */
export function AgeBadgeList({ ageIds }: { ageIds: string[] }) {
  if (ageIds.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {ageIds.map((id) => (
        <AgeBadge key={id} ageId={id} />
      ))}
    </div>
  )
}

/** Solo el ícono en un círculo, sin texto. Para las cards de producto, donde el espacio es chico. */
export function AgeIconCircle({ ageId }: { ageId: string }) {
  const range = ageRanges.find((r) => r.id === ageId)
  const Icon = ageIcons[ageId as AgeRange]
  if (!range || !Icon) return null

  return (
    <span
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm"
      title={range.label}
    >
      <Icon className="size-4" aria-hidden="true" />
    </span>
  )
}
