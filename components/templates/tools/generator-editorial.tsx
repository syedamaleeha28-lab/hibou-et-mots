import Link from "next/link"
import { FaqAccordion } from "@/components/templates/shared/faq-accordion"
import { SectionHeading } from "@/components/layout/section-heading"
import { GENERATOR_FAQ } from "@/lib/content/phase1"
import { ROUTES } from "@/lib/seo/routes"

export function GeneratorEditorial() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
      <div className="mt-10 flex flex-col gap-10">
        <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
          <SectionHeading
            align="left"
            eyebrow="Créateur"
            title="Pour qui est fait ce générateur ?"
            description="Trois usages concrets, du primaire aux adultes."
          />
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>
              <strong className="text-foreground">Enseignant :</strong> préparez une fiche de
              vocabulaire de la semaine avec les mots travaillés en classe.
            </li>
            <li>
              <strong className="text-foreground">Parent :</strong> créez une grille avec le prénom
              des invités pour un anniversaire à thème.
            </li>
            <li>
              <strong className="text-foreground">Adulte :</strong> composez un défi inédit avec un
              vocabulaire personnalisé et une taille de grille ajustée.
            </li>
          </ul>
        </section>

        <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
          <h2 className="font-heading text-xl font-extrabold text-foreground">
            Conseils pour une bonne grille
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Maternelle et CP : 6 à 8 mots courts. CE1–CE2 : 8 à 10 mots. CM1–CM2 : mots plus longs
            avec diagonales. Utilisez le mode grand format pour une meilleure lisibilité. Ensuite,
            imprimez via{" "}
            <Link href={ROUTES.imprimer} className="text-primary hover:underline">
              mots mêlés à imprimer
            </Link>{" "}
            ou jouez sur{" "}
            <Link href={ROUTES.jouer} className="text-primary hover:underline">
              jouer en ligne
            </Link>
            .
          </p>
          <p className="mt-3 text-sm">
            <Link href={ROUTES.pedagogie} className="font-bold text-primary hover:underline">
              Conseils pédagogiques pour enseignants
            </Link>
          </p>
        </section>

        <FaqAccordion items={GENERATOR_FAQ} />
      </div>
    </div>
  )
}
