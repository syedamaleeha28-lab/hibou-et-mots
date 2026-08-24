"use client"

import { useState } from "react"
import Link from "next/link"
import { getDayIndex, getDesignForDay } from "@/lib/coloriage-magique/engine"
import { COLORIAGE_DESIGNS } from "@/lib/coloriage-magique/designs"
import { ColoriageBoard } from "./coloriage-board"

export function ColoriageGame() {
  const [dayIndex] = useState(() => getDayIndex())
  const design = getDesignForDay(dayIndex, COLORIAGE_DESIGNS)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm font-extrabold text-foreground">
          {design.title}
        </span>
      </div>
      <p className="text-sm font-semibold text-muted-foreground">
        Clique sur un numéro dans la légende, puis clique sur la zone du dessin qui porte ce numéro.
      </p>
      <ColoriageBoard design={design} />
      <p className="no-print text-sm font-semibold text-muted-foreground">
        Un nouveau dessin chaque jour. Tu préfères imprimer plusieurs coloriages d&apos;un coup ?{" "}
        <Link href="/coloriage-magique-a-imprimer/" className="text-primary underline">
          Voir les coloriages magiques à imprimer
        </Link>
        .
      </p>
    </div>
  )
}
