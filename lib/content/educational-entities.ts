/** Educational entity phrases and cycle copy for SEO / E-E-A-T on school-facing pages. */

export type EducationalCycleBlock = {
  id: "cycle-1" | "cycle-2" | "cycle-3"
  title: string
  paragraphs: string[]
}

export const ECOLE_HUB_CYCLE_INTRO =
  "Des grilles alignées sur les cycles de l'Éducation nationale — maternelle, primaire et début de collège — avec un vocabulaire scolaire adapté à chaque étape de l'apprentissage de la lecture."

export const ECOLE_CYCLE_BLOCKS: EducationalCycleBlock[] = [
  {
    id: "cycle-1",
    title: "Cycle 1 — Éveil et découverte",
    paragraphs: [
      "En maternelle, les grilles courtes en grandes lettres favorisent le premier contact avec l'écrit. Les mots restent très courts ; l'objectif est le plaisir de retrouver une forme connue, pas la vitesse. Les enseignants s'en servent pour introduire le vocabulaire scolaire de la classe, les prénoms ou les thèmes de la semaine sans imposer une lecture fluide immédiate.",
    ],
  },
  {
    id: "cycle-2",
    title: "Cycle 2 — Apprentissages fondamentaux",
    paragraphs: [
      "Du CP au CE2, les grilles accompagnent l'apprentissage de la lecture et le vocabulaire scolaire thématique (animaux, saison, classe). Les diagonales apparaissent progressivement ; les listes reprennent des mots outils et des champs lexicaux du programme de français. En CP et CE1, privilégiez des listes courtes liées à la lecture quotidienne ; au CE2, allongez les mots et autorisez les directions croisées pour consolider l'orthographe visuelle.",
    ],
  },
  {
    id: "cycle-3",
    title: "Cycle 3 — Consolidation au primaire",
    paragraphs: [
      "En CM1 et CM2, les grilles deviennent plus denses : mots plus longs, directions variées, vocabulaire de culture générale. Idéal pour une activité de fin de séance ou un devoir maison ciblé sur un thème de la semaine. Les élèves entraînent aussi la compréhension écrite en relisant la liste et en vérifiant le sens des mots trouvés — une préparation légère aux attentes du collège.",
    ],
  },
]

export const RESSOURCES_ENSEIGNANTS_INTRO = [
  "Des ressources prêtes à l'emploi pour animer vos cours avec des mots mêlés par niveau et par thème — calibrées sur les cycles de l'Éducation nationale et le vocabulaire scolaire du primaire.",
  "Imprimez une grille en fin de séance, croisez un thème avec le CP ou le CM2, ou composez une liste sur mesure avec le générateur. Chaque activité peut soutenir l'apprentissage de la lecture et la compréhension écrite sans alourdir votre préparation.",
].join("\n\n")

/** Plain text for audits — hub-ecole phase-2 cycle section. */
export function ecoleCyclePlainText(): string {
  return [ECOLE_HUB_CYCLE_INTRO, ...ECOLE_CYCLE_BLOCKS.flatMap((b) => [b.title, ...b.paragraphs])].join(
    " ",
  )
}
