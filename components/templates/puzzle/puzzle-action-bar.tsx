"use client"

import Link from "next/link"
import { Download, Eye, Printer, Sparkles } from "lucide-react"
import { useState } from "react"
import type { PuzzlePageData } from "@/lib/db/types/page-data"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/seo"
import { categoryBackLinkLabel } from "@/lib/seo/linking"

type PuzzleActionBarProps = {
  puzzle: Pick<
    PuzzlePageData,
    "id" | "pdfUrl" | "theme" | "parentCategories" | "canonicalPath"
  >
  onRevealSolution?: () => void
}

export function PuzzleActionBar({ puzzle, onRevealSolution }: PuzzleActionBarProps) {
  const [solutionVisible, setSolutionVisible] = useState(false)
  const primaryCategory = puzzle.parentCategories[0]
  const backLabel = categoryBackLinkLabel(
    primaryCategory?.type ?? "THEME",
    puzzle.theme?.name,
  )
  const downloadHref = puzzle.pdfUrl ?? `/api/pdf/${puzzle.id}/`

  function handleReveal() {
    setSolutionVisible(true)
    onRevealSolution?.()
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          className="rounded-full font-extrabold"
          onClick={() => window.print()}
        >
          <Printer className="size-4" />
          Imprimer
        </Button>

        <Button
          nativeButton={false}
          variant="outline"
          className="rounded-full font-extrabold"
          render={<a href={downloadHref} download={Boolean(puzzle.pdfUrl)} />}
        >
          <Download className="size-4" />
          Télécharger le PDF
        </Button>

        <Button
          type="button"
          variant="outline"
          className="rounded-full font-extrabold"
          onClick={handleReveal}
          aria-pressed={solutionVisible}
        >
          <Eye className="size-4" />
          {solutionVisible ? "Solution affichée" : "Voir la solution"}
        </Button>

        <Button
          nativeButton={false}
          className="rounded-full bg-primary font-extrabold text-primary-foreground hover:bg-primary/90"
          render={<Link href={ROUTES.jouer} />}
        >
          <Sparkles className="size-4" />
          Jouer en ligne
        </Button>
      </div>

      {primaryCategory && (
        <Link
          href={primaryCategory.href}
          className="text-sm font-extrabold text-primary hover:underline"
        >
          ← {backLabel}
        </Link>
      )}
    </div>
  )
}
