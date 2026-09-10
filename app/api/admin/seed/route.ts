import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/client"
import { getCategoryFaq } from "@/lib/content/category-faqs"

/**
 * TEMPORARY — one-shot production write for hub-gratuits SEO/FAQ fields.
 * Remove this file the same day after the update is confirmed on the live page.
 * Protected by ADMIN_SEED_SECRET (Vercel Production env var) via x-admin-secret.
 */
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

const HUB_GRATUITS_SLUG = "hub-gratuits"

function isAuthorized(request: Request): boolean {
  const secret = request.headers.get("x-admin-secret")
  return Boolean(secret) && secret === process.env.ADMIN_SEED_SECRET
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const faqJson = getCategoryFaq(HUB_GRATUITS_SLUG)
  if (!faqJson || faqJson.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Missing hub-gratuits FAQ in registry" },
      { status: 500 },
    )
  }

  try {
    const updated = await prisma.category.update({
      where: { locale_slug: { locale: "fr", slug: HUB_GRATUITS_SLUG } },
      data: {
        h1: "Mots Mêlés Gratuits : Jouer en Ligne et Créer ses Grilles",
        seoTitle: "Mots Mêlés Gratuits en Ligne | Hibou & Mots",
        metaDescription:
          "Des centaines de grilles de mots mêlés 100% gratuites et sans inscription : joue en ligne ou crée ta propre grille personnalisée. Export PDF disponible si tu préfères imprimer.",
        faqJson,
      },
      select: {
        locale: true,
        slug: true,
        h1: true,
        seoTitle: true,
        metaDescription: true,
        faqJson: true,
      },
    })

    return NextResponse.json({ ok: true, updated })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
