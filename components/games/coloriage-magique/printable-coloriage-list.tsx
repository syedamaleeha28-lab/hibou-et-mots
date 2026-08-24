"use client"

import { Printer } from "lucide-react"
import { COLORIAGE_DESIGNS } from "@/lib/coloriage-magique/designs"

const OUTLINE_COLOR = "#22303D"

export function PrintableColoriageList() {
  return (
    <div className="flex flex-col gap-10">
      <div className="no-print flex justify-end">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground hover:bg-primary/90"
        >
          <Printer className="size-4" />
          Imprimer cette page
        </button>
      </div>

      {COLORIAGE_DESIGNS.map((design) => (
        <div
          key={design.id}
          className="break-inside-avoid flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6"
        >
          <h3 className="font-heading text-lg font-extrabold text-foreground">{design.title}</h3>

          {/* Outline only — no fill — designed for black-and-white
              printing, same "économiser l'encre" convention as the
              site's other printable content. */}
          <svg viewBox={design.viewBox} className="w-full max-w-xs">
            {design.regions.map((region) => {
              const props = {
                key: region.id,
                fill: "white",
                stroke: OUTLINE_COLOR,
                strokeWidth: 2,
              }
              if (region.shape.kind === "circle") {
                return <circle {...props} cx={region.shape.cx} cy={region.shape.cy} r={region.shape.r} />
              }
              if (region.shape.kind === "polygon") {
                return <polygon {...props} points={region.shape.points} />
              }
              return <path {...props} d={region.shape.d} />
            })}
            {design.regions.map((region) => (
              <text
                key={`${region.id}-label`}
                x={region.labelX}
                y={region.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fontWeight="bold"
                fill={OUTLINE_COLOR}
              >
                {region.number}
              </text>
            ))}
          </svg>

          <ul className="flex flex-wrap justify-center gap-3 text-sm font-semibold text-muted-foreground">
            {design.legend.map((entry) => (
              <li key={entry.number}>
                {entry.number} = {entry.colorName}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
