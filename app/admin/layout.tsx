import type { ReactNode } from "react"
import { AdminTabs } from "@/components/admin/admin-tabs"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <AdminTabs />
      {children}
    </div>
  )
}
