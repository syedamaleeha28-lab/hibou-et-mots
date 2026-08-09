import type { CategoryPageData } from "@/lib/db/types/page-data"
import type { ContentPageData } from "@/lib/db/types/content-page-data"

export type IllustrationSpec = {
  src: string
  alt: string
  title?: string
  caption?: string
  width: number
  height: number
}

export const HERO_DIMENSIONS = { width: 1200, height: 675 } // 16:9
export const PREVIEW_DIMENSIONS = { width: 800, height: 600 } // 4:3

/**
 * The shared art-direction line every AI image prompt should end with, so
 * hundreds of independently-generated images still read as one site.
 * Colors are the project's real brand tokens (see app/globals.css), not
 * approximations.
 */
export const ILLUSTRATION_STYLE_GUIDE =
  "Consistent art direction: flat vector illustration, warm and friendly color palette " +
  "(orange #F1683B, teal #36BABB, yellow #FDCA3A, green #61BD67, cream background #FBF5E6), " +
  "rounded soft shapes, no gradients, no photorealism, no text or letters rendered as image " +
  "content, suitable for children, parents, teachers, and seniors, consistent character style " +
  "across all illustrations."

/**
 * Optional hand-crafted alt/caption overrides, keyed by canonical path, for
 * pages where a more specific description has been written (e.g. once a
 * real image has been generated and reviewed for that page). This is DATA,
 * not per-page logic — the mapping function itself stays fully generic and
 * works correctly with zero entries here; this table only ever improves on
 * the generic default, never required for the system to function.
 */
const ILLUSTRATION_COPY_OVERRIDES: Record<
  string,
  { heroAlt?: string; heroCaption?: string; previewAlt?: string; previewCaption?: string }
> = {
  "/mots-meles-thematiques/fruits/": {
    heroAlt:
      "Un enfant souriant résout une grille de mots mêlés entouré de personnages fruits amusants (pomme, banane, fraise, orange)",
    heroCaption: "Apprends les noms des fruits en français en t'amusant.",
  },
  "/mots-meles-thematiques/animaux/": {
    previewAlt:
      "Aperçu d'une grille de mots mêlés imprimable sur le thème des animaux, avec lion, éléphant et girafe illustrés",
    previewCaption: "Une grille prête à imprimer, avec ses crayons de couleur.",
  },
}

