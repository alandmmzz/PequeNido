"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ImageOff, Play } from "lucide-react"
import { cn } from "@/lib/utils"

type GalleryItem =
  | { type: "video"; url: string }
  | { type: "image"; url: string }

type ProductGalleryProps = {
  productName: string
  image: string
  additionalImages?: string[] | null
  video?: string | null
}

/**
 * Galería de la ficha de producto. Si el producto tiene video, se muestra
 * primero (antes que cualquier imagen). Las miniaturas de esta galería son
 * independientes de la miniatura del catálogo, que siempre usa `image`.
 */
export function ProductGallery({ productName, image, additionalImages, video }: ProductGalleryProps) {
  const items: GalleryItem[] = [
    ...(video ? [{ type: "video", url: video } as const] : []),
    { type: "image", url: image },
    ...(additionalImages ?? []).map((url) => ({ type: "image", url } as const)),
  ]

  const [selected, setSelected] = useState(0)
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set())
  const videoRef = useRef<HTMLVideoElement>(null)
  const current = items[selected]

  function markFailed(url: string) {
    setFailedUrls((prev) => new Set(prev).add(url))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-border/70 bg-secondary/50">
        {current.type === "video" ? (
          <video
            ref={videoRef}
            src={current.url}
            controls
            playsInline
            className="h-full w-full object-contain bg-foreground"
          />
        ) : current.type === "image" && failedUrls.has(current.url) ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="size-8" aria-hidden="true" />
            <span className="text-sm">Imagen no disponible</span>
          </div>
        ) : (
          <Image
            src={current.url || "/placeholder.svg"}
            alt={productName}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            onError={() => markFailed(current.url)}
          />
        )}
      </div>

      {items.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {items.map((item, i) => (
            <button
              key={`${item.type}-${item.url}-${i}`}
              type="button"
              onClick={() => setSelected(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-xl border-2 bg-secondary/50",
                i === selected ? "border-primary" : "border-transparent",
              )}
              aria-label={item.type === "video" ? "Ver video del producto" : "Ver imagen del producto"}
            >
              {item.type === "video" ? (
                <>
                  <video src={item.url} className="h-full w-full object-cover" muted />
                  <span className="absolute inset-0 flex items-center justify-center bg-foreground/30">
                    <Play className="size-5 fill-background text-background" aria-hidden="true" />
                  </span>
                </>
              ) : failedUrls.has(item.url) ? (
                <span className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <ImageOff className="size-4" aria-hidden="true" />
                </span>
              ) : (
                <Image
                  src={item.url || "/placeholder.svg"}
                  alt=""
                  fill
                  className="object-cover"
                  onError={() => markFailed(item.url)}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
