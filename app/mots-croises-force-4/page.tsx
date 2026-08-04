import type { Metadata } from "next"
import { ForceTierPage } from "@/components/templates/mots-croises/force-tier-page"

export const metadata: Metadata = {
  title: "Mots Croisés Force 4 — Grilles Gratuites en Ligne | Hibou&Mots",
  description:
    "Joue à des mots croisés de niveau Force 4 gratuitement en ligne. Grille avec définitions, sans inscription, sur Hibou&Mots.",
  other: {
    google: "notranslate",
  },
}

export default function MotsCroisesForce4Page() {
  return <ForceTierPage tier={4} />
}