function slugFromPath(canonicalPath: string): string {
  return canonicalPath.replace(/^\/+|\/+$/g, "").replace(/\//g, "-") || "accueil"
}

/**
 * PT-BR pack: no Portuguese illustration images have been generated yet —
 * they're static pre-generated assets (see buildAiPrompt below), not
 * something built at request time, and generating a full new PT-BR image
 * set is a separate content task from this fix.
 *
 * Illustrations are generic, language-neutral scenes by design (the style
 * guide explicitly forbids rendering any text/letters in the image), so
 * as an interim measure each PT-BR category reuses the equivalent French
 * category's already-generated image file as a visual stand-in. The
 * alt/caption TEXT below is still correctly Portuguese — only the pixels
 * are borrowed. Swap these out for real PT-BR-specific images whenever
 * that generation pass happens; nothing else needs to change when it does.
 *
 * Keyed by category.slug (not path), since PT hub rows intentionally
 * reuse the same slug strings as their French counterparts (see
 * category-constants.ts) — locale is what disambiguates them, so slug
 * alone isn't enough to build the right path, but IS enough to look up
 * which French image to borrow.
 */
const PT_IMAGE_FALLBACK_BASE_SLUG: Record<string, string> = {
  "hub-imprimer": "mots-meles-a-imprimer",
  "hub-difficulte": "mots-meles-difficulte",
  "hub-thematiques": "mots-meles-thematiques",
  animais: "mots-meles-thematiques-animaux",
  esporte: "mots-meles-thematiques-sport",
  facil: "mots-meles-difficulte-facile",
  medio: "mots-meles-difficulte-moyen",
  dificil: "mots-meles-difficulte-difficile",
}

function resolveIllustrationBaseSlug(category: Pick<CategoryPageData, "canonicalPath" | "slug" | "locale">): string {
  if (category.locale === "pt-BR") {
    const fallback = PT_IMAGE_FALLBACK_BASE_SLUG[category.slug]
    if (fallback) return fallback
    // No mapping yet for this slug (e.g. a future PT grade/seasonal
    // category) — falls through to the PT path's own slug, which will
    // 404 on the image same as before this fix, but at least won't
    // silently point at the wrong content either.
  }
  return slugFromPath(category.canonicalPath)
}

/**
 * Derives hero + preview illustration specs for ANY category page purely
 * from data already on the page object — no per-category/per-theme/per-grade
 * special-casing. Works identically for a theme page, a grade page, a
 * difficulty page, an audience page, or any future category type.
 */
export function getCategoryIllustrations(
  category: Pick<CategoryPageData, "canonicalPath" | "slug" | "h1" | "locale">,
): { hero: IllustrationSpec; preview: IllustrationSpec } {
  const baseSlug = resolveIllustrationBaseSlug(category)
  const title = category.h1
  const overrides = ILLUSTRATION_COPY_OVERRIDES[category.canonicalPath]
  const isPt = category.locale === "pt-BR"

  return {
    hero: {
      src: `/images/heroes/${baseSlug}-hero.webp`,
      alt:
        overrides?.heroAlt ??
        (isPt
          ? `Crianças e professora se divertindo com uma grade de caça-palavras — ${title}`
          : `Enfants et enseignante s'amusant avec une grille de mots mêlés — ${title}`),
      title,
      caption:
        overrides?.heroCaption ??
        (isPt ? `Descubra nossas grades: ${title.toLowerCase()}.` : `Découvre nos grilles : ${title.toLowerCase()}.`),
      ...HERO_DIMENSIONS,
    },
    preview: {
      src: `/images/previews/${baseSlug}-preview.webp`,
      alt:
        overrides?.previewAlt ??
        (isPt
          ? `Prévia de uma grade de caça-palavras para imprimir — ${title}`
          : `Aperçu d'une grille de mots mêlés imprimable — ${title}`),
      title: isPt ? `Exemplo de grade — ${title}` : `Exemple de grille — ${title}`,
      caption:
        overrides?.previewCaption ??
        (isPt
          ? "Cada grade está pronta para imprimir ou jogar online."
          : "Chaque grille est prête à imprimer ou à jouer en ligne."),
      ...PREVIEW_DIMENSIONS,
    },
  }
}

/**
 * Derives a hero illustration for a content/article page. If the page
 * already carries a DB-authored `illustration` (the existing, previously
 * unused `ContentPageData.illustration` field), that takes priority —
 * this function only fills in a sensible default when none is set yet.
 */
export function getContentIllustration(
  page: Pick<ContentPageData, "canonicalPath" | "h1" | "illustration">,
): IllustrationSpec {
  if (page.illustration) {
    return {
      src: page.illustration.src,
      alt: page.illustration.alt,
      width: page.illustration.width ?? HERO_DIMENSIONS.width,
      height: page.illustration.height ?? HERO_DIMENSIONS.height,
    }
  }
  const baseSlug = slugFromPath(page.canonicalPath)
  const title = page.h1
  return {
    src: `/images/heroes/${baseSlug}-hero.webp`,
    alt: `${title} — illustration`,
    title,
    ...HERO_DIMENSIONS,
  }
}

/**
 * Builds the AI generation prompt for a given illustration spec + subject
 * description. Used by the manifest generator (see scripts/) — not called
 * at request time, since prompts are only needed to actually produce the
 * image files, not to render already-generated ones.
 */
export function buildAiPrompt(kind: "hero" | "preview", subjectDescription: string): string {
  const shot =
    kind === "hero"
      ? `Flat, warm, modern educational illustration: ${subjectDescription}. 16:9 aspect ratio.`
      : `Flat illustration mockup of a printed French word-search worksheet related to: ${subjectDescription}. Top-down angled view on a desk, soft shadow. 4:3 aspect ratio.`
  return `${shot} ${ILLUSTRATION_STYLE_GUIDE}`
}

/**
 * Derives the default "cast" for a page's illustration, purely from data
 * already on the category object — never hardcoded per page. The site's
 * default subject is children and a teacher (per house style), but a page
 * whose audience is explicitly seniors or adults gets a matching cast
 * instead of always defaulting to children. Any caller can still override
 * with a fully custom subject string when a specific theme warrants it
 * (see the manifest script for examples).
 */
export function deriveDefaultSubject(
  category: Pick<CategoryPageData, "h1" | "audienceLabel"> & { theme?: { name: string } },
): string {
  const audience = (category.audienceLabel ?? "").toLowerCase()
  const topic = category.theme?.name ? ` about ${category.theme.name.toLowerCase()}` : ""

  if (audience.includes("senior")) {
    return `an older adult happily solving a large-print French word search puzzle${topic}, warm relaxed setting`
  }
  if (audience.includes("adulte")) {
    return `an adult enjoying a French word search puzzle${topic} with a cup of coffee, calm cozy setting`
  }
  // Default cast: children and a teacher, per house style.
  return `children and a teacher solving a French word search puzzle together${topic} in a colorful classroom`
}
