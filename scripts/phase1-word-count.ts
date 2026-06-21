import { PHASE1_FAQS } from "@/lib/content/phase1/faqs"
import { PHASE1_INTROS, countWords } from "@/lib/content/phase1/intros"
import { GENERATOR_FAQ, HOME_FAQ, ONLINE_PLAY_FAQ } from "@/lib/content/phase1/tools"
import type { FaqItem } from "@/lib/db/types/page-data"
import { gradeSeed } from "@/prisma/seed/grades"

function faqWords(faqs: FaqItem[]): number {
  return faqs.reduce((n, f) => n + countWords(`${f.question} ${f.answer}`), 0)
}

/** Visible editorial copy approximated from Phase 1 section components (headings + body + link labels). */
const SECTION_COPY = {
  gratuits:
    "Trois façons d'utiliser Hibou&Mots gratuitement Mode Idéal pour Accès Jouer en ligne Partie immédiate sans papier Imprimer en PDF Classe maison cahier d'activités Créer sa grille Vocabulaire personnalisé anniversaire Explorer par public Mots mêlés enfants Mots mêlés adultes Mots mêlés par niveau scolaire",
  imprimer:
    "Imprimer par thème ou par niveau Retrouvez des PDF prêts à imprimer classés par école par fête de l'année ou parmi toutes les grilles gratuites du catalogue Mots mêlés École CP à 6e Mots mêlés Fêtes & Saisons Toutes les grilles gratuites",
  ecole: [
    "Les 7 niveaux en un coup d'œil Niveau Âge Grille Page",
    ...gradeSeed.flatMap((g) => [g.name, g.ageRange, `${g.defaultGridSize}×${g.defaultGridSize}`, "Voir les grilles"]),
    "Pédagogie des mots mêlés Mots mêlés par thème Imprimer en PDF",
  ].join(" "),
  enfants:
    "Quelle grille pour quel âge Âge Niveau Grille type 3–5 ans Maternelle 6×6 mots courts 6–8 ans CP CE1 8×8 à 10×10 9–12 ans CM2 12×12 diagonales Tous les niveaux scolaires Grilles de fêtes et saisons Thème Animaux idéal pour les enfants",
  home:
    "Des mots mêlés gratuits pour toute la famille Hibou&Mots réunit des grilles en français pour l'école les thèmes du quotidien et les fêtes de l'année du CP à la 6e et aussi pour les adultes et les seniors Chaque grille est jouable en ligne ou imprimable en PDF avec corrigé Les puzzles sont organisés par niveau scolaire maternelle CP CE1 CE2 CM1 CM2 6e par thème animaux sport vocabulaire géographie et par saison Noël Halloween Pâques Parents et enseignants trouvent en quelques secondes une activité adaptée au programme de français à la dictée et à l'apprentissage du vocabulaire Les passionnés de mots mêlés adultes et seniors trouvent également des grilles plus denses avec un mode grand format pour une lecture confortable Tout reste gratuit sans inscription et sans publicité intrusive sur les pages de jeu Pourquoi les mots mêlés aident à apprendre Un jeu qui renforce la lecture l'orthographe et le repérage visuel au primaire comme au collège Trouver un mot dans la grille oblige l'enfant à mémoriser sa forme visuelle complète ce qui complète la lecture syllabique et la dictée En classe comme à la maison c'est une activité calme qui convient aux cycles 2 et 3 du primaire et prépare progressivement le vocabulaire exigé au collège Comment choisir la bonne grille Trois repères simples l'âge le thème ou l'occasion Par âge Maternelle CP CE1 choisissez un niveau scolaire adapté au cycle de votre enfant Par thème Animaux sport vocabulaire parcourez les mots mêlés thématiques Par occasion Noël Halloween rentrée explorez les fêtes et saisons Parcourir par catégorie Mots mêlés gratuits Imprimer une grille PDF Jouer en ligne Créer ma grille Mots mêlés École Mots mêlés par thème Fêtes & saisons Journaux & magazines",
  generator:
    "Pour qui est fait ce générateur Trois usages concrets du primaire aux adultes Enseignant préparez une fiche de vocabulaire de la semaine avec les mots travaillés en classe Parent créez une grille avec le prénom des invités pour un anniversaire à thème Adulte composez un défi inédit avec un vocabulaire personnalisé et une taille de grille ajustée Conseils pour une bonne grille Maternelle et CP 6 à 8 mots courts CE1 CE2 8 à 10 mots CM1 CM2 mots plus longs avec diagonales Utilisez le mode grand format pour une meilleure lisibilité",
  online:
    "Jouez dans votre navigateur Sans téléchargement ni installation ordinateur tablette ou smartphone Cliquez sur la première puis la dernière lettre d'un mot pour le sélectionner Comment jouer en 3 étapes Repérez un mot dans la liste puis cherchez-le dans la grille Cliquez la première et la dernière lettre pour le sélectionner Cochez les mots trouvés jusqu'à remplir toute la liste En ligne ou à imprimer Le jeu en ligne est instantané et sans papier idéal à la maison L'impression convient mieux à la classe ou aux trajets sans écran",
} as const

const pages: Array<[string, number]> = [
  ["/", countWords(SECTION_COPY.home) + faqWords(HOME_FAQ)],
  [
    "/mots-meles-gratuits/",
    countWords(PHASE1_INTROS["hub-gratuits"]) +
      faqWords(PHASE1_FAQS["hub-gratuits"]) +
      countWords(SECTION_COPY.gratuits),
  ],
  [
    "/mots-meles-a-imprimer/",
    countWords(PHASE1_INTROS["hub-imprimer"]) +
      faqWords(PHASE1_FAQS["hub-imprimer"]) +
      countWords(SECTION_COPY.imprimer),
  ],
  [
    "/mots-meles-ecole/",
    countWords(PHASE1_INTROS["hub-ecole"]) +
      faqWords(PHASE1_FAQS["hub-ecole"]) +
      countWords(SECTION_COPY.ecole),
  ],
  [
    "/mots-meles-enfants/",
    countWords(PHASE1_INTROS.enfants) +
      faqWords(PHASE1_FAQS.enfants) +
      countWords(SECTION_COPY.enfants),
  ],
  ["/generateur-mots-meles/", countWords(SECTION_COPY.generator) + faqWords(GENERATOR_FAQ)],
  ["/jouer-mots-meles-en-ligne/", countWords(SECTION_COPY.online) + faqWords(ONLINE_PLAY_FAQ)],
]

console.log("path\twords")
for (const [path, words] of pages) {
  console.log(`${path}\t${words}`)
}
