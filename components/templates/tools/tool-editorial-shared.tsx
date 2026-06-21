import Link from "next/link"
import { SectionHeading } from "@/components/layout/section-heading"
import { ROUTES } from "@/lib/seo/routes"

const HUB_LINKS = [
  { href: ROUTES.enfants, label: "Mots mêlés enfants" },
  { href: ROUTES.ecoleHub, label: "Mots mêlés École — CP à 6e" },
  { href: ROUTES.imprimer, label: "Mots mêlés à imprimer (PDF)" },
  { href: ROUTES.gratuits, label: "Toutes les grilles gratuites" },
] as const

export function ToolHubLinks() {
  return (
    <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
      <SectionHeading
        align="left"
        eyebrow="Explorer"
        title="Continuer avec le catalogue Hibou&Mots"
        description="Des centaines de grilles prêtes à jouer ou à imprimer, classées par âge et par thème."
      />
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Vous préférez une grille déjà publiée ? Parcourez les mots mêlés adaptés aux{" "}
        <Link href={ROUTES.enfants} className="font-semibold text-primary hover:underline">
          enfants
        </Link>
        , par{" "}
        <Link href={ROUTES.ecoleHub} className="font-semibold text-primary hover:underline">
          niveau scolaire
        </Link>
        , ou téléchargez des PDF depuis la page{" "}
        <Link href={ROUTES.imprimer} className="font-semibold text-primary hover:underline">
          à imprimer
        </Link>
        . L&apos;ensemble reste accessible sur la page{" "}
        <Link href={ROUTES.gratuits} className="font-semibold text-primary hover:underline">
          mots mêlés gratuits
        </Link>
        .
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {HUB_LINKS.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm font-semibold text-primary hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

type PrintableVsOnlineProps = {
  focus: "generator" | "online"
}

export function PrintableVsOnlineComparison({ focus }: PrintableVsOnlineProps) {
  const lead =
    focus === "generator"
      ? "Une grille créée avec le générateur peut être jouée tout de suite en ligne ou exportée en PDF. Voici comment choisir le bon format selon votre situation."
      : "Le jeu en ligne convient à une partie immédiate ; l'impression reste la meilleure option pour la classe ou les écrans limités. Voici un comparatif rapide."

  return (
    <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
      <SectionHeading
        align="left"
        eyebrow="Formats"
        title="Imprimer ou jouer en ligne ?"
        description={lead}
      />
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-2 pr-4 font-extrabold">Critère</th>
              <th className="py-2 pr-4 font-extrabold">En ligne</th>
              <th className="py-2 font-extrabold">À imprimer (PDF)</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border/60">
              <td className="py-3 pr-4 font-bold">Démarrage</td>
              <td className="py-3 pr-4">Instantané dans le navigateur</td>
              <td className="py-3">Téléchargement puis impression A4</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-3 pr-4 font-bold">Idéal pour</td>
              <td className="py-3 pr-4">Maison, tablette, pause rapide</td>
              <td className="py-3">Classe, cahier d&apos;activités, sans écran</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-3 pr-4 font-bold">Matériel</td>
              <td className="py-3 pr-4">Ordinateur, tablette ou smartphone</td>
              <td className="py-3 pr-4">Imprimante, papier, crayons</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-3 pr-4 font-bold">Correction</td>
              <td className="py-3 pr-4">Mots surlignés au fur et à mesure</td>
              <td className="py-3">Corrigé sur la page 2 du PDF</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 font-bold">Personnalisation</td>
              <td className="py-3 pr-4">
                {focus === "generator"
                  ? "Liste de mots sur mesure + aperçu direct"
                  : "Thème et difficulté au choix, nouvelle partie en un clic"}
              </td>
              <td className="py-3">
                Grilles du{" "}
                <Link href={ROUTES.imprimer} className="text-primary hover:underline">
                  catalogue PDF
                </Link>{" "}
                ou grille du{" "}
                <Link href={ROUTES.generateur} className="text-primary hover:underline">
                  générateur
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        En résumé : jouez en ligne pour une activité immédiate et sans papier ; imprimez lorsque
        plusieurs élèves ou enfants travaillent en parallèle ou lorsque vous souhaitez limiter le
        temps d&apos;écran. Les deux formats restent gratuits sur Hibou&Mots.
      </p>
    </section>
  )
}

export function TeacherUseCases({ context }: { context: "generator" | "online" }) {
  const items =
    context === "generator"
      ? [
          {
            title: "Fiche de vocabulaire hebdomadaire",
            body: "Saisissez les mots travaillés en dictée ou en lecture (8 à 12 termes), générez la grille et distribuez une version imprimée différente par table pour éviter la triche.",
          },
          {
            title: "Évaluation calme en fin de séance",
            body: "Proposez une grille sur le thème de la leçon (animaux, géographie, saison…) : les élèves repèrent les mots pendant que vous corrige des copies ou préparez la suite du cours.",
          },
          {
            title: "Différenciation par niveau",
            body: "Créez trois listes distinctes (CP, CE1, CM2) avec la même structure de consigne mais des mots adaptés à chaque groupe, puis imprimez ou projetez selon le groupe.",
          },
          {
            title: "Interdisciplinarité",
            body: "Croisez vocabulaire scientifique, histoire ou géographie : le générateur accepte toute liste de mots en français, sans limite de thème imposé par le catalogue.",
          },
        ]
      : [
          {
            title: "Activité d'accueil au début de cours",
            body: "Lancez une partie en ligne sur le vidéoprojecteur ou sur tablettes : les élèves trouvent les mots pendant que tout le monde arrive et s'installe calmement.",
          },
          {
            title: "Consolidation du vocabulaire travaillé",
            body: "Choisissez un thème aligné sur la séquence en cours (rentrée, Noël, sport…) et une difficulté adaptée au cycle : le chronomètre optionnel motive sans stress.",
          },
          {
            title: "Devoir maison sans photocopie",
            body: "Envoyez le lien de la page ou d'une grille du catalogue : chaque famille joue en ligne avec le même thème, sans avoir à imprimer chez soi.",
          },
          {
            title: "Atelier autonomie en classe",
            body: "Les élèves qui terminent une tâche peuvent enchaîner sur une grille en ligne pendant que vous accompagnez un autre groupe — pas de préparation de fiche supplémentaire.",
          },
        ]

  return (
    <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
      <SectionHeading
        align="left"
        eyebrow="Enseignants"
        title="Idées pour la classe"
        description="Des usages concrets en maternelle, au primaire et au début du collège — sans préparation lourde."
      />
      <ul className="mt-6 flex flex-col gap-5">
        {items.map((item) => (
          <li key={item.title}>
            <h3 className="font-heading text-base font-extrabold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
        Retrouvez des grilles calibrées par niveau sur la page{" "}
        <Link href={ROUTES.ecoleHub} className="font-semibold text-primary hover:underline">
          Mots mêlés École
        </Link>{" "}
        et des PDF prêts à distribuer sur{" "}
        <Link href={ROUTES.imprimer} className="font-semibold text-primary hover:underline">
          mots mêlés à imprimer
        </Link>
        .
      </p>
    </section>
  )
}

export function ParentUseCases({ context }: { context: "generator" | "online" }) {
  const items =
    context === "generator"
      ? [
          {
            title: "Anniversaire ou goûter à thème",
            body: "Composez une grille avec les prénoms des invités, des mots du thème (dinosaures, princesses, sport…) et imprimez une copie par enfant.",
          },
          {
            title: "Révision des mots difficiles",
            body: "Reprenez la liste de dictée ou les mots en rouge du cahier de liaison : les revoir dans une grille renforce la mémorisation visuelle du mot entier.",
          },
          {
            title: "Occupation calme le mercredi",
            body: "Réglez une taille de grille adaptée à l'âge (6×6 en maternelle, 10×10 au CM1) et laissez l'enfant jouer en ligne ou sur une feuille imprimée.",
          },
          {
            title: "Voyage sans écran (option papier)",
            body: "Générez la grille la veille, imprimez le PDF avec corrigé et emportez une activité légère pour le trajet en voiture ou en train.",
          },
        ]
      : [
          {
            title: "Devoir du soir sans bagarre",
            body: "Une partie de mots mêlés en ligne remplace parfois une fiche rébarbative : l'enfant voit ses progrès mot par mot surligné.",
          },
          {
            title: "Fratrie : plusieurs niveaux",
            body: "Lancez une grille facile pour le cadet et une moyenne pour l'aîné sur le même thème — chacun joue sur son appareil ou à tour de rôle.",
          },
          {
            title: "Pluie ou canicule à la maison",
            body: "Pas d'installation : ouvrez la page sur tablette ou ordinateur, choisissez animaux ou fêtes de l'année, et relancez une nouvelle partie en un clic.",
          },
          {
            title: "Complicité lecture / vocabulaire",
            body: "Jouez ensemble en lisant la liste à voix haute : l'enfant cherche le mot pendant que vous validez — idéal dès le CP.",
          },
        ]

  return (
    <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
      <SectionHeading
        align="left"
        eyebrow="Familles"
        title="Idées pour les parents"
        description="Des activités courtes, gratuites et adaptées du CP à la 6e — à la maison ou en déplacement."
      />
      <ul className="mt-6 flex flex-col gap-5">
        {items.map((item) => (
          <li key={item.title}>
            <h3 className="font-heading text-base font-extrabold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
        Découvrez des grilles triées par âge sur{" "}
        <Link href={ROUTES.enfants} className="font-semibold text-primary hover:underline">
          mots mêlés enfants
        </Link>{" "}
        ou parcourez l&apos;intégralité du catalogue{" "}
        <Link href={ROUTES.gratuits} className="font-semibold text-primary hover:underline">
          gratuit
        </Link>
        .
      </p>
    </section>
  )
}
