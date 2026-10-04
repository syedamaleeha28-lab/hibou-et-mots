import type { Metadata } from "next"
import { ForceTierPage } from "@/components/templates/mots-croises/force-tier-page"
import { selfCanonical } from "@/lib/seo/self-canonical"
import { motsCroisesForcePath } from "@/lib/seo/routes"

export const metadata: Metadata = {
  title: "Mots Croisés Force 3 — Grilles Gratuites en Ligne | Hibou&Mots",
  description:
    "Joue à des mots croisés de niveau Force 3 gratuitement en ligne. Grille avec définitions, sans inscription, sur Hibou&Mots.",
  ...selfCanonical(motsCroisesForcePath(3)),
  other: {
    google: "notranslate",
  },
}

export default function MotsCroisesForce3Page() {
  return <ForceTierPage tier={3} />
}
