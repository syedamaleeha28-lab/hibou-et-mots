import type { FaqItem } from "@/lib/db/types/page-data"
import { ROUTES, gradePath } from "@/lib/seo/routes"

/** Authority hub intro for /mots-meles-pedagogie/ */
export const PEDAGOGIE_INTRO = [
  "Les mots mêlés occupent une place singulière dans l'apprentissage du français au primaire : ils transforment une liste de vocabulaire scolaire en chasse aux lettres, sans l'effort perçu d'une fiche d'exercices classique. Cette page rassemble les repères pédagogiques pour enseignants et parents — alignés sur les cycles de l'Éducation nationale, du Cycle 1 au Cycle 3 — avec des liens directs vers les grilles calibrées pour chaque classe.",
  "Hibou&Mots propose des puzzles gratuits, imprimables en PDF avec corrigé ou jouables en ligne, pensés pour accompagner l'apprentissage de la lecture, l'orthographe et la compréhension écrite. Que vous prépariez une séance de français, un devoir maison ou un moment calme le week-end, vous trouverez ici le cadre pédagogique pour choisir la bonne grille et en tirer le maximum pour vos élèves ou vos enfants.",
].join("\n\n")

export const PEDAGOGIE_META_DESCRIPTION =
  "Guide pédagogique des mots mêlés : cycles Éducation nationale, vocabulaire scolaire, apprentissage de la lecture et compréhension écrite. Conseils pour la classe et la maison, du CP au CM2."

export const PEDAGOGIE_FAQ: FaqItem[] = [
  {
    question: "En quoi les mots mêlés aident-ils à apprendre le français ?",
    answer:
      "La page Pédagogie détaille comment les mots mêlés combinent repérage visuel, mémorisation de la forme du mot entier et répétition douce du vocabulaire — trois leviers qui soutiennent la lecture et l'orthographe au primaire.",
  },
  {
    question: "Quelle grille choisir pour le CP, le CE1 ou le CM2 ?",
    answer:
      "Le guide Pédagogie renvoie vers chaque niveau : le CP privilégie des grilles 8×8, le CE1 et le CE2 montent en 10×10, le CM1 et le CM2 accueillent des grilles 12×12 avec diagonales.",
  },
  {
    question: "Peut-on utiliser les mots mêlés en classe sans préparation longue ?",
    answer:
      "Oui : la rubrique Pédagogie recommande d'imprimer un PDF avec corrigé ou d'utiliser le générateur gratuit avec le vocabulaire de la semaine pour une fiche sur mesure en quelques minutes.",
  },
  {
    question: "Les ressources pédagogiques Hibou&Mots sont-elles gratuites ?",
    answer:
      "Oui, la page Pédagogie, les grilles par niveau, le générateur et le jeu en ligne restent accessibles sans inscription ni abonnement.",
  },
  {
    question: "Comment les parents peuvent-ils s'en servir à la maison ?",
    answer:
      "La section Pédagogie conseille une grille courte après les devoirs, la lecture de la liste à voix haute ou une partie en ligne — pour consolider le vocabulaire travaillé à l'école dans un cadre ludique.",
  },
]

export type PedagogieSection = {
  id: string
  title: string
  eyebrow?: string
  paragraphs: string[]
}

