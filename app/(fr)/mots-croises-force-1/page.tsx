import type { Metadata } from "next"
import { ForceTierPage } from "@/components/templates/mots-croises/force-tier-page"

// Retargeted: this page IS the site's easiest crossword tier, but its
// title/description never said "facile" — meaning it wasn't targeting
// the single highest-volume keyword in the whole content-gap analysis
// ("mots croisés faciles", 1,300/mo, KD 14) despite being an exact
// content match. Also folds in "mot croisé enfant" (200/mo, KD 0),
// genuinely accurate for this tier.
export const metadata: Metadata = {
  title: "Mots Croisés Faciles (Force 1) Gratuits en Ligne | Hibou&Mots",
  description:
    "Joue à des mots croisés faciles gratuitement en ligne : petite grille, mots courts, définitions simples — idéal pour un enfant qui débute. Sans inscription.",
  other: {
    google: "notranslate",
  },
}

export default function MotsCroisesForce1Page() {
  return <ForceTierPage tier={1} />
}
