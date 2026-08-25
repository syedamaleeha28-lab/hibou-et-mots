import type { LucideIcon } from "lucide-react"
import { MousePointerClick, Printer, Search } from "lucide-react"
import { SectionHeading } from "@/components/layout/section-heading"
import { HOW_TO_PLAY_SYNONYM_DESCRIPTION } from "@/lib/content/synonym-phrases"

export type HowToPlayStep = {
  icon: LucideIcon
  title: string
  text: string
}

type HowToPlayBlockProps = {
  eyebrow?: string
  title?: string
  description?: string
  steps?: HowToPlayStep[]
}

// Generalized to accept overrides — was hardcoded to mots-mêlés content
// with a single call site (CategoryTemplate). All props are optional
// and default to the EXACT original content, so that existing call site
// is completely unaffected. Other puzzle formats (mots coupés, sudoku,
// coloriage magique) now pass their own steps/copy instead of forking
// this component.
const DEFAULT_STEPS: HowToPlayStep[] = [
  {
    icon: Search,
    title: "Repère les mots",
    text: "Lis la liste des mots à trouver, puis cherche-les dans la grille.",
  },
  {
    icon: MousePointerClick,
    title: "Sélectionne les lettres",
    text: "Chaque mot caché peut être horizontal, vertical ou diagonal — une grille de lettres classique.",
  },
  {
    icon: Printer,
    title: "Imprime ou joue en ligne",
    text: "Joue directement sur le site ou imprime la grille en PDF pour la classe.",
  },
]

export function HowToPlayBlock({
  eyebrow = "Comment jouer",
  title = "3 étapes pour réussir",
  description = HOW_TO_PLAY_SYNONYM_DESCRIPTION,
  steps = DEFAULT_STEPS,
}: HowToPlayBlockProps) {
  return (
    <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
      <SectionHeading align="left" eyebrow={eyebrow} title={title} description={description} />
      <ol className="mt-8 grid gap-4 sm:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <li
              key={step.title}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 font-heading text-lg font-extrabold text-primary">
                {index + 1}
              </span>
              <Icon className="size-5 text-secondary" aria-hidden />
              <h3 className="font-heading text-lg font-extrabold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
