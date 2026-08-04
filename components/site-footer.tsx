import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-serif text-lg font-semibold">
                p
              </span>
              <span className="font-serif text-xl font-semibold text-foreground">Pequenido</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Juguetes y libros con alma, pensados para acompañar el crecimiento de los más pequeños.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Tienda</h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link href="/juguetes" className="hover:text-foreground">Juguetes</Link></li>
              <li><Link href="/libros" className="hover:text-foreground">Libros</Link></li>
              <li><Link href="/nosotros" className="hover:text-foreground">Nosotros</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Ayuda</h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link href="/envios-y-devoluciones" className="hover:text-foreground">Envíos y devoluciones</Link></li>
              <li><Link href="/" className="hover:text-foreground">Preguntas frecuentes</Link></li>
              <li><Link href="/" className="hover:text-foreground">Contacto</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border/70 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Pequenido. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
