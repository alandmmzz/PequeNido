import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-serif text-lg font-semibold">
                p
              </span>
              <span className="font-serif text-xl font-semibold text-foreground">Pequeñido</span>
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
              <li><Link href="/" className="hover:text-foreground">Envíos y devoluciones</Link></li>
              <li><Link href="/" className="hover:text-foreground">Preguntas frecuentes</Link></li>
              <li><Link href="/" className="hover:text-foreground">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Novedades</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Suscríbete y recibe ideas de juego y regalos para cada etapa.
            </p>
            <form className="mt-3 flex gap-2">
              <label htmlFor="footer-email" className="sr-only">Correo electrónico</label>
              <input
                id="footer-email"
                type="email"
                placeholder="tu@correo.com"
                className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 border-t border-border/70 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Pequeñido. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
