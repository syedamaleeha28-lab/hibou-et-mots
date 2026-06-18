import { ArrowUpRight, GraduationCap } from "lucide-react"
import { grades } from "@/lib/content"
import { colorClasses } from "@/lib/colors"
import { SectionHeading } from "@/components/layout/section-heading"

export function GradeLevels() {
  return (
    <section id="niveaux" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow="Par âge"
        title="Un niveau pour chaque enfant"
        description="Les grilles s'adaptent à l'âge : taille, longueur des mots et directions évoluent avec les progrès de l'enfant."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {grades.map((g, i) => {
          const c = colorClasses[g.color]
          return (
            <a
              key={g.level}
              href="#puzzles"
              className="group relative flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${c.soft}`}>
                  <GraduationCap className="size-6" />
                </span>
                <span className="font-heading text-4xl font-extrabold text-border">
                  0{i + 1}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="font-heading text-xl font-extrabold text-foreground">
                  {g.level}
                </h3>
                <p className={`text-sm font-extrabold ${c.text}`}>{g.age}</p>
              </div>

              <p className="text-sm leading-snug text-muted-foreground">
                {g.description}
              </p>

              <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                <span className="text-xs font-bold text-muted-foreground">
                  Grilles {g.gridSize}
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
