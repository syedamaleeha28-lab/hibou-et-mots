import type { FaqItem } from "@/lib/db/types/page-data"
import { ANIMAUX_FAQ, ANIMAUX_INTRO, ANIMAUX_META_DESCRIPTION } from "./animaux"
import { COULEURS_FAQ, COULEURS_INTRO, COULEURS_META_DESCRIPTION } from "./couleurs"
import { CARNAVAL_FAQ, CARNAVAL_INTRO, CARNAVAL_META_DESCRIPTION } from "./carnaval"
import { CORPS_HUMAIN_FAQ, CORPS_HUMAIN_INTRO, CORPS_HUMAIN_META_DESCRIPTION } from "./corps-humain"
import { ETE_FAQ, ETE_INTRO, ETE_META_DESCRIPTION } from "./ete"
import { FAMILLE_FAQ, FAMILLE_INTRO, FAMILLE_META_DESCRIPTION } from "./famille"
import { FRUITS_FAQ, FRUITS_INTRO, FRUITS_META_DESCRIPTION } from "./fruits"
import { HALLOWEEN_FAQ, HALLOWEEN_INTRO, HALLOWEEN_META_DESCRIPTION } from "./halloween"
import { METEO_FAQ, METEO_INTRO, METEO_META_DESCRIPTION } from "./meteo"
import { NOEL_FAQ, NOEL_INTRO, NOEL_META_DESCRIPTION } from "./noel"
import { METIERS_FAQ, METIERS_INTRO, METIERS_META_DESCRIPTION } from "./metiers"
import { PAYS_DU_MONDE_FAQ, PAYS_DU_MONDE_INTRO, PAYS_DU_MONDE_META_DESCRIPTION } from "./pays-du-monde"
import { SCIENCES_FAQ, SCIENCES_INTRO, SCIENCES_META_DESCRIPTION } from "./sciences"
import { RENTREE_FAQ, RENTREE_INTRO, RENTREE_META_DESCRIPTION } from "./rentree"
import { PAQUES_FAQ, PAQUES_INTRO, PAQUES_META_DESCRIPTION } from "./paques"
import { PRINTEMPS_FAQ, PRINTEMPS_INTRO, PRINTEMPS_META_DESCRIPTION } from "./printemps"
import { SPORT_FAQ, SPORT_INTRO, SPORT_META_DESCRIPTION } from "./sport"
import { VOCABULAIRE_FAQ, VOCABULAIRE_INTRO, VOCABULAIRE_META_DESCRIPTION } from "./vocabulaire"

const THEME_INTROS: Record<string, string> = {
  animaux: ANIMAUX_INTRO,
  carnaval: CARNAVAL_INTRO,
  "corps-humain": CORPS_HUMAIN_INTRO,
  couleurs: COULEURS_INTRO,
  ete: ETE_INTRO,
  famille: FAMILLE_INTRO,
  fruits: FRUITS_INTRO,
  halloween: HALLOWEEN_INTRO,
  meteo: METEO_INTRO,
  metiers: METIERS_INTRO,
  noel: NOEL_INTRO,
  paques: PAQUES_INTRO,
  "pays-du-monde": PAYS_DU_MONDE_INTRO,
  printemps: PRINTEMPS_INTRO,
  rentree: RENTREE_INTRO,
  sciences: SCIENCES_INTRO,
  sport: SPORT_INTRO,
  vocabulaire: VOCABULAIRE_INTRO,
}

const THEME_FAQS: Record<string, FaqItem[]> = {
  animaux: ANIMAUX_FAQ,
  carnaval: CARNAVAL_FAQ,
  "corps-humain": CORPS_HUMAIN_FAQ,
  couleurs: COULEURS_FAQ,
  ete: ETE_FAQ,
  famille: FAMILLE_FAQ,
  fruits: FRUITS_FAQ,
  halloween: HALLOWEEN_FAQ,
  meteo: METEO_FAQ,
  metiers: METIERS_FAQ,
  noel: NOEL_FAQ,
  paques: PAQUES_FAQ,
  "pays-du-monde": PAYS_DU_MONDE_FAQ,
  printemps: PRINTEMPS_FAQ,
  rentree: RENTREE_FAQ,
  sciences: SCIENCES_FAQ,
  sport: SPORT_FAQ,
  vocabulaire: VOCABULAIRE_FAQ,
}

