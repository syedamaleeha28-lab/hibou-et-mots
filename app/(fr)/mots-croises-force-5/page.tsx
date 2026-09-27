import type { Metadata } from "next"
import { ForceTierPage } from "@/components/templates/mots-croises/force-tier-page"

// Retargeted description — same "collège" reasoning as Force 4, this
// is the site's hardest tier so it's the most natural fit for that
// audience alongside adult/expert players.
export const metadata: Metadata = {
  title: "Mots Croisés Force 5 (Difficile) Gratuits en Ligne | Hibou&Mots",
  description:
    "Joue à des mots croisés difficiles gratuitement en ligne : notre niveau le plus corsé, idéal à partir du collège pour les amateurs confirmés. Sans inscription.",
  other: {
    google: "notranslate",
  },
}

export default function MotsCroisesForce5Page() {
  return <ForceTierPage tier={5} />
}
