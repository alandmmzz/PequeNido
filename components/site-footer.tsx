import Link from "next/link"
import { Mail, MessageCircle } from "lucide-react"
import { CONTACT_EMAIL, WHATSAPP_DEFAULT_MESSAGE, WHATSAPP_NUMBER } from "@/lib/contact-info"

const INSTAGRAM_URL = "https://instagram.com/pequenido.uy"

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37a4 4 0 1 1-7.914 1.174 4 4 0 0 1 7.914-1.174z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

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
            <div className="mt-4 flex items-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Seguinos en Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
              >
                <InstagramIcon />
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Escribinos por WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                aria-label="Escribinos por mail"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
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
