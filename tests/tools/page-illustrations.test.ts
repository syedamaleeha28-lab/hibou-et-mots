import { describe, it, expect } from "vitest"
import {
  getCategoryIllustrations,
  getContentIllustration,
  buildAiPrompt,
  deriveDefaultSubject,
  HERO_DIMENSIONS,
  PREVIEW_DIMENSIONS,
} from "../../lib/images/page-illustrations"

describe("getCategoryIllustrations", () => {
  it("derives a filename from the canonical path, not the leaf slug (avoids collisions)", () => {
    const a = getCategoryIllustrations({
      canonicalPath: "/mots-meles-ecole/ce1/animaux/",
      h1: "Mots Mêlés Animaux — CE1",
    })
    const b = getCategoryIllustrations({
      canonicalPath: "/mots-meles-ecole/cm2/animaux/",
      h1: "Mots Mêlés Animaux — CM2",
    })
    // Same theme ("animaux") under two different grades must NOT collide.
    expect(a.hero.src).not.toBe(b.hero.src)
    expect(a.hero.src).toBe("/images/heroes/mots-meles-ecole-ce1-animaux-hero.webp")
    expect(b.hero.src).toBe("/images/heroes/mots-meles-ecole-cm2-animaux-hero.webp")
  })

  it("produces distinct hero and preview paths in the correct folders", () => {
    const { hero, preview } = getCategoryIllustrations({
      canonicalPath: "/mots-meles-thematiques/fruits/",
      h1: "Mots Mêlés Fruits",
    })
    expect(hero.src).toBe("/images/heroes/mots-meles-thematiques-fruits-hero.webp")
    expect(preview.src).toBe("/images/previews/mots-meles-thematiques-fruits-preview.webp")
  })

  it("never hardcodes page-specific text — alt/caption are derived purely from h1", () => {
    const { hero, preview } = getCategoryIllustrations({
      canonicalPath: "/mots-meles-seniors/",
      h1: "Mots Mêlés Seniors",
    })
    expect(hero.alt).toContain("Mots Mêlés Seniors")
    expect(preview.alt).toContain("Mots Mêlés Seniors")
  })

  it("uses the standard hero (16:9) and preview (4:3) dimensions", () => {
    const { hero, preview } = getCategoryIllustrations({
      canonicalPath: "/mots-meles-thematiques/animaux/",
      h1: "Mots Mêlés Animaux",
    })
    expect(hero.width).toBe(HERO_DIMENSIONS.width)
    expect(hero.height).toBe(HERO_DIMENSIONS.height)
    expect(preview.width).toBe(PREVIEW_DIMENSIONS.width)
    expect(preview.height).toBe(PREVIEW_DIMENSIONS.height)
  })

  it("handles the root path without producing an empty filename", () => {
    const { hero } = getCategoryIllustrations({ canonicalPath: "/", h1: "Accueil" })
    expect(hero.src).toBe("/images/heroes/accueil-hero.webp")
  })
})

describe("getContentIllustration", () => {
  it("respects an existing DB-authored illustration when present", () => {
    const result = getContentIllustration({
      canonicalPath: "/mots-meles-pedagogie/",
      h1: "Pédagogie",
      illustration: { src: "/images/heroes/custom-pedagogie.webp", alt: "Texte personnalisé", width: 900, height: 500 },
    })
    expect(result.src).toBe("/images/heroes/custom-pedagogie.webp")
    expect(result.alt).toBe("Texte personnalisé")
    expect(result.width).toBe(900)
    expect(result.height).toBe(500)
  })

  it("falls back to a derived illustration when none is set", () => {
    const result = getContentIllustration({
      canonicalPath: "/mots-meles-pedagogie/",
      h1: "Pédagogie",
      illustration: undefined,
    })
    expect(result.src).toBe("/images/heroes/mots-meles-pedagogie-hero.webp")
    expect(result.width).toBe(HERO_DIMENSIONS.width)
    expect(result.height).toBe(HERO_DIMENSIONS.height)
  })
})

describe("deriveDefaultSubject", () => {
  it("defaults to children and a teacher when no audience is specified", () => {
    const subject = deriveDefaultSubject({ h1: "Mots Mêlés Fruits", audienceLabel: undefined })
    expect(subject).toContain("children")
    expect(subject).toContain("teacher")
  })

  it("casts an older adult, not children, when the page audience is seniors", () => {
    const subject = deriveDefaultSubject({ h1: "Mots Mêlés Seniors", audienceLabel: "Seniors" })
    expect(subject).toContain("older adult")
    expect(subject).not.toContain("children")
  })

  it("casts an adult, not children, when the page audience is adultes", () => {
    const subject = deriveDefaultSubject({ h1: "Mots Mêlés Adultes", audienceLabel: "Adultes" })
    expect(subject).toContain("adult")
    expect(subject).not.toContain("children")
  })

  it("weaves the theme name into the subject when present", () => {
    const subject = deriveDefaultSubject({
      h1: "Mots Mêlés Animaux",
      audienceLabel: undefined,
      theme: { name: "Animaux" },
    })
    expect(subject).toContain("animaux")
  })

  it("is case-insensitive when matching the audience label", () => {
    const subject = deriveDefaultSubject({ h1: "x", audienceLabel: "SENIORS" })
    expect(subject).toContain("older adult")
  })
})

describe("buildAiPrompt", () => {
  it("always appends the shared style guide, for visual consistency across generated images", () => {
    const prompt = buildAiPrompt("hero", "children solving a word search")
    expect(prompt).toContain("children solving a word search")
    expect(prompt).toContain("#F1683B") // brand color anchor present
    expect(prompt).toContain("16:9 aspect ratio")
  })

  it("uses 4:3 framing language for preview prompts, not 16:9", () => {
    const prompt = buildAiPrompt("preview", "animals theme")
    expect(prompt).toContain("4:3 aspect ratio")
    expect(prompt).not.toContain("16:9")
  })
})
