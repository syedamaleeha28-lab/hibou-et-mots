"use client"

import { cn } from "@/lib/utils"

type DiagonalToggleProps = {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
  description?: string
  className?: string
}

export function DiagonalToggle({
  checked,
  onCheckedChange,
  label = "Mots en diagonale",
  description = "Autorise les mots en diagonale dans la grille",
  className,
}: DiagonalToggleProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-muted px-4 py-3",
        className,
      )}
    >
      <span className="flex flex-col gap-0.5">
        <span className="font-bold text-foreground">{label}</span>
        {description && (
          <span className="text-xs font-semibold text-muted-foreground">{description}</span>
        )}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-border",
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full bg-card transition-all",
            checked ? "left-6" : "left-1",
          )}
        />
      </button>
    </label>
  )
}
