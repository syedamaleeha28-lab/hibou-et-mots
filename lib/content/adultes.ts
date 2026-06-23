import type { FaqItem } from "@/lib/db/types/page-data"
import { ROUTES, difficultyPath } from "@/lib/seo/routes"

/** Authority hub intro for /mots-meles-adultes/ */
export const ADULTES_INTRO = [
  "Les mots mêlés ne sont pas réservés à l'école : des millions d'adultes y jouent pour se détendre, défier leur vocabulaire ou occuper un trajet en transport. Cette page Adultes regroupe des grilles plus exigeantes — listes denses, directions variées, puzzles géants — avec des thèmes de culture générale, de loisirs et de vocabulaire pointu.",
  "Hibou&Mots propose des mots mêlés gratuits à imprimer en PDF avec corrigé ou à jouer en ligne, sans inscription. Que vous cherchiez une pause calme après le travail, un défi du week-end ou une grille façon magazine à résoudre sur le canapé, vous trouverez ici le bon niveau de difficulté et des liens vers les rubriques thématiques du catalogue.",
].join("\n\n")

export const ADULTES_META_DESCRIPTION =
  "Mots mêlés Adultes : détente, défi de vocabulaire, culture générale et grilles difficiles ou géantes. Puzzles gratuits à imprimer ou à jouer en ligne."

export const ADULTES_FAQ: FaqItem[] = [
  {
    question: "En quoi les grilles Adultes diffèrent-elles des grilles enfants ?",
    answer:
      "La rubrique Mots mêlés Adultes propose des listes plus longues, des grilles plus grandes et un vocabulaire plus exigeant — du niveau moyen au géant, avec toutes les directions de lecture.",
  },
  {
    question: "Les mots mêlés Adultes conviennent-ils à la détente ?",
    answer:
      "Oui, la page Adultes met en avant des grilles pour une pause sans chronomètre : rythme libre, thèmes variés, impression papier ou jeu en ligne selon votre humeur.",
  },
  {
    question: "Où trouver les grilles les plus difficiles pour adultes ?",
    answer:
      "Sur la page Adultes, explorez les niveaux Difficile et Géant : grilles 12×12 à 20×20, mots inversés et listes de quinze à vingt-cinq entrées pour les joueurs confirmés.",
  },
  {
    question: "Peut-on travailler sa culture générale avec ces puzzles ?",
    answer:
      "Oui, les grilles Adultes croisent des thèmes géographie, vocabulaire, sport ou presse — idéal pour réviser un lexique varié tout en jouant.",
  },
  {
    question: "Faut-il jouer en ligne ou imprimer les grilles Adultes ?",
    answer:
      "Les deux : le PDF Adultes convient au canapé ou au café ; le mode en ligne évite l'imprimante et permet de surligner les mots trouvés directement dans le navigateur.",
  },
]

export type AdultesSection = {
  id: string
  title: string
  eyebrow?: string
  paragraphs: string[]
}

