import { ANIMAUX_EXPLORE_LINK_LABELS } from "./animaux"
import { CARNAVAL_EXPLORE_LINK_LABELS } from "./carnaval"
import { COULEURS_EXPLORE_LINK_LABELS } from "./couleurs"
import { CORPS_HUMAIN_EXPLORE_LINK_LABELS } from "./corps-humain"
import { ETE_EXPLORE_LINK_LABELS } from "./ete"
import { FAMILLE_EXPLORE_LINK_LABELS } from "./famille"
import { FRUITS_EXPLORE_LINK_LABELS } from "./fruits"
import { HALLOWEEN_EXPLORE_LINK_LABELS } from "./halloween"
import { METEO_EXPLORE_LINK_LABELS } from "./meteo"
import { METIERS_EXPLORE_LINK_LABELS } from "./metiers"
import { NOEL_EXPLORE_LINK_LABELS } from "./noel"
import { PAQUES_EXPLORE_LINK_LABELS } from "./paques"
import { PAYS_DU_MONDE_EXPLORE_LINK_LABELS } from "./pays-du-monde"
import { PRINTEMPS_EXPLORE_LINK_LABELS } from "./printemps"
import { RENTREE_EXPLORE_LINK_LABELS } from "./rentree"
import { SCIENCES_EXPLORE_LINK_LABELS } from "./sciences"
import { SPORT_EXPLORE_LINK_LABELS } from "./sport"
import { VOCABULAIRE_EXPLORE_LINK_LABELS } from "./vocabulaire"

export type ThemeExploreLink = {
  href: string
  label: string
  hint: string
}

export type ThemeExploreConfig = {
  title: string
  intro: string
  links: readonly ThemeExploreLink[]
}

const THEME_EXPLORE_CONFIGS: Record<string, ThemeExploreConfig> = {
  animaux: {
    title: "Explorer les mots mêlés Animaux",
    intro:
      "Poursuivez avec des grilles calibrées par âge, des PDF prêts à imprimer ou une partie en ligne — toujours autour du vocabulaire animaux.",
    links: ANIMAUX_EXPLORE_LINK_LABELS,
  },
  fruits: {
    title: "Explorer les mots mêlés Fruits",
    intro:
      "Poursuivez avec des grilles par niveau, des PDF sur l'alimentation ou d'autres thèmes nature.",
    links: FRUITS_EXPLORE_LINK_LABELS,
  },
  sport: {
    title: "Explorer les mots mêlés Sport",
    intro:
      "Poursuivez avec des grilles par niveau, le thème Football ou d'autres activités sportives à imprimer.",
    links: SPORT_EXPLORE_LINK_LABELS,
  },
  halloween: {
    title: "Explorer les mots mêlés Halloween",
    intro:
      "Prolongez l'activité d'automne avec des grilles par niveau, des PDF à imprimer ou d'autres fêtes saisonnières.",
    links: HALLOWEEN_EXPLORE_LINK_LABELS,
  },
  noel: {
    title: "Explorer les mots mêlés Noël",
    intro:
      "Prolongez l'activité de Noël avec des grilles par niveau, des PDF festifs ou d'autres thèmes saisonniers.",
    links: NOEL_EXPLORE_LINK_LABELS,
  },
  famille: {
    title: "Explorer les mots mêlés Famille",
    intro:
      "Poursuivez avec des grilles par niveau, le thème Corps humain ou d'autres pages du quotidien.",
    links: FAMILLE_EXPLORE_LINK_LABELS,
  },
  meteo: {
    title: "Explorer les mots mêlés Météo",
    intro:
      "Reliez le temps qu'il fait aux saisons, aux sciences ou aux grilles par niveau scolaire.",
    links: METEO_EXPLORE_LINK_LABELS,
  },
  couleurs: {
    title: "Explorer les mots mêlés Couleurs",
    intro:
      "Poursuivez en maternelle, en CP ou avec d'autres thèmes visuels du programme.",
    links: COULEURS_EXPLORE_LINK_LABELS,
  },
  vocabulaire: {
    title: "Explorer les mots mêlés Vocabulaire",
    intro:
      "Consolidez le lexique scolaire avec le hub École, la pédagogie ou des grilles par niveau.",
    links: VOCABULAIRE_EXPLORE_LINK_LABELS,
  },
  "corps-humain": {
    title: "Explorer les mots mêlés Corps humain",
    intro:
      "Poursuivez avec la maternelle, le thème Famille ou des grilles sciences à imprimer.",
    links: CORPS_HUMAIN_EXPLORE_LINK_LABELS,
  },
  paques: {
    title: "Explorer les mots mêlés Pâques",
    intro:
      "Prolongez la fête avec des grilles par niveau, le thème Printemps ou d'autres fêtes saisonnières.",
    links: PAQUES_EXPLORE_LINK_LABELS,
  },
  carnaval: {
    title: "Explorer les mots mêlés Carnaval",
    intro:
      "Prolongez la période festive avec des grilles par niveau, le thème Pâques ou d'autres fêtes saisonnières.",
    links: CARNAVAL_EXPLORE_LINK_LABELS,
  },
  ete: {
    title: "Explorer les mots mêlés Été",
    intro:
      "Prolongez la saison avec des grilles par niveau, le thème Printemps ou d'autres fêtes saisonnières.",
    links: ETE_EXPLORE_LINK_LABELS,
  },
  rentree: {
    title: "Explorer les mots mêlés Rentrée",
    intro:
      "Poursuivez avec des grilles par niveau, le hub École ou le thème Vocabulaire pour prolonger le lexique scolaire.",
    links: RENTREE_EXPLORE_LINK_LABELS,
  },
  printemps: {
    title: "Explorer les mots mêlés Printemps",
    intro:
      "Prolongez la saison avec des grilles par niveau, le thème Pâques ou d'autres fêtes saisonnières.",
    links: PRINTEMPS_EXPLORE_LINK_LABELS,
  },
  "pays-du-monde": {
    title: "Explorer les mots mêlés Pays du Monde",
    intro:
      "Poursuivez avec des grilles par niveau, le thème Météo ou la page Adultes pour la culture générale.",
    links: PAYS_DU_MONDE_EXPLORE_LINK_LABELS,
  },
  sciences: {
    title: "Explorer les mots mêlés Sciences",
    intro:
      "Poursuivez avec des grilles par niveau, le thème Météo ou le thème Corps humain pour d'autres sciences du vivant.",
    links: SCIENCES_EXPLORE_LINK_LABELS,
  },
  metiers: {
    title: "Explorer les mots mêlés Métiers",
    intro:
      "Poursuivez avec des grilles par niveau, le thème Sciences ou les ressources enseignants pour une séquence sur les métiers.",
    links: METIERS_EXPLORE_LINK_LABELS,
  },
}

export function getThemeExploreConfig(slug: string): ThemeExploreConfig | undefined {
  return THEME_EXPLORE_CONFIGS[slug]
}

/** Plain text from internal link labels and hints — used by entity audits. */
export function getThemeExploreCopy(slug: string): string {
  const config = getThemeExploreConfig(slug)
  if (!config) return ""
  return [
    config.title,
    config.intro,
    ...config.links.flatMap((link) => [link.label, link.hint]),
  ].join(" ")
}

export const AUDITED_THEME_SLUGS = Object.keys(THEME_EXPLORE_CONFIGS)
