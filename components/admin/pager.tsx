import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

/** Arma "?page=N&otroParam=valor" preservando los filtros activos (búsqueda, mes, etc). */
function pageHref(basePath: string, page: number, extraParams: Record<string, string>) {
  const params = new URLSearchParams(extraParams)
  if (page > 1) params.set("page", String(page))
  const qs = params.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

export function AdminPager({
  basePath,
  page,
  totalPages,
  extraParams = {},
}: {
  basePath: string
  page: number
  totalPages: number
  extraParams?: Record<string, string>
}) {
  if (totalPages <= 1) return null

  const hasPrev = page > 1
  const hasNext = page < totalPages

  return (
    <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
      {hasPrev ? (
        <Link
          href={pageHref(basePath, page - 1, extraParams)}
          className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-secondary/50"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Página anterior
        </Link>
      ) : (
        <span />
      )}

      <span className="text-sm text-muted-foreground">
        Página {page} de {totalPages}
      </span>

      {hasNext ? (
        <Link
          href={pageHref(basePath, page + 1, extraParams)}
          className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-secondary/50"
        >
          Página siguiente
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span />
      )}
    </div>
  )
}
