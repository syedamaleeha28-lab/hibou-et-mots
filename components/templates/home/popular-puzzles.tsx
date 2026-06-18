import { Play, Users } from "lucide-react"
import { popularPuzzles, type Difficulty } from "@/lib/content"
import { colorClasses } from "@/lib/colors"
import { SectionHeading } from "@/components/layout/section-heading"
import { Button } from "@/components/ui/button"

const difficultyStyle: Record<Difficulty, string> = {
  Facile: "bg-leaf/15 text-leaf",
  Moyen: "bg-sunny/30 text-sunny-foreground",
  Difficile: "bg-coral/15 text-coral",
}

export function PopularPuzzles() {
  return (
    <section id="puzzles" className="bg-card/60 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Tendances"
          title="Les puzzles les plus populaires"
          description="Les grilles préférées des enfants cette semaine. Clique sur jouer et c'est parti !"
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {popularPuzzles.map((p) => {
            const c = colorClasses[p.color]
            return (
              <article
                key={p.title}
                className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`flex items-center justify-between gap-2 px-5 py-3 ${c.solid}`}>
                  <span className="text-sm font-extrabold">{p.theme}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-card/25 px-2 py-0.5 text-xs font-bold">
                    <Users className="size-3" />
                    {p.plays}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-5">
                  <h3 className="font-heading text-xl font-extrabold leading-tight text-foreground">
                    {p.title}
                  </h3>

                  <div className="flex flex-wrap gap-1.5">
                    {p.words_preview.map((w) => (
                      <span
                        key={w}
                        className="rounded-lg bg-muted px-2 py-1 text-xs font-bold uppercase tracking-wide text-muted-foreground"
                      >
                        {w}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <span className="rounded-full bg-muted px-2.5 py-1">{p.size}</span>
                    <span className="rounded-full bg-muted px-2.5 py-1">{p.words} mots</span>
                    <span className={`rounded-full px-2.5 py-1 ${difficultyStyle[p.difficulty]}`}>
                      {p.difficulty}
                    </span>
                  </div>

                  <Button className="rounded-full bg-foreground font-extrabold text-background hover:bg-foreground/90">
                    <Play className="size-4 fill-current" />
                    Jouer
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
