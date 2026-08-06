import type { IllustrationSpec } from "./page-illustrations"
import { HERO_DIMENSIONS } from "./page-illustrations"

/**
 * The homepage doesn't use CategoryTemplate's automatic per-page mapping
 * (it has its own custom layout), so its illustration is defined directly
 * here — still using the same IllustrationSpec shape and the same
 * <PageIllustration> component as every other page, for visual consistency.
 */
export const HOMEPAGE_ILLUSTRATION: IllustrationSpec = {
  src: "/images/heroes/homepage-hero-child.webp",
  alt: "Un enfant souriant résout une grille de mots mêlés sur les animaux à la table du salon",
  title: "Enfant résolvant un mot mêlé à la maison",
  caption: "Amuse-toi avec les mots mêlés, à la maison comme à l'école.",
  ...HERO_DIMENSIONS,
}
