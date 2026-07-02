import Link from "next/link"
import { ROUTES, gradePath, themePath } from "@/lib/seo/routes"
import { gradeSeed } from "@/prisma/seed/grades"

type CategoryPhase1SectionsProps = {
  slug: string
}

const PHASE1_SLUGS = new Set(["hub-gratuits", "hub-imprimer", "hub-ecole", "enfants"])

export function CategoryPhase1Sections({ slug }: CategoryPhase1SectionsProps) {
  if (!PHASE1_SLUGS.has(slug)) return null

  return (
    <div className="flex flex-col gap-8">
      {slug === "hub-gratuits" && <GratuitsSections />}
      {slug === "hub-imprimer" && <ImprimerSections />}
      {slug === "hub-ecole" && <EcoleSections />}
      {slug === "enfants" && <EnfantsSections />}
    </div>
  )
}

function InternalLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <ul className="mt-3 flex flex-col gap-2 text-sm font-semibold">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="text-primary underline-offset-4 hover:underline">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function GratuitsSections() {
  return (
    <>
      <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <h2 className="font-heading text-xl font-extrabold text-foreground">
          Comment jouer aux mots mêlés gratuitement sur Hibou &amp; Mots
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 pr-4 font-extrabold">Mode</th>
                <th className="py-2 pr-4 font-extrabold">Idéal pour</th>
                <th className="py-2 font-extrabold">Accès</th>
              </tr>
            </thead>
            <tbody className="text-foreground/90">
              <tr className="border-b border-border/60">
                <td className="py-3 pr-4 font-bold">Jouer en ligne</td>
                <td className="py-3 pr-4">Partie immédiate sans papier</td>
                <td className="py-3">
                  <Link href={ROUTES.jouer} className="text-primary hover:underline">
                    Jouer en ligne
                  </Link>
                </td>
              </tr>
              <tr className="border-b border-border/60">
                <td className="py-3 pr-4 font-bold">Imprimer en PDF</td>
                <td className="py-3 pr-4">Classe, maison, cahier d&apos;activités</td>
                <td className="py-3">
                  <Link href={ROUTES.imprimer} className="text-primary hover:underline">
                    Mots mêlés à imprimer
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-bold">Créer sa grille</td>
                <td className="py-3 pr-4">Vocabulaire personnalisé, anniversaire</td>
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
          Nos grilles gratuites par catégorie
        </h2>
        <InternalLinks
          links={[
            { href: ROUTES.enfants, label: "Mots mêlés enfants" },
            { href: ROUTES.adultes, label: "Mots mêlés adultes" },
            { href: ROUTES.jouer, label: "Jouer aux mots mêlés en ligne" },
            { href: ROUTES.imprimer, label: "Mots mêlés à imprimer" },
          ]}
        />
      </section>
    </>
  )
}

function ImprimerSections() {
  return (
    <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
      <h2 className="font-heading text-xl font-extrabold text-foreground">
        Imprimer par thème ou par niveau
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Retrouvez des PDF prêts à imprimer — mots mêlés et jeux de mots cachés — classés par école,
        par fête de l&apos;année ou parmi toutes les grilles gratuites du catalogue.
      </p>
      <InternalLinks
        links={[
          { href: ROUTES.ecoleHub, label: "Mots mêlés École — CP à 6e" },
          { href: ROUTES.fetesHub, label: "Mots mêlés Fêtes & Saisons" },
          { href: ROUTES.gratuits, label: "Toutes les grilles gratuites" },
        ]}
      />
    </section>
  )
}

function EcoleSections() {
  return (
    <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
      <h2 className="font-heading text-xl font-extrabold text-foreground">
        Les 7 niveaux en un coup d&apos;œil
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-2 pr-4 font-extrabold">Niveau</th>
              <th className="py-2 pr-4 font-extrabold">Âge</th>
              <th className="py-2 pr-4 font-extrabold">Grille</th>
              <th className="py-2 font-extrabold">Page</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            {gradeSeed.map((grade) => (
              <tr key={grade.slug} className="border-b border-border/60">
                <td className="py-2 pr-4 font-bold">{grade.name}</td>
                <td className="py-2 pr-4">{grade.ageRange}</td>
                <td className="py-2 pr-4">{grade.defaultGridSize}×{grade.defaultGridSize}</td>
                <td className="py-2">
                  <Link href={gradePath(grade.slug)} className="text-primary hover:underline">
                    Voir les grilles
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <InternalLinks
        links={[
          { href: ROUTES.pedagogie, label: "Pédagogie des mots mêlés" },
          { href: ROUTES.thematiquesHub, label: "Mots mêlés par thème" },
          { href: ROUTES.imprimer, label: "Imprimer en PDF" },
        ]}
      />
    </section>
  )
}

function EnfantsSections() {
  return (
    <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
      <h2 className="font-heading text-xl font-extrabold text-foreground">
        Quelle grille pour quel âge ?
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-2 pr-4 font-extrabold">Âge</th>
              <th className="py-2 pr-4 font-extrabold">Niveau</th>
              <th className="py-2 font-extrabold">Grille type</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border/60">
              <td className="py-2 pr-4">3–5 ans</td>
              <td className="py-2 pr-4">
                <Link href={gradePath("maternelle")} className="text-primary hover:underline">
                  Maternelle
                </Link>
              </td>
              <td className="py-2">6×6, mots courts</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-2 pr-4">6–8 ans</td>
              <td className="py-2 pr-4">
                <Link href={gradePath("cp")} className="text-primary hover:underline">
                  CP
                </Link>
                {" · "}
                <Link href={gradePath("ce1")} className="text-primary hover:underline">
                  CE1
                </Link>
              </td>
              <td className="py-2">8×8 à 10×10</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">9–12 ans</td>
              <td className="py-2 pr-4">
                <Link href={gradePath("cm2")} className="text-primary hover:underline">
                  CM2
                </Link>
              </td>
              <td className="py-2">12×12, diagonales</td>
            </tr>
          </tbody>
        </table>
      </div>
      <InternalLinks
        links={[
          { href: ROUTES.ecoleHub, label: "Tous les niveaux scolaires" },
          { href: ROUTES.fetesHub, label: "Grilles de fêtes et saisons" },
          { href: themePath("animaux"), label: "Thème Animaux — idéal pour les enfants" },
        ]}
      />
    </section>
  )
}