export const PEDAGOGIE_SECTIONS: PedagogieSection[] = [
  {
    id: "bienfaits",
    eyebrow: "Fondamentaux",
    title: "Les bienfaits des mots mêlés pour l'apprentissage",
    paragraphs: [
      "Un mot mêlé demande à l'enfant de maintenir une consigne simple — retrouver des mots dans une grille — pendant plusieurs minutes. Cette tâche unique, répétée régulièrement, entraîne la persévérance et donne un sentiment de réussite immédiat : chaque mot trouvé est une micro-victoire visible, surlignée ou cochée sur la liste.",
      "Contrairement à une dictée ou à une fiche de grammaire, le jeu masque l'effort cognitif. L'élève mobilise pourtant plusieurs registres : il lit la liste, compare les lettres, vérifie l'ordre, parfois lit le mot à l'envers ou en diagonale. Cette polyvalence fait des mots mêlés un support transversal, utile en français mais aussi en heure de vie de classe ou en accompagnement différencié.",
      "Les enseignants les utilisent souvent comme activité d'accueil, de révision lexicale ou de calme après une séance plus exigeante. Les parents y voient un compromis sain entre écran et papier : une grille imprimée occupe vingt minutes sans notification, tandis que la version en ligne convient aux trajets ou aux soirées pluvieuses.",
    ],
  },
  {
    id: "vocabulaire",
    title: "Développer le vocabulaire avec les mots mêlés",
    paragraphs: [
      "Le vocabulaire scolaire progresse par thèmes — animaux, saisons, corps humain, géographie — et par niveau de lecture. Une grille thématique fixe l'orthograpie de chaque entrée lexicale dans un contexte cohérent : l'enfant ne mémorise pas un mot isolé, mais un mot situé dans un univers qu'il connaît déjà grâce aux leçons ou aux albums lus en classe.",
      "Pour consolider une leçon, composez une liste alignée sur le programme de la semaine. Le générateur Hibou&Mots accepte vos propres mots : dix entrées suffisent pour une fiche ciblée. En fin de séance, relisez collectivement les mots non trouvés : l'erreur de repérage devient occasion de répéter la forme correcte à voix haute.",
      "Au CE1 et au CE2, les listes peuvent inclure des champs lexicaux plus larges — synonymes, familles de mots, termes scientifiques simplifiés. Au CM1 et au CM2, introduisez des mots polysyllabiques ou des expressions figées pour préparer le vocabulaire exigé au collège. Chaque niveau dispose d'une rubrique dédiée pour choisir une grille déjà calibrée.",
    ],
  },
  {
    id: "lecture",
    title: "Améliorer la lecture grâce au repérage dans la grille",
    paragraphs: [
      "Trouver un mot dans une grille oblige à le lire comme une unité, pas seulement à le décoder syllabe par syllabe. L'enfant parcourt les lettres dans l'ordre, parfois en sens inverse, et doit reconnaître la chaîne complète — une compétence proche de la lecture fluide de mots outils au CP et du repérage rapide de morphèmes au Cycle 3.",
      "Les premières années du primaire bénéficient de listes courtes et de grilles compactes. Un élève de CP qui cherche « chat » ou « maison » dans une grille 8×8 travaille la correspondance graphème-phonème sans surcharge visuelle. Plus tard, des mots plus longs et des directions variées sollicitent la lecture silencieuse et la relecture contrôlée.",
      "Associez la grille à une phase de lecture à voix haute : l'adulte lit un mot de la liste, l'enfant le cherche. Ce binôme renforce l'écoute et la correspondance oral-écrit. En classe, projetez la liste pendant que les élèves travaillent sur papier pour soutenir ceux qui peinent encore sur le décodage.",
    ],
  },
  {
    id: "orthographe",
    title: "Soutenir l'orthographe et la mémorisation des formes",
    paragraphs: [
      "L'orthographe lexicale progresse quand l'enfant voit plusieurs fois la forme correcte d'un mot. Dans une grille, chaque lettre compte : une erreur de repérage l'oblige à recommencer, ce qui multiplie les expositions à la graphie normée sans corriger une copie rouge.",
      "Les mots lus en diagonale ou à l'envers renforcent la flexibilité visuelle : « table » lu de droite à gauche reste « table », et l'élève apprend que l'ordre des lettres est contraint. C'est un complément utile aux dictées préparées, surtout pour les homophones ou les mots à double consonne travaillés au CE2.",
      "Après la partie, demandez de réécrire de mémoire trois ou quatre mots trouvés. Cette étape courte transforme le jeu en ancrage orthographique explicite. Les enseignants peuvent aussi distribuer une grille différente par table pour limiter la triche lors d'une évaluation formative du lexique.",
    ],
  },
  {
    id: "concentration",
    title: "Entraîner la concentration et l'endurance attentionnelle",
    paragraphs: [
      "La durée d'une grille — dix à vingt minutes selon le niveau — correspond à une fenêtre attentionnelle réaliste pour un enfant du primaire. La tâche est claire, le feedback immédiat, et l'élève peut s'arrêter puis reprendre sans perdre le fil, ce qui favorise l'autorégulation.",
      "En classe bruyante, une fiche de mots mêlés crée un îlot de silence productif. Les élèves qui terminent une consigne principale peuvent enchaîner sur une grille de même niveau pendant que l'enseignant accompagne le reste du groupe. À la maison, c'est une alternative calme aux jeux vidéo rapides.",
      "Variez la difficulté pour éviter la frustration : une grille trop dense décourage un CP, une grille trop facile n'offre plus de défi à un CM2. Les pages par niveau indiquent la taille de grille et le type de directions proposées pour ajuster le temps de travail attendu.",
    ],
  },
  {
    id: "repérage-visuel",
    title: "Le repérage visuel et la lecture de l'espace",
    paragraphs: [
      "Parcourir une grille ligne par ligne, puis colonne par colonne, puis en diagonale, entraîne un balayage visuel méthodique. L'enfant apprend à structurer sa recherche au lieu de scanner au hasard — une compétence transférable à la lecture de tableaux, de cartes ou de documents illustrés.",
      "Les grilles plus grandes du CM1 et du CM2 demandent de planifier : faut-il commencer par les mots longs ou par ceux aux lettres rares ? Cette stratégisation légère introduit la résolution de problème sans formalisme mathématique.",
      "Pour les plus jeunes, des grilles en grandes cases réduisent la charge visuelle. Au fil des cycles, la densité augmente et prépare progressivement aux puzzles plus exigeants proposés aux adultes sur le site — toujours avec la même mécanique rassurante.",
    ],
  },
  {
    id: "classe",
    title: "Utiliser les mots mêlés en classe",
    paragraphs: [
      "Distribuez une grille en début de séance comme échauffement pendant l'accueil, ou en fin d'heure de français pour réviser le vocabulaire de la leçon. Imprimez le corrigé au verso ou sur une feuille séparée : la correction collective prend quelques minutes et permet de repérer les mots encore fragiles.",
      "Croisez un niveau et un thème saisonnier — par exemple CE1 × Noël — pour ancrer le lexique dans un contexte motivant. Les pages combinées niveau × thème facilitent ce travail sans préparation manuelle de la liste.",
      "Le générateur permet de créer une fiche avec les mots exacts travaillés cette semaine. Proposez des grilles différentes par groupe de niveau dans une même classe hétérogène : même consigne, listes adaptées au CP, au CE1 ou au CM2 selon les besoins.",
    ],
  },
  {
    id: "maison",
    title: "Les mots mêlés à la maison avec son enfant",
    paragraphs: [
      "À la maison, vingt minutes de mots mêlés après les devoirs offrent un rituel positif autour du français. Lisez la liste à voix haute avec votre enfant s'il débute en lecture ; laissez-le progresser seul s'il est autonome. Validez les trouvailles sans corriger chaque hésitation pour préserver le plaisir.",
      "Alternez papier et écran : imprimez un PDF pour le cahier de vacances, jouez en ligne lors d'un trajet. Les deux formats restent gratuits et sans compte obligatoire.",
      "Choisissez une grille calibrée sur le niveau réel de lecture plutôt que sur l'âge seul. Un élève de CE1 en consolidation peut rester un temps sur des listes CP ; un CM1 avancé appréciera les diagonales et les mots plus longs. Les rubriques Enfants et École regroupent les entrées par tranche d'âge et par classe.",
    ],
  },
]

