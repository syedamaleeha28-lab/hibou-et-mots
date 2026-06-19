import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"
import type { PuzzleCardData } from "@/lib/db/types/page-data"
import { DifficultyPill } from "@/components/ui/difficulty-pill"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PuzzleCardProps = {
  puzzle: PuzzleCardData
  className?: string
}

export function PuzzleCard({ puzzle, className }: PuzzleCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border/70 bg-muted/40 px-5 py-3">
        <span className="text-sm font-extrabold text-foreground">
          {puzzle.theme?.name ?? puzzle.grade?.name ?? "Mots mêlés"}
        </span>
        <DifficultyPill slug={puzzle.difficulty.slug} name={puzzle.difficulty.name} />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <h3 className="font-heading text-lg font-extrabold leading-tight text-foreground">
          <Link href={puzzle.href} className="hover:text-primary">
            {puzzle.title}
          </Link>
        </h3>

        <div className="flex flex-wrap gap-1.5 text-xs font-bold text-muted-foreground">
          <span className="rounded-full bg-muted px-2.5 py-1">
            {puzzle.size}×{puzzle.size}
          </span>
          <span className="rounded-full bg-muted px-2.5 py-1">
            {puzzle.wordCount} mots
          </span>
          {puzzle.grade && (
            <span className="rounded-full bg-muted px-2.5 py-1">{puzzle.grade.name}</span>
          )}
        </div>

        <Button
          nativeButton={false}
          className="mt-auto rounded-full bg-foreground font-extrabold text-background hover:bg-foreground/90"
          render={<Link href={puzzle.href} />}
        >
          <Play className="size-4 fill-current" />
          Jouer
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </article>
  )
}
