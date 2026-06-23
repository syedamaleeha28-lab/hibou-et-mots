# E-E-A-T Improvements Report — Hibou&Mots

**Generated:** 23 June 2026  
**Commit scope:** Author profile, structured data, editorial attribution

---

## Summary

| Signal | Before | After |
|--------|--------|-------|
| Author profile page | None | `/auteur/` |
| Person schema | None | Site-wide `@graph` |
| Organization schema | Basic (name, logo, email) | + description, founder, knowsAbout, foundingDate |
| Published / updated dates | None | Visible + JSON-LD on editorial pages |
| Author attribution UI | None | 8+ page types |
| Blog author reference | N/A | No blog section on site |

---

## 1. Author profile page (`/auteur/`)

**URL:** https://hibou-et-mots.com/auteur/

Includes all required sections:

| Requirement | Implementation |
|-------------|----------------|
| Site creator | Équipe Hibou&Mots — créateur du site |
| Educational mission | Mission éducative section |
| Experience with word search content | Expérience en contenu éducatif + knowsAbout list |
| Contact email | hibou.et.mots@gmail.com + contact link |
| Website purpose | Objectif du site section |

**Schema:** `ProfilePage` + `Person` + `Organization` + `BreadcrumbList`

---

## 2. Person schema

**File:** `lib/seo/schema/person.ts`

- `@type`: Person  
- `name`, `url`, `email`, `jobTitle`, `description`  
- `worksFor` → Organization  
- `knowsAbout`: mots mêlés, vocabulaire scolaire, éducation primaire, etc.  
- Stable `@id`: `{site}/auteur/#person`

**Injected on:**

- Homepage (`@graph`)  
- About page  
- Author page  
- Educational category pages (via `buildContentWebPageSchema`)  
- Generator & online play tool pages  

---

## 3. Organization schema enhancements

**File:** `lib/seo/schema/home.ts`

Added properties:

- `description` — editorial mission  
- `foundingDate` — 2024  
- `founder` — Person `@id` link  
- `knowsAbout` — topical expertise array  

Existing retained: `name`, `url`, `logo`, `email`, `sameAs` (Instagram, X, Pinterest)

---

## 4. Author attribution component

**Component:** `components/seo/author-attribution.tsx`  
**Data source:** `lib/content/author.ts`

Displays:

- Link to `/auteur/`  
- Job title / expertise line  
- Published date (1 juin 2024)  
- Last updated date (23 juin 2026)  
- Contact email  

Variants: `compact` (default), `detailed` (about + author pages)

---

## 5. Pages with author reference

| Page | Attribution | Schema author + dates |
|------|-------------|----------------------|
| Homepage `/` | Yes | Person in `@graph` |
| About `/a-propos/` | Yes (detailed) | WebPage + Person |
| Author `/auteur/` | Yes (detailed) | ProfilePage + Person |
| Generator `/generateur-mots-meles/` | Yes | WebPage + Person |
| Online play `/jouer-mots-meles-en-ligne/` | Yes | WebPage + Person |
| Pédagogie | Yes | WebPage + Person |
| Ressources enseignants | Yes | WebPage + Person |
| Enfants | Yes | WebPage + Person |
| Hub École | Yes | WebPage + Person |
| Hub Gratuits | Yes | WebPage + Person |
| Solutions / règles | Yes | WebPage + Person |
| Grade pages (maternelle–CM2) | Yes | WebPage + Person |
| Blog | N/A — no blog routes | — |

---

## 6. Publication dates

| Constant | Value | Usage |
|----------|-------|-------|
| `SITE_PUBLISHED_DATE` | 2024-06-01 | JSON-LD `datePublished`, visible UI |
| `SITE_CONTENT_UPDATED_DATE` | 2026-06-23 | JSON-LD `dateModified`, visible UI |

French formatting via `formatFrenchDate()` for user-visible strings.

---

## 7. Navigation & discoverability

- Footer legal links: **Auteur** added  
- About page: link to author page  
- Sitemap: `/auteur/` in static sitemap (23 static URLs)  
- Internal link audit: route registered in `resolve-internal-path.ts`

---

## 8. Tests added / updated

| Test file | Coverage |
|-----------|----------|
| `tests/seo/author-schema.test.ts` | ProfilePage, Person, Organization founder |
| `tests/seo/home-schema.test.ts` | Person in homepage graph |
| `tests/seo/about-schema.test.ts` | Author + dates on about WebPage |
| `tests/seo/sitemap-routability.test.ts` | `/auteur/` routable |

---

## 9. Remaining E-E-A-T opportunities (future)

1. **Individual named author** — replace team entity with a named founder if desired for YMYL boost  
2. **Per-page `dateModified`** — track updates per category when content changes  
3. **Blog** — when launched, reuse `AuthorAttribution` + `buildContentWebPageSchema`  
4. **Review / rating schema** — only if genuine user reviews exist  
5. **Puzzle pages** — optional `author` on `CreativeWork` schema for educational puzzles  

---

## Files changed

- `app/auteur/page.tsx` (new)  
- `lib/content/author.ts` (new)  
- `lib/seo/schema/person.ts` (new)  
- `lib/seo/schema/author-page.ts` (new)  
- `components/seo/author-attribution.tsx` (new)  
- `docs/e-e-a-t-report.md` (new)  
- `lib/seo/schema/home.ts`, `about-page.ts`, `page-schemas.ts`  
- `lib/seo/routes.ts`, `sitemap/static.ts`  
- `app/page.tsx`, `app/a-propos/page.tsx`  
- `app/generateur-mots-meles/page.tsx`, `app/jouer-mots-meles-en-ligne/page.tsx`  
- `components/templates/category/category-template.tsx`  
- `components/templates/tools/generator-editorial.tsx`, `online-play-editorial.tsx`  
- `lib/navigation/site-nav.ts`  
- `lib/audit/resolve-internal-path.ts`  
- Tests (4 files)
