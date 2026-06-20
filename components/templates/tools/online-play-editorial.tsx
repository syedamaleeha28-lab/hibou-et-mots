import Link from "next/link"
import { FaqAccordion } from "@/components/templates/shared/faq-accordion"
import { SectionHeading } from "@/components/layout/section-heading"
import { ONLINE_PLAY_FAQ } from "@/lib/content/phase1"
import { ROUTES } from "@/lib/seo/routes"

export function OnlinePlayEditorial() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
      <div className="mt-10 flex flex-col gap-10">
        <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
          <SectionHeading
            align="left"
            eyebrow="Jeu en ligne"
            title="Jouez dans votre navigateur"
            description="Sans téléchargement ni installation — ordinateur, tablette ou smartphone."
          />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Cliquez sur la première puis la dernière lettre d&apos;un mot pour le sélectionner. La
            grille se met à jour instantanément et un mot trouvé s&apos;illumine. Choisissez un
            thème, un niveau de difficulté et relancez une partie à tout moment — mode détente ou
            chronométré.
          </p>
        </section>

        <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
          <h2 className="font-heading text-xl font-extrabold text-foreground">
            Comment jouer en 3 étapes
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>Repérez un mot dans la liste, puis cherchez-le dans la grille.</li>
            <li>Cliquez la première et la dernière lettre pour le sélectionner (horizontal, vertical ou diagonal).</li>
            <li>Cochez les mots trouvés jusqu&apos;à remplir toute la liste.</li>
          </ol>
        </section>

        <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
          <h2 className="font-heading text-xl font-extrabold text-foreground">
            En ligne ou à imprimer ?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Le jeu en ligne est instantané et sans papier — idéal à la maison. L&apos;impression
            convient mieux à la classe ou aux trajets sans écran. Comparez avec{" "}
            <Link href={ROUTES.imprimer} className="text-primary hover:underline">
              mots mêlés à imprimer
            </Link>{" "}
            ou créez une grille sur mesure avec le{" "}
            <Link href={ROUTES.generateur} className="text-primary hover:underline">
              générateur
            </Link>
            .
          </p>
          <p className="mt-3 text-sm">
            <Link href={ROUTES.thematiquesHub} className="font-bold text-primary hover:underline">
              Parcourir les thèmes
            </Link>
            {" · "}
            <Link href={ROUTES.difficulteHub} className="font-bold text-primary hover:underline">
              Choisir une difficulté
            </Link>
          </p>
        </section>

        <FaqAccordion items={ONLINE_PLAY_FAQ} />
      </div>
    </div>
  )
}