/** Primary educational section links surfaced on the authority hub. */
export const PEDAGOGIE_EDUCATIONAL_LINKS = [
  { href: ROUTES.ecoleHub, label: "Mots mêlés École — tous les niveaux" },
  { href: gradePath("cp"), label: "Mots mêlés CP" },
  { href: gradePath("ce1"), label: "Mots mêlés CE1" },
  { href: gradePath("ce2"), label: "Mots mêlés CE2" },
  { href: gradePath("cm1"), label: "Mots mêlés CM1" },
  { href: gradePath("cm2"), label: "Mots mêlés CM2" },
  { href: ROUTES.enfants, label: "Mots mêlés Enfants" },
  { href: ROUTES.ressources, label: "Ressources enseignants" },
  { href: ROUTES.imprimer, label: "Mots mêlés à imprimer" },
  { href: ROUTES.generateur, label: "Générateur de grilles" },
  { href: ROUTES.jouer, label: "Jouer en ligne" },
] as const

export const PEDAGOGIE_GRADE_ROWS = [
  {
    slug: "cp",
    label: "CP",
    age: "6 ans",
    grid: "8×8",
    focus: "Premiers mots lus, horizontal et vertical",
  },
  {
    slug: "ce1",
    label: "CE1",
    age: "7 ans",
    grid: "10×10",
    focus: "Vocabulaire cycle 2, listes un peu plus longues",
  },
  {
    slug: "ce2",
    label: "CE2",
    age: "8 ans",
    grid: "10×10",
    focus: "Lexique enrichi, consolidation orthographique",
  },
  {
    slug: "cm1",
    label: "CM1",
    age: "9 ans",
    grid: "12×12",
    focus: "Diagonales, mots polysyllabiques",
  },
  {
    slug: "cm2",
    label: "CM2",
    age: "10 ans",
    grid: "12×12",
    focus: "Directions variées, préparation au collège",
  },
] as const

/** Flat copy for word-count audits (intro + sections + link labels). */
export function pedagogieEditorialPlainText(): string {
  const sections = PEDAGOGIE_SECTIONS.flatMap((section) => [
    section.title,
    ...section.paragraphs,
  ]).join(" ")
  const links = PEDAGOGIE_EDUCATIONAL_LINKS.map((link) => link.label).join(" ")
  const grades = PEDAGOGIE_GRADE_ROWS.flatMap((row) => [
    row.label,
    row.age,
    row.grid,
    row.focus,
  ]).join(" ")
  const faq = PEDAGOGIE_FAQ.flatMap((item) => [item.question, item.answer]).join(" ")
  return [PEDAGOGIE_INTRO, sections, links, grades, faq].join(" ")
}
