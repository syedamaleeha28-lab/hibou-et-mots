import { Download, FileText, Printer, School } from "lucide-react"
import { pdfPacks } from "@/lib/content"
import { colorClasses } from "@/lib/colors"
import { Button } from "@/components/ui/button"

const perks = [
  { icon: Printer, label: "Prêt à imprimer en A4" },
  { icon: School, label: "Idéal pour la classe" },
  { icon: FileText, label: "Corrigés inclus" },
]

export function PrintablePdfs() {
  return (
    <section id="pdf" className="bg-card/60 py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div className="flex flex-col gap-5">
          <span className="inline-flex w-fit items-center rounded-full bg-secondary/15 px-3 py-1 text-sm font-extrabold uppercase tracking-wide text-secondary">
            À imprimer
          </span>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
            Des PDF gratuits pour la maison et l&apos;école
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
            Parents et enseignants peuvent télécharger des cahiers complets de
            mots mêlés, prêts à imprimer, avec les solutions sur la dernière
            page.
          </p>

          <ul className="flex flex-col gap-3">
            {perks.map((perk) => (
              <li key={perk.label} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf/15 text-leaf">
                  <perk.icon className="size-5" />
                </span>
                <span className="font-bold text-foreground">{perk.label}</span>
              </li>
            ))}
          </ul>

          <Button
            size="lg"
            className="mt-2 w-fit rounded-full bg-primary font-extrabold text-primary-foreground hover:bg-primary/90"
          >
            <Download className="size-5" />
            Voir tous les PDF
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {pdfPacks.map((pack) => {
            const c = colorClasses[pack.color]
            return (
              <div
                key={pack.title}
                className="group flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`flex aspect-[4/3] items-center justify-center rounded-2xl ${c.soft}`}
                >
                  <FileText className="size-12" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-heading text-base font-extrabold leading-tight text-foreground">
                    {pack.title}
                  </h3>
                  <p className="text-xs font-bold text-muted-foreground">
                    {pack.pages} pages · {pack.level}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full border-2 font-extrabold hover:bg-muted"
                >
                  <Download className="size-4" />
                  Télécharger
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
