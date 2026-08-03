"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ArrowLeft, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { logout } from "@/lib/actions/auth"

const tabs = [
  { href: "/admin", label: "Productos" },
  { href: "/admin/pedidos", label: "Pedidos" },
]

export function AdminTabs() {
  const pathname = usePathname()
  const router = useRouter()

  // La pantalla de login no lleva las pestañas del panel.
  if (pathname === "/admin/login") return null

  return (
    <div className="border-b border-border/70">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Ver tienda
        </Link>
        <button
          type="button"
          onClick={async () => {
            await logout()
            router.push("/admin/login")
            router.refresh()
          }}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Salir
        </button>
      </div>
      <nav className="mx-auto flex max-w-4xl gap-1 px-4 pt-2" aria-label="Panel de administración">
        {tabs.map((tab) => {
          // "/admin/nuevo" y "/admin/[id]/editar" también cuentan como la pestaña "Productos".
          const active = tab.href === "/admin" ? !pathname.startsWith("/admin/pedidos") : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "-mb-px rounded-t-md border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