export const ADULTES_SECTIONS: AdultesSection[] = [
  {
    id: "detente",
    eyebrow: "Bien-être",
    title: "Détente et pause sans écran agressif",
    paragraphs: [
      "Après une journée de travail ou entre deux rendez-vous, une grille de mots mêlés offre une coupure nette : pas de fil d'actualité, pas de notification, juste une liste et des lettres à parcourir. Le rythme vous appartient — vous pouvez poser la feuille, revenir une heure plus tard, reprendre là où vous en étiez.",
      "Contrairement aux jeux vidéo stimulants ou aux réseaux sociaux, le mot mêlé adulte sollicite l'attention de façon continue mais calme. C'est une forme de relaxation active : le cerveau travaille sans l'adrénaline d'un chrono ou d'un classement en ligne.",
      "Imprimez une grille pour la table de la cuisine, ou ouvrez une partie en ligne sur tablette avec une luminosité modérée. Dix à trente minutes suffisent pour sentir la bascule vers un état plus serein, surtout si vous choisissez un thème qui vous plaît — nature, cuisine, voyages.",
    ],
  },
  {
    id: "vocabulaire",
    title: "Défi de vocabulaire pour joueurs curieux",
    paragraphs: [
      "Les listes Adultes incluent des mots plus longs, des termes spécialisés ou des expressions moins courantes que les grilles du primaire. Retrouver « astronomie », « architecture » ou « gastronomie » dans une grille 15×15 demande une lecture attentive et enrichit le lexique actif, même chez les francophones confirmés.",
      "Pour pousser le défi, enchaînez plusieurs grilles d'un même thème — par exemple Sport puis Football — ou composez votre propre liste avec le générateur : noms propres, jargon professionnel, mots d'une série télé. Chaque mot trouvé fixe une forme orthographique que vous n'écrivez peut-être jamais au quotidien.",
      "Les niveaux Moyen et Difficile sur la rubrique Adultes calibrent la densité : commencer par huit à dix mots, monter vers quinze quand la liste semble trop courte. Le plaisir vient autant de la découverte lexicale que de la résolution proprement dite.",
    ],
  },
  {
    id: "culture-generale",
    title: "Culture générale et curiosité thématique",
    paragraphs: [
      "Les mots mêlés thématiques transforment le jeu en mini-révision de culture générale : pays du monde, météo, famille de mots, fêtes de l'année. Une grille Noël ou Halloween mélange vocabulaire festif et repérage visuel ; une grille géographie remet en circulation des capitales et des fleuves oubliés depuis le collège.",
      "Les amateurs de presse retrouveront un esprit proche des pages jeux des magazines — d'où la rubrique Journaux & magazines du site, qui reprend des titres familiers. Ce format papier ou numérique convient aux adultes qui lisaient déjà des mots croisés le dimanche matin.",
      "En groupe — apéritif, pause café au bureau —, lisez la liste à tour de rôle et chronométrez amicalement le dernier mot. La culture générale devient sociale sans transformer la soirée en quiz compétitif.",
    ],
  },
  {
    id: "loisir",
    title: "Activité de loisir : seul, en duo ou en voyage",
    paragraphs: [
      "Le mot mêlé est un loisir portable : une feuille pliée dans le sac, un PDF sur liseuse, une partie en ligne dans le train. Peu de matériel, des règles connues, une durée flexible — trois critères qui expliquent la popularité du jeu chez les adultes actifs.",
      "En duo, un joueur lit la liste pendant l'autre cherche ; en solo, vous gérez votre stratégie (mots longs d'abord ou mots rares en priorité). Certains gardent un classement personnel des grilles terminées dans le mois, d'autres alternent simplement avec sudoku ou mots croisés.",
      "Les grilles Adultes complètent les rubriques Enfants et Seniors : plus denses que les premières, sans le grand format systématique des secondes. Vous choisissez le registre qui correspond à votre moment — challenge intellectuel ou détente légère.",
    ],
  },
  {
    id: "difficile",
    title: "Grilles difficiles : toutes directions et mots inversés",
    paragraphs: [
      "Le niveau Difficile s'adresse aux adultes qui maîtrisent déjà les grilles moyennes : cases 12×12 à 15×15, douze à quinze mots, directions horizontales inversées, verticales inversées et diagonales dans tous les sens. La grille devient un vrai labyrinthe de lettres.",
      "La difficulté ne vient pas seulement de la taille : les listes mélangent mots courts et longs, ce qui force à changer de stratégie en cours de route. Un mot de trois lettres peut rester invisible entre deux mots de douze caractères — d'où l'intérêt de surligner méthodiquement ligne par ligne.",
      "Imprimez le corrigé sur une page séparée pour ne pas spoiler votre progression, ou jouez en ligne pour bénéficier du surlignage automatique. Si une grille Difficile Adultes vous résiste, notez les mots restants et revenez le lendemain : parfois le regard neuf débloque la partie.",
    ],
  },
  {
    id: "geant",
    title: "Grilles géantes pour experts et longues soirées",
    paragraphs: [
      "Le niveau Géant pousse le format jusqu'à 18×18 ou 20×20, avec dix-huit à vingt-cinq mots et toutes les directions autorisées. C'est le défi ultime du catalogue Hibou&Mots pour les adultes passionnés qui recherchent une grille longue, comparable aux puzzles des magazines spécialisés.",
      "Prévoyez trente minutes à plus d'une heure selon votre habitude. Certaines personnes découpent la session en deux : moitié de la liste le soir, moitié le lendemain matin. Le format géant convient aussi aux vacances, lorsque le temps manque moins et que l'on veut un projet ludique sans écran vidéo.",
      "Combinez une grille Géant avec un thème exigeant — vocabulaire pointu, presse, sport olympique — pour maximiser le challenge. Si vous débutez sur la rubrique Adultes, progressez d'abord par les niveaux Moyen puis Difficile avant d'attaquer le géant : la courbe de plaisir reste plus régulière.",
    ],
  },
]

/** Internal links surfaced on the Adults authority hub. */
export const ADULTES_HUB_LINKS = [
  { href: ROUTES.imprimer, label: "Mots mêlés à imprimer" },
  { href: ROUTES.gratuits, label: "Catalogue gratuit" },
  { href: ROUTES.jouer, label: "Jouer en ligne" },
  { href: ROUTES.generateur, label: "Générateur de grilles" },
  { href: ROUTES.seniors, label: "Mots mêlés Seniors" },
  { href: ROUTES.enfants, label: "Mots mêlés Enfants" },
  { href: ROUTES.difficulteHub, label: "Hub Difficulté" },
  { href: difficultyPath("moyen"), label: "Grilles moyennes" },
  { href: difficultyPath("difficile"), label: "Grilles difficiles" },
  { href: difficultyPath("geant"), label: "Grilles géantes" },
  { href: ROUTES.thematiquesHub, label: "Mots mêlés thématiques" },
  { href: ROUTES.presseHub, label: "Journaux & magazines" },
  { href: ROUTES.fetesHub, label: "Fêtes & saisons" },
] as const

/** Flat copy for word-count audits (intro + sections + link labels + FAQ). */
export function adultesEditorialPlainText(): string {
  const sections = ADULTES_SECTIONS.flatMap((section) => [
    section.title,
    ...section.paragraphs,
  ]).join(" ")
  const links = ADULTES_HUB_LINKS.map((link) => link.label).join(" ")
  const faq = ADULTES_FAQ.flatMap((item) => [item.question, item.answer]).join(" ")
  return [ADULTES_INTRO, sections, links, faq].join(" ")
}
