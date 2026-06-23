import type { FaqItem } from "@/lib/db/types/page-data"
import { ROUTES, gradePath, themePath } from "@/lib/seo/routes"

/** Unique editorial intro for /mots-meles-thematiques/vocabulaire/ — thème École (~300 words). */
export const VOCABULAIRE_INTRO = [
  "Le thème Vocabulaire de Hibou&Mots — au croisement de l'école et du programme de français — propose des mots mêlés gratuits pour consolider le lexique scolaire. Chaque grille invite à retrouver les mots outils que l'enfant manipule chaque jour : un mot à lire, une phrase à comprendre, une lettre à reconnaître, une syllabe à découper. Les listes s'ouvrent sur l'orthographe, la lecture, la grammaire, la conjugaison et le dictionnaire — autant de repères du vocabulaire scolaire que les enseignants retrouvent dans les cahiers de CP, de CE1 et de CE2.",
  "Ces puzzles transforment la révision lexicale en jeu de mots cachés : écrire un mot repéré, relire une phrase construite avec, vérifier une forme dans le dictionnaire de classe. Trouver un mot caché ancre la graphie du mot entier et soutient l'apprentissage de la lecture sans lourdeur de copie. Le thème convient au cycle 2 et au cycle 3 : mots courts d'abord, puis orthographe, grammaire ou conjugaison lorsque l'élève lit couramment.",
  "En classe, les enseignants distribuent une grille après une leçon de vocabulaire, en échauffement de séance de français ou en devoir maison ciblé sur les mots de la semaine. Les familles impriment un PDF pour réviser avant une évaluation ou accompagner les devoirs du soir. Chaque puzzle se joue en ligne ou s'exporte en PDF A4 avec corrigé, en noir et blanc pour une impression économique.",
  "Hibou&Mots reste gratuit, sans inscription. Explorez aussi le hub École pour croiser vocabulaire et niveau scolaire, la page Pédagogie pour les repères par cycle, ou le générateur pour composer une fiche avec les mots exacts travaillés en classe.",
].join("\n\n")

export const VOCABULAIRE_META_DESCRIPTION =
  "Mots mêlés école et vocabulaire scolaire gratuits : lecture, écriture, orthographe, grammaire, conjugaison, dictionnaire. Jeux de mots cachés pour le primaire — à imprimer ou à jouer en ligne."

export const VOCABULAIRE_FAQ: FaqItem[] = [
  {
    question: "Quel type de mots trouve-t-on sur la page Vocabulaire ?",
    answer:
      "Les listes mêlent mots outils et repères du français : mot, lire, écrire, phrase, lettre, syllabe, orthographe, lecture, grammaire, dictionnaire, vocabulaire ou conjugaison.",
  },
  {
    question: "Comment utiliser les grilles Vocabulaire en classe ?",
    answer:
      "Distribuez une grille Vocabulaire après une leçon de lexique ou en fin de séance de français pour consolider les mots travaillés dans la semaine.",
  },
  {
    question: "Ce thème Vocabulaire est-il aligné sur le programme de français ?",
    answer:
      "Oui, les listes reprennent le vocabulaire scolaire courant du primaire — lecture, écriture, grammaire — sans être liées à un manuel précis.",
  },
  {
    question: "Peut-on jouer en ligne ou imprimer les mots mêlés Vocabulaire ?",
    answer:
      "Les deux modes sont disponibles sur la rubrique Vocabulaire : partie en ligne ou PDF A4 avec corrigé pour la maison et la classe.",
  },
  {
    question: "Existe-t-il des grilles Vocabulaire par niveau scolaire ?",
    answer:
      "Oui, croisez le thème avec un niveau via le hub École — CP, CE1, CE2 — ou choisissez une difficulté adaptée à la classe.",
  },
]

export const VOCABULAIRE_EXPLORE_LINK_LABELS = [
  { href: ROUTES.ecoleHub, label: "Mots mêlés École", hint: "Tous les niveaux de la maternelle à la 6e" },
  { href: ROUTES.pedagogie, label: "Guide pédagogique", hint: "Repères cycles et usages en classe" },
  { href: gradePath("cp"), label: "Mots mêlés CP", hint: "Premiers mots outils en 8×8" },
  { href: gradePath("ce1"), label: "Mots mêlés CE1", hint: "Vocabulaire cycle 2 en 10×10" },
  { href: ROUTES.ressources, label: "Ressources enseignants", hint: "Fiches prêtes pour la classe" },
  { href: ROUTES.imprimer, label: "Mots mêlés à imprimer", hint: "PDF A4 avec corrigé" },
  { href: ROUTES.generateur, label: "Générateur de grilles", hint: "Composez la liste de la semaine" },
  { href: themePath("couleurs"), label: "Thème Couleurs", hint: "Variez avec un autre thème École" },
] as const
