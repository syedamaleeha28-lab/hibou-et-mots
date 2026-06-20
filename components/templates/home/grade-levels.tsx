import Link from "next/link"
import { ArrowUpRight, GraduationCap } from "lucide-react"
import { gradeSeed } from "@/prisma/seed/grades"
import { colorClasses } from "@/lib/colors"
import { gradePath } from "@/lib/seo/routes"
import { SectionHeading } from "@/components/layout/section-heading"

const GRADE_COLORS = ["coral", "sunny", "teal", "leaf", "sky", "coral", "teal"] as const

export function GradeLevels() {
  return (
    <section id="niveaux" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow="Par niveau"
        title="Un niveau pour chaque enfant"
        description="Les grilles s'adaptent à l'âge : taille, longueur des mots et directions évoluent du CP à la 6e."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {gradeSeed.map((grade, i) => {
          const color = GRADE_COLORS[i % GRADE_COLORS.length]!
          const c = colorClasses[color]
          return (
            <Link
              key={grade.slug}
              href={gradePath(grade.slug)}
              className="group relative flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${c.soft}`}>
                  <GraduationCap className="size-6" />
                </span>
                <span className="font-heading text-4xl font-extrabold text-border">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="font-heading text-xl font-extrabold text-foreground">{grade.name}</h3>
                <p className={`text-sm font-extrabold ${c.text}`}>{grade.ageRange}</p>
              </div>

              <p className="text-sm leading-snug text-muted-foreground">{grade.introText.slice(0, 100)}…</p>

              <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                <span className="text-xs font-bold text-muted-foreground">
                  Grilles {grade.defaultGridSize}×{grade.defaultGridSize}
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
