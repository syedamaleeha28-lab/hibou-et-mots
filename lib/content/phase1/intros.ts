/** Phase 1 Critical — expanded intro copy (paragraphs joined with \n\n). */

import { getThemeIntro } from "../themes"

export const PHASE1_INTROS: Record<string, string> = {
  "hub-gratuits":
    "Toutes les grilles de mots mêlés proposées sur Hibou&Mots sont gratuites, sans limite et sans création de compte. Que vous cherchiez une grille à imprimer pour occuper un enfant pendant les vacances, un exercice de vocabulaire pour la classe, ou un moment de détente entre adultes, vous trouverez ici des centaines de puzzles en français, classés par âge, thème et niveau de difficulté.\n\nGratuit ne veut pas dire limité : le jeu en ligne, l'export PDF avec corrigé et le générateur de grilles personnalisées sont inclus sans palier payant. Aucune publicité intrusive ne vient perturber la partie — libre accès, téléchargement illimité, sans inscription.",

  "hub-imprimer":
    "Toutes les grilles Hibou&Mots sont imprimables gratuitement au format PDF, prêtes à l'emploi pour la maison comme pour la classe. Chaque fichier comprend la grille de mots mêlés sur la première page et son corrigé sur la seconde, en format A4 standard, pensé pour l'impression noir et blanc afin d'économiser l'encre.\n\nComment imprimer une grille en trois étapes : choisissez un jeu de mots cachés dans une catégorie thématique ou scolaire, téléchargez le PDF depuis la page du puzzle, puis imprimez en A4. Les enseignants peuvent distribuer plusieurs grilles différentes lors d'une même séance — idéal pour un cahier d'activités ou une fiche de vocabulaire.",

  enfants:
    "Conçues spécialement pour les enfants de 3 à 12 ans, ces grilles de mots mêlés associent plaisir du jeu et apprentissage du vocabulaire français. Les plus jeunes commencent avec des grilles 6×6 en grandes lettres ; la difficulté progresse ensuite jusqu'au CM2 avec des mots plus longs, des diagonales et un vocabulaire de lecture courante.\n\nLes mots mêlés favorisent la concentration, la motricité fine lors du repérage visuel et la mémorisation orthographique du mot entier — un complément ludique à la lecture et à la dictée au primaire. Chaque grille peut être imprimée pour la maison ou la classe, ou jouée directement en ligne.",

  "hub-ecole":
    "Retrouvez des grilles de mots mêlés calibrées pour chaque niveau scolaire, de la maternelle au collège. La taille de la grille, la longueur des mots et les directions de lecture évoluent avec les progrès de l'enfant : 6×6 en grandes lettres pour les tout-petits, jusqu'à 15×15 avec mots inversés pour la 6e. Chaque page de niveau propose un vocabulaire aligné sur le programme français du primaire et du début de collège.\n\nUtiliser ces grilles en classe : distribuez une fiche de vocabulaire de la semaine, proposez une activité calme en fin de séance ou croisez un thème saisonnier avec le niveau de vos élèves. Les enseignants peuvent imprimer librement les PDF avec corrigé pour corriger rapidement les copies.",
}

export function themeCategoryIntro(themeName: string): string {
  return `Explore des grilles de mots mêlés sur le thème ${themeName} : un jeu de mots cachés et puzzle de mots pour enrichir le vocabulaire en s'amusant. Chaque grille de lettres se joue en ligne ou s'imprime gratuitement.`
}

export function seasonalCategoryIntro(themeName: string): string {
  return `Des grilles festives de mots mêlés sur le thème ${themeName} — jeux de mots cachés et puzzles de mots pour la maison ou la classe, un jeu de lettres calme à partager en famille.`
}

export function getPhase1Intro(slug: string): string | undefined {
  return getThemeIntro(slug) ?? PHASE1_INTROS[slug]
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}
