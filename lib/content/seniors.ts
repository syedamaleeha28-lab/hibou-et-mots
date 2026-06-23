import type { FaqItem } from "@/lib/db/types/page-data"
import { ROUTES, difficultyPath } from "@/lib/seo/routes"

/** Authority hub intro for /mots-meles-seniors/ */
export const SENIORS_INTRO = [
  "Les mots mêlés restent l'un des jeux de lettres les plus appréciés après la retraite : règles simples, rythme calme, satisfaction immédiate quand un mot apparaît enfin dans la grille. Cette page Seniors rassemble des grilles pensées pour le confort visuel — grand format, lettres lisibles — et pour une stimulation cognitive douce, à la maison, entre amis ou en établissement.",
  "Hibou&Mots propose des puzzles gratuits à imprimer en PDF avec corrigé ou à jouer en ligne. Chaque grille peut être exportée en mode grand format pour faciliter la lecture. Que vous cherchiez une activité de mémoire quotidienne, une animation en EHPAD ou un passe-temps papier sans écran, vous trouverez ici des listes variées et des conseils pour choisir la bonne difficulté.",
].join("\n\n")

export const SENIORS_META_DESCRIPTION =
  "Mots mêlés Seniors en grand format : confort visuel, exercices de mémoire, stimulation cognitive et grilles imprimables gratuites pour la retraite et les EHPAD."

export const SENIORS_FAQ: FaqItem[] = [
  {
    question: "Les grilles Seniors sont-elles vraiment en grand format ?",
    answer:
      "Oui, la rubrique Mots mêlés Seniors privilégie le mode grand format : lettres plus grandes, espacement généreux et PDF A4 optimisé pour une lecture confortable à la loupe ou sans lunettes.",
  },
  {
    question: "Les mots mêlés aident-ils la mémoire des seniors ?",
    answer:
      "Les grilles Seniors sollicitent le repérage visuel et le rappel du vocabulaire : retrouver un mot dans la grille entraîne la mémoire de travail et la concentration, sans stress de performance.",
  },
  {
    question: "Peut-on utiliser ces puzzles en EHPAD ?",
    answer:
      "Oui, les animateurs peuvent imprimer plusieurs grilles Seniors différentes pour un atelier collectif : correction au corrigé, reprise des mots non trouvés à voix haute, variantes thématiques selon la saison.",
  },
  {
    question: "Faut-il jouer en ligne ou imprimer les grilles ?",
    answer:
      "Les deux conviennent aux Seniors : le PDF imprimable convient aux activités papier en retraite ou en établissement ; le jeu en ligne évite le bruit de l'imprimante et agrandit la grille sur tablette.",
  },
  {
    question: "Quelle difficulté choisir sur la page Seniors ?",
    answer:
      "Commencez par une grille Seniors facile ou moyenne, puis progressez vers le niveau difficile si la liste est terminée rapidement. Le grand format reste disponible quel que soit le niveau choisi.",
  },
]

export type SeniorsSection = {
  id: string
  title: string
  eyebrow?: string
  paragraphs: string[]
}

