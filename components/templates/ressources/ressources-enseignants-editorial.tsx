import Link from "next/link"
import { SectionHeading } from "@/components/layout/section-heading"
import {
  RESSOURCES_CLASSROOM_ACTIVITIES,
  RESSOURCES_COMBO_LINKS,
  RESSOURCES_DIFFERENTIATION_PARAGRAPHS,
  RESSOURCES_GRADE_CARDS,
  RESSOURCES_PEDAGOGIE_CROSS_LINK,
  RESSOURCES_PRINTABLE_ROWS,
  RESSOURCES_TEACHER_LINKS,
  RESSOURCES_THEME_CARDS,
} from "@/lib/content/ressources-enseignants"
import { ROUTES, gradePath } from "@/lib/seo/routes"

export function RessourcesEnseignantsEditorial() {
  const programmeThemes = RESSOURCES_THEME_CARDS.filter((card) => card.group === "programme")
  const seasonalThemes = RESSOURCES_THEME_CARDS.filter((card) => card.group === "saison")

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <SectionHeading
          align="left"
          eyebrow="Par niveau"
          title="Choisir une grille par niveau scolaire"
          description="Sélectionnez une classe pour accéder aux grilles calibrées — taille, vocabulaire scolaire et directions adaptés aux cycles de l'Éducation nationale."
        />
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {RESSOURCES_GRADE_CARDS.map((grade) => (
            <li key={grade.slug}>
              <Link
                href={gradePath(grade.slug)}
                className="flex h-full flex-col rounded-2xl border border-border/80 bg-background/60 p-4 transition hover:border-primary/40 hover:bg-background"
              >
                <span className="font-heading text-lg font-extrabold text-foreground">
                  {grade.label}
                </span>
                <span className="mt-1 text-xs font-semibold text-muted-foreground">
                  {grade.age} · grille {grade.grid}
                </span>
                <span className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {grade.hint}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Vue d&apos;ensemble de tous les niveaux sur le{" "}
          <Link href={ROUTES.ecoleHub} className="font-semibold text-primary hover:underline">
            hub Mots mêlés École
          </Link>
          .
        </p>
      </section>

      <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <SectionHeading
          align="left"
          eyebrow="Par thème"
          title="Grilles thématiques pour la classe"
          description="Croisez le programme de français ou les fêtes de l'année avec une grille prête à imprimer ou à projeter."
        />
        <div className="mt-6 flex flex-col gap-6">
          <div>
            <h3 className="font-heading text-base font-extrabold text-foreground">
              Vocabulaire et programme
            </h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {programmeThemes.map((theme) => (
                <li key={theme.href}>
                  <Link
                    href={theme.href}
                    className="block rounded-xl border border-border/60 bg-background/50 p-3 text-sm hover:border-primary/40"
                  >
                    <span className="font-semibold text-primary">{theme.label}</span>
                    <span className="mt-1 block text-muted-foreground">{theme.hint}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-heading text-base font-extrabold text-foreground">
              Saisons et fêtes
            </h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {seasonalThemes.map((theme) => (
                <li key={theme.href}>
                  <Link
                    href={theme.href}
                    className="block rounded-xl border border-border/60 bg-background/50 p-3 text-sm hover:border-primary/40"
                  >
                    <span className="font-semibold text-primary">{theme.label}</span>
                    <span className="mt-1 block text-muted-foreground">{theme.hint}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <SectionHeading
          align="left"
          eyebrow="PDF"
          title="Fiches imprimables prêtes à distribuer"
          description="Chaque lien mène vers des grilles jouables en ligne ou exportables en PDF A4 avec corrigé — gratuites, sans compte."
        />
        <ul className="mt-6 flex flex-col gap-3">
          {RESSOURCES_PRINTABLE_ROWS.map((row) => (
            <li key={row.href}>
              <Link
                href={row.href}
                className="block rounded-2xl border border-border/80 bg-background/60 p-4 transition hover:border-primary/40"
              >
                <span className="font-semibold text-primary">{row.label}</span>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {row.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <SectionHeading
          align="left"
          eyebrow="En classe"
          title="Idées d'activités express (5 à 20 minutes)"
          description="Des scénarios prêts à l'emploi pour animer une séance de français sans longue préparation."
        />
        <div className="mt-6 flex flex-col gap-4">
          {RESSOURCES_CLASSROOM_ACTIVITIES.map((activity) => (
            <article
              key={activity.id}
              className="rounded-2xl border border-border/80 bg-background/60 p-5"
            >
              <h3 className="font-heading text-base font-extrabold text-foreground">
                {activity.title}
              </h3>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                {activity.duration} · {activity.levels}
              </p>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                {activity.steps.map((step) => (
                  <li key={step.slice(0, 48)}>{step}</li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <SectionHeading
          align="left"
          eyebrow="Différenciation"
          title="Adapter à une classe hétérogène"
          description="Même consigne, listes adaptées — du Cycle 2 au Cycle 3."
        />
        <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
          {RESSOURCES_DIFFERENTIATION_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Composez une fiche personnalisée avec le{" "}
          <Link href={ROUTES.generateur} className="font-semibold text-primary hover:underline">
            générateur de grilles
          </Link>{" "}
          — dix mots suffisent pour une activité ciblée sur le vocabulaire de la semaine.
        </p>
      </section>

      <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <SectionHeading
          align="left"
          eyebrow="Niveau × thème"
          title="Combiner niveau et thème"
          description="Pages dédiées qui croisent une classe et un lexique — idéal pour les projets saisonniers."
        />
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {RESSOURCES_COMBO_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-xl border border-border/60 bg-background/50 p-3 text-sm hover:border-primary/40"
              >
                <span className="font-semibold text-primary">{link.label}</span>
                <span className="mt-1 block text-muted-foreground">{link.hint}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-primary/30 bg-primary/5 p-6 sm:p-8">
        <h2 className="font-heading text-xl font-extrabold text-foreground">
          {RESSOURCES_PEDAGOGIE_CROSS_LINK.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {RESSOURCES_PEDAGOGIE_CROSS_LINK.description}
        </p>
        <Link
          href={RESSOURCES_PEDAGOGIE_CROSS_LINK.href}
          className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
        >
          {RESSOURCES_PEDAGOGIE_CROSS_LINK.cta}
        </Link>
      </section>

      <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <h2 className="font-heading text-xl font-extrabold text-foreground">
          Liens utiles pour les enseignants
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Accès directs aux rubriques les plus consultées pour préparer une séance ou un devoir
          maison.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {RESSOURCES_TEACHER_LINKS.map((link) => (
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