const THEME_META_DESCRIPTIONS: Record<string, string> = {
  animaux: ANIMAUX_META_DESCRIPTION,
  carnaval: CARNAVAL_META_DESCRIPTION,
  "corps-humain": CORPS_HUMAIN_META_DESCRIPTION,
  couleurs: COULEURS_META_DESCRIPTION,
  ete: ETE_META_DESCRIPTION,
  famille: FAMILLE_META_DESCRIPTION,
  fruits: FRUITS_META_DESCRIPTION,
  halloween: HALLOWEEN_META_DESCRIPTION,
  meteo: METEO_META_DESCRIPTION,
  metiers: METIERS_META_DESCRIPTION,
  noel: NOEL_META_DESCRIPTION,
  paques: PAQUES_META_DESCRIPTION,
  "pays-du-monde": PAYS_DU_MONDE_META_DESCRIPTION,
  printemps: PRINTEMPS_META_DESCRIPTION,
  rentree: RENTREE_META_DESCRIPTION,
  sciences: SCIENCES_META_DESCRIPTION,
  sport: SPORT_META_DESCRIPTION,
  vocabulaire: VOCABULAIRE_META_DESCRIPTION,
}

export function getThemeIntro(slug: string): string | undefined {
  return THEME_INTROS[slug]
}

export function getThemeFaq(slug: string): FaqItem[] | undefined {
  return THEME_FAQS[slug]
}

export function getThemeMetaDescription(slug: string): string | undefined {
  return THEME_META_DESCRIPTIONS[slug]
}

export { ANIMAUX_FAQ, ANIMAUX_INTRO, ANIMAUX_META_DESCRIPTION } from "./animaux"
export { CARNAVAL_FAQ, CARNAVAL_INTRO, CARNAVAL_META_DESCRIPTION } from "./carnaval"
export { COULEURS_FAQ, COULEURS_INTRO, COULEURS_META_DESCRIPTION } from "./couleurs"
export { ETE_FAQ, ETE_INTRO, ETE_META_DESCRIPTION } from "./ete"
export { CORPS_HUMAIN_FAQ, CORPS_HUMAIN_INTRO, CORPS_HUMAIN_META_DESCRIPTION } from "./corps-humain"
export { FAMILLE_FAQ, FAMILLE_INTRO, FAMILLE_META_DESCRIPTION } from "./famille"
export { FRUITS_FAQ, FRUITS_INTRO, FRUITS_META_DESCRIPTION } from "./fruits"
export { HALLOWEEN_FAQ, HALLOWEEN_INTRO, HALLOWEEN_META_DESCRIPTION } from "./halloween"
export { METEO_FAQ, METEO_INTRO, METEO_META_DESCRIPTION } from "./meteo"
export { NOEL_FAQ, NOEL_INTRO, NOEL_META_DESCRIPTION } from "./noel"
export { PAQUES_FAQ, PAQUES_INTRO, PAQUES_META_DESCRIPTION } from "./paques"
export { PAYS_DU_MONDE_FAQ, PAYS_DU_MONDE_INTRO, PAYS_DU_MONDE_META_DESCRIPTION } from "./pays-du-monde"
export { METIERS_FAQ, METIERS_INTRO, METIERS_META_DESCRIPTION } from "./metiers"
export { SCIENCES_FAQ, SCIENCES_INTRO, SCIENCES_META_DESCRIPTION } from "./sciences"
export { PRINTEMPS_FAQ, PRINTEMPS_INTRO, PRINTEMPS_META_DESCRIPTION } from "./printemps"
export { RENTREE_FAQ, RENTREE_INTRO, RENTREE_META_DESCRIPTION } from "./rentree"
export { SPORT_FAQ, SPORT_INTRO, SPORT_META_DESCRIPTION } from "./sport"
export { VOCABULAIRE_FAQ, VOCABULAIRE_INTRO, VOCABULAIRE_META_DESCRIPTION } from "./vocabulaire"
export { getThemeExploreConfig, getThemeExploreCopy } from "./theme-explore-links"