export const SENIORS_SECTIONS: SeniorsSection[] = [
  {
    id: "grand-format",
    eyebrow: "Lisibilité",
    title: "Grand format et confort visuel",
    paragraphs: [
      "Avec l'âge, la lecture fine sur une grille dense devient fatigante. Le mode grand format de Hibou&Mots agrandit les lettres, augmente l'espacement entre les cases et adapte la taille du titre pour que la liste et la grille restent lisibles sur une feuille A4 standard — sans loupe, ou avec une lecture nettement plus confortable si vous en utilisez une.",
      "Ce confort visuel réduit la frustration : vous passez moins de temps à déchiffrer chaque caractère et plus de temps à chercher le mot lui-même. C'est l'objectif central de la rubrique Seniors : des mots mêlés pensés pour les yeux, pas seulement pour les experts de mots croisés.",
      "Imprimez en noir et blanc pour économiser l'encre, ou jouez en ligne sur une tablette dont vous pouvez augmenter la luminosité. Dans les deux cas, privilégiez un éclairage direct sur la page et des pauses régulières si vos yeux fatiguent.",
    ],
  },
  {
    id: "memoire",
    title: "Exercices de mémoire au fil des grilles",
    paragraphs: [
      "Retrouver un mot caché sollicite la mémoire de travail : il faut retenir la forme du mot pendant que les yeux parcourent la grille. Cette tâche simple, répétée plusieurs fois par semaine, entretient l'attention sans la violence d'un test médicalisé.",
      "Pour renforcer l'effet mémoire, lisez la liste à voix haute avant de commencer, puis répétez les mots trouvés en fin de partie. Certains joueurs gardent un carnet des mots oubliés pour les retrouver dans une grille suivante — une révision douce du vocabulaire du quotidien.",
      "Alternez les thèmes : géographie, cuisine, nature, fêtes de l'année. La nouveauté du lexique évite l'effet « automatique » et maintient l'intérêt sur le long terme, idéal pour une routine de retraite ou un club de jeux entre voisins.",
    ],
  },
  {
    id: "stimulation-cognitive",
    title: "Stimulation cognitive en douceur",
    paragraphs: [
      "Les mots mêlés activent plusieurs fonctions cognitives : lecture, repérage spatial, planification (« par où commencer ? »), persévérance. Cette combinaison en fait un support de stimulation cognitive accessible, sans matériel coûteux ni application complexe.",
      "Contrairement aux puzzles numériques rapides, le rythme reste maîtrisé : vous avancez à votre vitesse, vous pouvez interrompre et reprendre, vous cochez les mots un par un. Cette autonomie convient aux personnes qui refusent les jeux « chronométrés » ou les interfaces surchargées.",
      "En EHPAD comme à domicile, une grille par jour ou par semaine suffit pour entretenir l'habitude. L'important est la régularité modérée, pas la performance : terminer la moitié de la liste reste une réussite si le plaisir est au rendez-vous.",
    ],
  },
  {
    id: "retraite",
    title: "Activités de retraite : papier, club ou famille",
    paragraphs: [
      "La retraite offre du temps pour les passe-temps calmes. Les mots mêlés imprimables s'intègrent facilement dans une matinée : café, grille, correction au corrigé. Certains couples s'affrontent amicalement sur la même liste ; d'autres envoient des PDF à des amis par messagerie pour comparer les temps de résolution.",
      "Un club de retraités peut organiser un thème par mois — cuisine régionale, voyages, jardin — en piochant dans les rubriques thématiques du site. Chacun imprime sa version ou joue en ligne depuis chez soi, puis partage les mots les plus difficiles lors de la prochaine rencontre.",
      "Avec les petits-enfants, inversez les rôles : l'enfant lit la liste, le grand-parent cherche. C'est une activité intergénérationnelle qui ne demande ni écran enfant ni compétition scolaire, juste du vocabulaire partagé autour d'une grille Seniors.",
    ],
  },
  {
    id: "ehpad",
    title: "Animation en EHPAD et en maison de retraite",
    paragraphs: [
      "Les animateurs d'EHPAD recherchent des activités collectives courtes, inclusives et peu coûteuses. Les mots mêlés cochètent ces cases : distribution de grilles différentes pour limiter la triche, correction collective au corrigé, reprise orale des mots restants pour solliciter la mémoire sémantique du groupe.",
      "Privilégiez le grand format imprimé en A4 et des listes de huit à douze mots pour une séance d'une trentaine de minutes. Les thèmes saisonniers — Noël, printemps, fête des mères — ancrent l'animation dans le calendrier et relancent les conversations entre résidents.",
      "Adaptez la difficulté : une grille facile pour un atelier large, une grille moyenne pour un groupe habitué. Hibou&Mots reste gratuit : vous pouvez photocopier sans quota ni abonnement, un critère décisif pour les budgets d'activités en établissement.",
    ],
  },
  {
    id: "imprimables",
    title: "Grilles imprimables gratuites avec corrigé",
    paragraphs: [
      "Chaque puzzle Seniors se télécharge en PDF : la grille sur la première page, le corrigé sur la seconde. Imprimez en A4, noir et blanc, recto simple ou recto-verso selon votre imprimante. Activez le mode grand format avant l'export pour maximiser le confort visuel sur papier.",
      "Le hub Mots mêlés à imprimer regroupe aussi des grilles par thème, par fête ou par niveau de difficulté. La rubrique Seniors filtre naturellement vers des listes lisibles, mais vous pouvez explorer les grilles faciles ou moyennes du catalogue adulte si vous souhaitez plus de variété.",
      "Gardez une liasse de grilles pré-imprimées pour les jours sans connexion ou pour offrir une feuille à un visiteur. Le corrigé séparé permet une auto-correction discrète ou une relecture aidée par un proche, selon le besoin du moment.",
    ],
  },
]

/** Internal links surfaced on the Seniors authority hub. */
export const SENIORS_HUB_LINKS = [
  { href: ROUTES.imprimer, label: "Mots mêlés à imprimer" },
  { href: ROUTES.gratuits, label: "Catalogue gratuit" },
  { href: ROUTES.jouer, label: "Jouer en ligne" },
  { href: ROUTES.generateur, label: "Générateur de grilles" },
  { href: ROUTES.adultes, label: "Mots mêlés Adultes" },
  { href: ROUTES.difficulteHub, label: "Hub Difficulté" },
  { href: difficultyPath("facile"), label: "Grilles faciles" },
  { href: difficultyPath("moyen"), label: "Grilles moyennes" },
  { href: ROUTES.thematiquesHub, label: "Mots mêlés thématiques" },
  { href: ROUTES.presseHub, label: "Journaux & magazines" },
  { href: ROUTES.fetesHub, label: "Fêtes & saisons" },
] as const

/** Flat copy for word-count audits (intro + sections + link labels + FAQ). */
export function seniorsEditorialPlainText(): string {
  const sections = SENIORS_SECTIONS.flatMap((section) => [
    section.title,
    ...section.paragraphs,
  ]).join(" ")
  const links = SENIORS_HUB_LINKS.map((link) => link.label).join(" ")
  const faq = SENIORS_FAQ.flatMap((item) => [item.question, item.answer]).join(" ")
  return [SENIORS_INTRO, sections, links, faq].join(" ")
}
