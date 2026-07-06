import Image from "next/image"
import Link from "next/link"
import { Printer, Shuffle, Sparkles, Wand2 } from "lucide-react"
import { SectionHeading } from "@/components/layout/section-heading"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/seo/routes"

const perks = [
  { icon: Wand2, label: "Liste de mots personnalisée" },
  { icon: Shuffle, label: "Taille et difficulté au choix" },
  { icon: Printer, label: "Grille prête à imprimer" },
]

export function HomeGeneratorTeaser() {
  return (
    <section
      id="generateur"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <SectionHeading
        align="center"
        as="h2"
        eyebrow="Générateur"
        title="Générateur de Mots Mêlés Gratuit et Personnalisable"
        description="Choisissez vos mots, la taille et la difficulté — créez une grille en français en quelques secondes, sans inscription."
      />

      <div className="mt-10 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
        <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <p className="text-base leading-relaxed text-muted-foreground">
            Composez une fiche sur mesure pour la classe ou la maison : saisissez votre
            vocabulaire, régénérez la grille en un clic et imprimez un PDF avec corrigé sur la
            page dédiée du générateur.
          </p>

          <ul className="flex flex-col gap-3">
            {perks.map((perk) => (
              <li key={perk.label} className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <perk.icon className="size-5" />
                </span>
                <span className="font-bold text-foreground">{perk.label}</span>
              </li>
            ))}
          </ul>

          <Button
            size="lg"
            nativeButton={false}
            className="mt-2 w-fit rounded-full bg-primary font-extrabold text-primary-foreground hover:bg-primary/90"
            render={<Link href={ROUTES.generateur} />}
          >
            <Sparkles className="size-5" />
            Ouvrir le générateur complet
          </Button>
        </div>

        <div className="relative flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-10">
          <div className="absolute -top-8 left-1/2 z-10 -translate-x-1/2">
            <Image
              src="/mascot-leo.png"
              alt="Hibou, mascotte de Hibou&Mots, prêt à créer une grille"
              width={128}
              height={128}
              className="h-28 w-28 rounded-[2rem] object-cover drop-shadow-lg"
            />
          </div>

          <div className="mt-16 flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-6 py-10 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Wand2 className="size-8" />
            </span>
            <p className="font-heading text-lg font-extrabold text-foreground">
              Créez votre grille en ligne
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Le générateur interactif s&apos;ouvre sur une page dédiée pour garder l&apos;accueil
              léger et rapide à charger.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
