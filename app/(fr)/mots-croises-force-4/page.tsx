import type { Metadata } from "next"
import { ForceTierPage } from "@/components/templates/mots-croises/force-tier-page"

// Retargeted description to naturally cover "mots croisés à imprimer
// collège" (150/mo, KD 2) — Force 4/5 are genuinely the site's
// collège-appropriate difficulty tiers, this just says so explicitly.
export const metadata: Metadata = {
  title: "Mots Croisés Force 4 — Grilles Gratuites en Ligne | Hibou&Mots",
  description:
    "Joue à des mots croisés de niveau Force 4 gratuitement en ligne : une grille plus large, six mots à trouver, adaptée à un niveau collège. Sans inscription, sur Hibou&Mots.",
  other: {
    google: "notranslate",
  },
}

export default function MotsCroisesForce4Page() {
  return <ForceTierPage tier={4} />
}
