"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const tabs = [
  { href: "/admin", label: "Productos" },
  { href: "/admin/pedidos", label: "Pedidos" },
]

export function AdminTabs() {
  const pathname = usePathname()

  return (
    <div className="border-b border-border/70">
      <nav className="mx-auto flex max-w-4xl gap-1 px-4 pt-6" aria-label="Panel de administración">
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
