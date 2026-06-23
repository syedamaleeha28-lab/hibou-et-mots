import Link from "next/link"
import { ROUTES } from "@/lib/seo/routes"
import { SectionHeading } from "@/components/layout/section-heading"

export function HomeSeoIntro() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <SectionHeading
        eyebrow="Découvrir"
        title="Des mots mêlés gratuits pour toute la famille"
        description="Hibou&Mots réunit des grilles en français pour l'école, les thèmes du quotidien et les fêtes de l'année — du CP à la 6e, et aussi pour les adultes et les seniors."
      />
      <div className="mt-8 flex flex-col gap-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
        <p>
          Chaque grille est jouable en ligne ou imprimable en PDF avec corrigé. Les puzzles sont
          organisés par niveau scolaire (maternelle, CP, CE1, CE2, CM1, CM2, 6e), par thème
          (animaux, sport, vocabulaire, géographie…) et par saison (Noël, Halloween, Pâques…).
          Parents et enseignants trouvent en quelques secondes une activité adaptée au programme
          de français, à la dictée et à l&apos;apprentissage du vocabulaire.
        </p>
        <p>
          Les passionnés de mots mêlés{" "}
          <Link href={ROUTES.adultes} className="font-semibold text-primary hover:underline">
            adultes
          </Link>{" "}
          et{" "}
          <Link href={ROUTES.seniors} className="font-semibold text-primary hover:underline">
            seniors
          </Link>{" "}
          trouvent également des grilles plus denses, avec un mode grand format pour une lecture
          confortable. Créez une grille sur le{" "}
          <Link href={ROUTES.generateur} className="font-semibold text-primary hover:underline">
            générateur
          </Link>
          , imprimez un PDF depuis la page{" "}
          <Link href={ROUTES.imprimer} className="font-semibold text-primary hover:underline">
            à imprimer
          </Link>{" "}
          ou lancez une partie sur la page{" "}
          <Link href={ROUTES.jouer} className="font-semibold text-primary hover:underline">
            jouer en ligne
          </Link>
          . Tout reste gratuit, sans inscription et sans publicité intrusive sur les pages de jeu.
        </p>
      </div>
    </section>
  )
}

export function HomePedagogySection() {
  return (
    <section className="bg-card/60 py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pédagogie"
          title="Pourquoi les mots mêlés aident à apprendre"
          description="Un jeu qui renforce la lecture, l'orthographe et le repérage visuel — au primaire comme au collège."
        />
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground">
          Trouver un mot caché dans la grille oblige l&apos;enfant à mémoriser sa forme visuelle
          complète, ce qui complète la lecture syllabique et la dictée. En classe comme à la maison,
          c&apos;est une activité calme qui convient aux cycles 2 et 3 du primaire et prépare
          progressivement le vocabulaire exigé au collège.
        </p>
      </div>
    </section>
  )
}

export function HomeChooseGridSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Guide"
        title="Comment choisir la bonne grille"
        description="Trois repères simples : l'âge, le thème ou l'occasion."
      />
      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        <li className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-heading font-extrabold text-foreground">Par âge</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Maternelle, CP, CE1… choisissez un{" "}
            <Link href={ROUTES.ecoleHub} className="text-primary hover:underline">
              niveau scolaire
            </Link>{" "}
            adapté au cycle de votre enfant.
          </p>
        </li>
        <li className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-heading font-extrabold text-foreground">Par thème</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Animaux, sport, vocabulaire… parcourez les{" "}
            <Link href={ROUTES.thematiquesHub} className="text-primary hover:underline">
              mots mêlés thématiques
            </Link>
            .
          </p>
        </li>
        <li className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-heading font-extrabold text-foreground">Par occasion</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Noël, Halloween, rentrée… explorez les{" "}
            <Link href={ROUTES.fetesHub} className="text-primary hover:underline">
              fêtes et saisons
            </Link>
            .
          </p>
        </li>
      </ul>
    </section>
  )
}

export function HomeSiloLinks() {
  const links = [
    { href: ROUTES.gratuits, label: "Mots mêlés gratuits" },
    { href: ROUTES.imprimer, label: "Imprimer une grille PDF" },
    { href: ROUTES.jouer, label: "Jouer en ligne" },
    { href: ROUTES.generateur, label: "Créer ma grille" },
    { href: ROUTES.ecoleHub, label: "Mots mêlés École" },
    { href: ROUTES.thematiquesHub, label: "Mots mêlés par thème" },
    { href: ROUTES.fetesHub, label: "Fêtes & saisons" },
    { href: ROUTES.presseHub, label: "Journaux & magazines" },
  ]

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <h2 className="font-heading text-2xl font-extrabold text-foreground">
        Parcourir par catégorie
      </h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
