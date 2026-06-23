import type { FaqItem } from "@/lib/db/types/page-data"
import {
  ecoleCyclePlainText,
} from "@/lib/content/educational-entities"
import { pedagogieEditorialPlainText } from "@/lib/content/pedagogie"
import { getPhase1Intro } from "@/lib/content/phase1"
import {
  resolveAudienceCategoryPageData,
  resolveEcoleHubPageData,
  resolveGradeCategoryPageData,
  resolveStaticSupportCategoryPageData,
} from "@/lib/db/queries/category-resolvers"
import { resolveCategoryFaq } from "@/lib/seo/templates"
import { ROUTES, gradePath } from "@/lib/seo/routes"

export type EducationalPageCopy = {
  path: string
  slug: string
  pageType: "hub" | "grade" | "support" | "snippet"
  text: string
}

const HOME_PEDAGOGY_COPY =
  "Trouver un mot caché dans la grille oblige l'enfant à mémoriser sa forme visuelle complète, ce qui complète la lecture syllabique et la dictée. En classe comme à la maison, c'est une activité calme qui convient aux cycles 2 et 3 du primaire, soutient l'apprentissage de la lecture et enrichit le vocabulaire scolaire sans surcharge."

function flattenFaq(faq: FaqItem[]): string {
  return faq.flatMap((item) => [item.question, item.answer]).join(" ")
}

function flattenCategory(page: Awaited<ReturnType<typeof resolveEcoleHubPageData>>, isHub: boolean) {
  if (!page) return ""
  const faq = resolveCategoryFaq(page.slug, page.type, page.faqJson, isHub)
  return [
    page.h1,
    page.seoTitle,
    page.metaDescription,
    page.introText,
    flattenFaq(faq),
  ].join(" ")
}

/** Pages where educational entity references are appropriate (not site-wide). */
export async function collectEducationalPageCopies(): Promise<EducationalPageCopy[]> {
  const copies: EducationalPageCopy[] = []

  const pedagogie = await resolveStaticSupportCategoryPageData(ROUTES.pedagogie, 1)
  if (pedagogie) {
    copies.push({
      path: ROUTES.pedagogie,
      slug: "pedagogie",
      pageType: "hub",
      text: [
        flattenCategory(pedagogie, false),
        pedagogieEditorialPlainText(),
      ].join(" "),
    })
  }

  const ecole = await resolveEcoleHubPageData(1)
  if (ecole) {
    copies.push({
      path: ROUTES.ecoleHub,
      slug: "hub-ecole",
      pageType: "hub",
      text: [flattenCategory(ecole, true), ecoleCyclePlainText()].join(" "),
    })
  }

  const enfants = await resolveAudienceCategoryPageData("enfants", 1)
  if (enfants) {
    copies.push({
      path: ROUTES.enfants,
      slug: "enfants",
      pageType: "hub",
      text: [
        flattenCategory(enfants, false),
        getPhase1Intro("enfants") ?? "",
      ].join(" "),
    })
  }

  const ressources = await resolveStaticSupportCategoryPageData(ROUTES.ressources, 1)
  if (ressources) {
    copies.push({
      path: ROUTES.ressources,
      slug: "ressources-enseignants",
      pageType: "support",
      text: flattenCategory(ressources, false),
    })
  }

  copies.push({
    path: ROUTES.home,
    slug: "home-pedagogy",
    pageType: "snippet",
    text: HOME_PEDAGOGY_COPY,
  })

  for (const slug of ["maternelle", "cp", "ce1", "ce2", "cm1", "cm2", "6e"] as const) {
    const page = await resolveGradeCategoryPageData(slug, 1)
    if (!page) continue
    copies.push({
      path: gradePath(slug),
      slug,
      pageType: "grade",
      text: flattenCategory(page, false),
    })
  }

  return copies.sort((a, b) => a.path.localeCompare(b.path))
}
