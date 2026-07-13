import Link from "next/link"
import { SectionHeading } from "@/components/layout/section-heading"
import { SENIORS_HUB_LINKS, SENIORS_SECTIONS } from "@/lib/content/seniors"
import { ROUTES } from "@/lib/seo/routes"

export function SeniorsEditorial() {
  return (
    <div className="flex flex-col gap-8">
      {SENIORS_SECTIONS.map((section) => (
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
          eyebrow="Formats"
          title="Grand format, en ligne ou PDF : comment choisir ?"
          description="Trois modes complémentaires pour les seniors — à adapter selon la vue, le matériel et le lieu."
        />
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 pr-4 font-extrabold">Mode</th>
                <th className="py-2 pr-4 font-extrabold">Idéal pour</th>
                <th className="py-2 font-extrabold">Accès</th>
              </tr>
            </thead>
            <tbody className="text-foreground/90">
              <tr className="border-b border-border/60">
                <td className="py-3 pr-4 font-bold">PDF grand format</td>
                <td className="py-3 pr-4">Confort visuel, EHPAD, club papier</td>
                <td className="py-3">
                  <Link href={ROUTES.imprimer} className="text-primary hover:underline">
                    Imprimer une grille
                  </Link>
                </td>
              </tr>
              <tr className="border-b border-border/60">
                <td className="py-3 pr-4 font-bold">Jeu en ligne</td>
                <td className="py-3 pr-4">Tablette, zoom navigateur, sans impression</td>
                <td className="py-3">
                  <Link href={ROUTES.jouer} className="text-primary hover:underline">
                    Jouer en ligne
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-bold">Grille personnalisée</td>
                <td className="py-3 pr-4">Liste de prénoms, thème du club, animation sur mesure</td>
                <td className="py-3">
                  <Link href={ROUTES.generateur} className="text-primary hover:underline">
                    Générateur gratuit
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <h2 className="font-heading text-xl font-extrabold text-foreground">
          Explorer d&apos;autres rubriques
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Thèmes variés, niveaux de difficulté, grilles festives ou style magazine — pour renouveler
          vos exercices de mémoire et vos activités de retraite.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {SENIORS_HUB_LINKS.map((link) => (
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
