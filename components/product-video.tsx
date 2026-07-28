"use client"

import { useCallback, useRef, useState } from "react"
import { Film, Pause, Play, Sparkles, Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

type ProductVideoProps = {
  productName: string
}

/**
 * Espacio vistoso para presentar (y, mientras no haya backend, subir de forma
 * local) el video de un producto. Pensado para que el equipo de la tienda
 * pueda ver cómo quedaría el video en la ficha antes de conectarlo a un
 * servicio de almacenamiento real.
 */
export function ProductVideo({ productName }: ProductVideoProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const loadFile = useCallback((file: File | undefined) => {
    if (!file || !file.type.startsWith("video/")) return
    setVideoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
    setFileName(file.name)
    setIsPlaying(false)
  }, [])

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    loadFile(e.dataTransfer.files?.[0])
  }

  function togglePlay() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  function removeVideo() {
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    setVideoUrl(null)
    setFileName(null)
    setIsPlaying(false)
    if (inputRef.current) inputRef.current.value = ""
  }

  if (videoUrl) {
    return (
      <div className="overflow-hidden rounded-3xl border border-border/70 bg-foreground shadow-sm">
        <div className="relative aspect-video">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            playsInline
            className="h-full w-full object-contain"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </div>
        <div className="flex items-center justify-between gap-3 bg-card px-4 py-3">
          <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
            <Film className="size-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate">{fileName}</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              {isPlaying ? <Pause className="size-3.5" aria-hidden="true" /> : <Play className="size-3.5" aria-hidden="true" />}
              {isPlaying ? "Pausar" : "Reproducir"}
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cambiar
            </button>
            <button
              type="button"
              onClick={removeVideo}
              className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label="Quitar video"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => loadFile(e.target.files?.[0])}
        />
      </div>
    )
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "relative flex aspect-video flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl border-2 border-dashed bg-gradient-to-br from-accent/40 via-secondary/40 to-background px-6 text-center transition-colors",
        isDragging ? "border-primary bg-accent/60" : "border-border/70",
      )}
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
        <Upload className="size-6" aria-hidden="true" />
      </span>
      <div>
        <p className="font-serif text-lg font-semibold text-foreground text-balance">
          Sube el video de {productName}
        </p>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground text-pretty">
          Arrastra el archivo aquí o hacé clic para elegirlo. Ideal un video corto mostrando el
          producto en uso.
        </p>
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-1 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Sparkles className="size-4" aria-hidden="true" />
        Elegir video
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => loadFile(e.target.files?.[0])}
      />
    </div>
  )
}
