"use client"

import { useState } from "react"
import { Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ColoriageDesign, ColoriageRegion } from "@/lib/coloriage-magique/designs"
import { isDesignComplete, legendColorForNumber, type ColoriageFillState } from "@/lib/coloriage-magique/engine"

type ColoriageBoardProps = {
  design: ColoriageDesign
  className?: string
}

const UNFILLED_COLOR = "#F5EBD8"
const OUTLINE_COLOR = "#22303D"

export function ColoriageBoard({ design, className }: ColoriageBoardProps) {
  const [filled, setFilled] = useState<Set<string>>(new Set())
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)

  const complete = isDesignComplete(design, filled)

  function handleRegionClick(region: ColoriageRegion) {
    if (filled.has(region.id)) return
    if (selectedNumber === null) return
    // Deliberately forgiving, no "wrong" state — clicking a region that
    // doesn't match the selected color simply does nothing. This is for
    // a young audience (maternelle/CP is the top matching keyword); the
    // "magic" framing works better without a failure state than with
    // crossword/sudoku's stricter red-highlight pattern.
    if (region.number !== selectedNumber) return
    setFilled((prev) => new Set(prev).add(region.id))
  }

  function fillColorFor(region: ColoriageRegion): string {
    if (filled.has(region.id)) {
      return legendColorForNumber(design, region.number) ?? UNFILLED_COLOR
    }
    return UNFILLED_COLOR
  }

  function renderRegion(region: ColoriageRegion) {
    const commonProps = {
      key: region.id,
      role: "button" as const,
      tabIndex: 0,
      "aria-label": `Zone numéro ${region.number}`,
      onClick: () => handleRegionClick(region),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleRegionClick(region)
        }
      },
      fill: fillColorFor(region),
      stroke: OUTLINE_COLOR,
      strokeWidth: 2,
      className: cn(
        "transition-colors focus:outline-none focus-visible:stroke-primary focus-visible:stroke-[3px]",
        !filled.has(region.id) && selectedNumber === region.number && "cursor-pointer",
        !filled.has(region.id) && selectedNumber !== region.number && "cursor-default",
      ),
    }

    if (region.shape.kind === "circle") {
      return <circle {...commonProps} cx={region.shape.cx} cy={region.shape.cy} r={region.shape.r} />
    }
    if (region.shape.kind === "polygon") {
      return <polygon {...commonProps} points={region.shape.points} />
    }
    return <path {...commonProps} d={region.shape.d} />
  }

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div className="no-print flex flex-wrap items-center justify-center gap-2">
        {design.legend.map((entry) => (
          <button
            key={entry.number}
            type="button"
            onClick={() => setSelectedNumber(entry.number)}
            className={cn(
              "flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-sm font-extrabold transition-colors",
              selectedNumber === entry.number ? "border-primary bg-primary/10" : "border-border bg-background",
            )}
          >
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-border text-xs font-extrabold text-foreground"
              style={{ backgroundColor: entry.colorHex }}
            >
              {entry.number}
            </span>
            {entry.colorName}
          </button>
        ))}
      </div>

      <svg viewBox={design.viewBox} className="w-full max-w-xs" role="img" aria-label={`Coloriage magique : ${design.title}`}>
        {design.regions.map(renderRegion)}
      </svg>

      {complete && (
        <div className="no-print flex items-center gap-3 rounded-2xl bg-leaf/12 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf text-leaf-foreground">
            <Trophy className="size-5" />
          </span>
          <p className="font-heading font-extrabold text-foreground">Bravo ! Dessin terminé.</p>
        </div>
      )}
    </div>
  )
}
