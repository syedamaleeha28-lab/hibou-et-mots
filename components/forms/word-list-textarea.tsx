"use client"

import { cn } from "@/lib/utils"

type WordListTextareaProps = {
  id?: string
  value: string
  onChange: (value: string) => void
  wordCount: number
  gridSizeHint?: string
  rows?: number
  label?: string
  placeholder?: string
  className?: string
}

export function WordListTextarea({
  id = "words",
  value,
  onChange,
  wordCount,
  gridSizeHint,
  rows = 4,
  label = "Tes mots (séparés par une virgule)",
  placeholder = "CHAT, CHIEN, LION...",
  className,
}: WordListTextareaProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={id}
        className="font-heading text-sm font-extrabold uppercase tracking-wide text-muted-foreground"
      >
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="w-full resize-none rounded-2xl border-2 border-border bg-background px-4 py-3 font-semibold text-foreground outline-none transition-colors focus:border-primary"
        placeholder={placeholder}
      />
      <p className="text-xs font-semibold text-muted-foreground">
        {wordCount} mot{wordCount > 1 ? "s" : ""}
        {gridSizeHint ? ` · grille ${gridSizeHint}` : ""}
      </p>
    </div>
  )
}
