"use client"

import { cn } from "@/lib/utils"
import { GRID_SIZE_OPTIONS, type GridSizeOption } from "@/lib/tools/presets"

type SizeSegmentedControlProps = {
  value: GridSizeOption
  onChange: (size: GridSizeOption) => void
  options?: readonly GridSizeOption[]
  label?: string
  className?: string
}

export function SizeSegmentedControl({
  value,
  onChange,
  options = GRID_SIZE_OPTIONS,
  label = "Taille de la grille",
  className,
}: SizeSegmentedControlProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="font-heading text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="flex gap-2" role="group" aria-label={label}>
        {options.map((size) => {
          const active = value === size
          return (
            <button
              key={size}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(size)}
              className={cn(
                "flex-1 rounded-2xl border-2 px-3 py-2.5 text-sm font-extrabold transition-colors",
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-foreground hover:border-primary/40",
              )}
            >
              {size}×{size}
            </button>
          )
        })}
      </div>
    </div>
  )
}
