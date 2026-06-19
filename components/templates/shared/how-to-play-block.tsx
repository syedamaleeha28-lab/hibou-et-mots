import { MousePointerClick, Printer, Search } from "lucide-react"
import { SectionHeading } from "@/components/layout/section-heading"

export function HowToPlayBlock() {
  const steps = [
    {
      icon: Search,
      title: "Repère les mots",
      text: "Lis la liste des mots à trouver, puis cherche-les dans la grille.",
    },
    {
      icon: MousePointerClick,
      title: "Sélectionne les lettres",
      text: "Les mots peuvent être horizontaux, verticaux ou diagonaux, dans les deux sens.",
    },
    {
      icon: Printer,
      title: "Imprime ou joue en ligne",
      text: "Joue directement sur le site ou imprime la grille en PDF pour la classe.",
    },
  ]

  return (
    <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
      <SectionHeading
        align="left"
        eyebrow="Comment jouer"
        title="3 étapes pour réussir"
        description="Une méthode simple pour les enfants, les enseignants et toute la famille."
      />
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
