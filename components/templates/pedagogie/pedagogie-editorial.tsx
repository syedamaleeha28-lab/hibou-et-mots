import Link from "next/link"
import { SectionHeading } from "@/components/layout/section-heading"
import {
  PEDAGOGIE_EDUCATIONAL_LINKS,
  PEDAGOGIE_GRADE_ROWS,
  PEDAGOGIE_SECTIONS,
} from "@/lib/content/pedagogie"
import { ROUTES, gradePath } from "@/lib/seo/routes"

export function PedagogieEditorial() {
  return (
    <div className="flex flex-col gap-8">
      {PEDAGOGIE_SECTIONS.map((section) => (
        <section
          key={section.id}
          className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8"
        >
          <SectionHeading
            align="left"
            eyebrow={section.eyebrow}
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
          eyebrow="Niveaux scolaires"
          title="Mots mêlés du CP au CM2 : quelle grille pour quelle classe ?"
          description="Chaque cycle du primaire dispose d'une page dédiée avec des grilles calibrées sur la taille, le vocabulaire et les directions de lecture."
        />
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 pr-4 font-extrabold">Niveau</th>
                <th className="py-2 pr-4 font-extrabold">Âge</th>
                <th className="py-2 pr-4 font-extrabold">Grille type</th>
                <th className="py-2 pr-4 font-extrabold">Objectif pédagogique</th>
                <th className="py-2 font-extrabold">Accès</th>
              </tr>
            </thead>
            <tbody className="text-foreground/90">
              {PEDAGOGIE_GRADE_ROWS.map((row) => (
                <tr key={row.slug} className="border-b border-border/60">
                  <td className="py-3 pr-4 font-bold">{row.label}</td>
                  <td className="py-3 pr-4">{row.age}</td>
                  <td className="py-3 pr-4">{row.grid}</td>
                  <td className="py-3 pr-4">{row.focus}</td>
                  <td className="py-3">
                    <Link href={gradePath(row.slug)} className="text-primary hover:underline">
                      Voir les grilles {row.label}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Pour une vue d&apos;ensemble — maternelle, 6e et croisements thème × niveau — consultez
          le{" "}
          <Link href={ROUTES.ecoleHub} className="font-semibold text-primary hover:underline">
            hub Mots mêlés École
          </Link>
          .
        </p>
      </section>

      <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <h2 className="font-heading text-xl font-extrabold text-foreground">
          Toutes les rubriques éducatives
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Passez de la théorie à la pratique : grilles par classe, ressources pour enseignants,
          PDF à imprimer ou partie en ligne.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {PEDAGOGIE_EDUCATIONAL_LINKS.map((link) => (
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
