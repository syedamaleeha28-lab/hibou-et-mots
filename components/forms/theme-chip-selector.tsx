"use client"

import { cn } from "@/lib/utils"
import type { ThemePreset } from "@/lib/tools/presets"

type ThemeChipSelectorProps = {
  presets: ThemePreset[]
  selectedId: string | null
  onSelect: (preset: ThemePreset) => void
  label?: string
  className?: string
}

export function ThemeChipSelector({
  presets,
  selectedId,
  onSelect,
  label = "Thèmes rapides",
  className,
}: ThemeChipSelectorProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="font-heading text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap gap-2" role="listbox" aria-label={label}>
        {presets.map((preset) => {
          const active = selectedId === preset.id
          return (
            <button
              key={preset.id}
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => onSelect(preset)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-extrabold transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-secondary/20",
              )}
            >
              {preset.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
