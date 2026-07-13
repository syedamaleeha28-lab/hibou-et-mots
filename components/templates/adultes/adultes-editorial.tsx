import Link from "next/link"
import { SectionHeading } from "@/components/layout/section-heading"
import { ADULTES_HUB_LINKS, ADULTES_SECTIONS } from "@/lib/content/adultes"
import { ROUTES, difficultyPath } from "@/lib/seo/routes"

export function AdultesEditorial() {
  return (
    <div className="flex flex-col gap-8">
      {ADULTES_SECTIONS.map((section) => (
        <section
          key={section.id}
          className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8"
        >
          <SectionHeading
            align="left"
            eyebrow={section.eyebrow ?? "Guide"}
            title={section.title}
          />
          <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <SectionHeading
          align="left"
          eyebrow="Difficulté"
          title="Moyen, difficile ou géant : choisir son défi"
          description="Trois paliers pour les adultes — progressez quand une liste vous semble trop courte."
        />
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 pr-4 font-extrabold">Niveau</th>
                <th className="py-2 pr-4 font-extrabold">Grille</th>
                <th className="py-2 pr-4 font-extrabold">Public</th>
                <th className="py-2 font-extrabold">Accès</th>
              </tr>
            </thead>
            <tbody className="text-foreground/90">
              <tr className="border-b border-border/60">
                <td className="py-3 pr-4 font-bold">Moyen</td>
                <td className="py-3 pr-4">10×10, diagonales</td>
                <td className="py-3 pr-4">Reprise du jeu, détente structurée</td>
                <td className="py-3">
                  <Link href={difficultyPath("moyen")} className="text-primary hover:underline">
                    Grilles moyennes
                  </Link>
                </td>
              </tr>
              <tr className="border-b border-border/60">
                <td className="py-3 pr-4 font-bold">Difficile</td>
                <td className="py-3 pr-4">12×12 à 15×15, mots inversés</td>
                <td className="py-3 pr-4">Adultes confirmés, défi vocabulaire</td>
                <td className="py-3">
                  <Link href={difficultyPath("difficile")} className="text-primary hover:underline">
                    Grilles difficiles
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-bold">Géant</td>
                <td className="py-3 pr-4">18×18 à 20×20, longues listes</td>
                <td className="py-3 pr-4">Experts, soirées longues, passionnés</td>
                <td className="py-3">
                  <Link href={difficultyPath("geant")} className="text-primary hover:underline">
                    Grilles géantes
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Comparez tous les niveaux depuis le{" "}
          <Link href={ROUTES.difficulteHub} className="font-semibold text-primary hover:underline">
            hub Difficulté
          </Link>
          .
        </p>
      </section>

      <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <h2 className="font-heading text-xl font-extrabold text-foreground">
          Explorer d&apos;autres rubriques
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Thèmes, grilles festives, puzzles presse ou formats Seniors — pour varier vos activités
          de loisir et vos défis de vocabulaire.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {ADULTES_HUB_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-sm font-semibold text-primary hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
