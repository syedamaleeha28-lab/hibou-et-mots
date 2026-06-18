# Blueprint d'Implémentation — Hibou & Mots
## Package final pour Cursor AI

**Statut :** consolidation finale post-revue de `PRD_Mots_Meles.md`, `DESIGN_SYSTEM.md` et `style-guide.html`.
**Rôle de ce document :** c'est le document que le CTO remet à l'équipe d'implémentation (humaine ou Cursor AI) le jour 1. Il ne redéfinit pas la stratégie produit/SEO (déjà actée dans le PRD) — il tranche les questions d'architecture technique restées ouvertes et fixe l'ordre d'exécution. **Aucun code dans ce document : structures, schémas et décisions uniquement.**

---

## 1. Folder Structure

Arborescence Next.js 15 (App Router). Un seul dossier par segment de route ; les segments dynamiques (`[grade]`, `[theme]`, `[slug]`) sont pilotés par la base de données, jamais générés en dur.

```
hibou-et-mots/
├── app/
│   ├── layout.tsx                          (layout racine : Header, Footer, providers)
│   ├── page.tsx                            (Accueil)
│   ├── globals.css
│   ├── sitemap.ts                          (convention Next 15 — generateSitemaps pour la segmentation)
│   ├── robots.ts
│   │
│   ├── mots-meles-gratuits/page.tsx
│   ├── mots-meles-a-imprimer/page.tsx
│   ├── jouer-mots-meles-en-ligne/page.tsx
│   ├── generateur-mots-meles/
│   │   ├── page.tsx
│   │   └── resultat/[id]/page.tsx          (noindex — puzzle généré à la volée)
│   ├── mots-meles-difficulte/
│   │   ├── page.tsx
│   │   └── [level]/page.tsx
│   ├── mots-meles-langues/[lang]/page.tsx  (Phase 3)
│   ├── application-mots-meles/page.tsx
│   ├── solutions-regles-mots-meles/page.tsx
│   │
│   ├── mots-meles-enfants/page.tsx
│   ├── mots-meles-adultes/page.tsx
│   ├── mots-meles-seniors/page.tsx
│   │
│   ├── mots-meles-ecole/
│   │   ├── page.tsx                        (hub niveaux)
│   │   └── [grade]/
│   │       ├── page.tsx                    (catégorie niveau)
│   │       └── [theme]/page.tsx            (catégorie combo Tier 1)
│   ├── mots-meles-pedagogie/page.tsx
│   │
│   ├── mots-meles-fetes-saisons/
│   │   ├── page.tsx
│   │   └── [theme]/page.tsx
│   ├── mots-meles-thematiques/
│   │   ├── page.tsx
│   │   └── [theme]/page.tsx
│   ├── mots-meles-personnages/page.tsx
│   │
│   ├── mots-meles-journaux-magazines/
│   │   ├── page.tsx
│   │   └── [brand]/page.tsx
│   ├── jeux-magazines-mots-meles/page.tsx
│   ├── ressources-enseignants-mots-meles/page.tsx
│   │
│   ├── mots-meles/[slug]/page.tsx          (page Puzzle — namespace plat)
│   ├── recherche/page.tsx                  (noindex,follow)
│   │
│   ├── admin/                              (route group protégée par middleware)
│   │   ├── layout.tsx                      (auth check + nav admin)
│   │   ├── page.tsx                        (dashboard analytics)
│   │   ├── puzzles/  (liste, [id]/edition, nouveau, generation-en-lot)
│   │   ├── categories/  ([id]/edition, hierarchie)
│   │   ├── themes/  (CRUD, banque de mots)
│   │   ├── grades/  (CRUD)
│   │   └── seo/  (overrides, redirections, statut sitemap)
│   │
│   └── api/
│       ├── revalidate/route.ts             (webhook ISR déclenché à la publication)
│       ├── puzzles/generate/route.ts       (déclenchement génération en lot)
│       ├── pdf/[puzzleId]/route.ts
│       └── search/route.ts
│
├── components/
│   ├── layout/        (Header, Footer, MobileBottomNav, BreadcrumbTrail)
│   ├── templates/     (HomeTemplate, CategoryTemplate, ComboCategoryTemplate,
│   │                    PuzzleTemplate, ToolGeneratorTemplate, ToolOnlinePlayTemplate,
│   │                    StaticArticleTemplate, SearchResultsTemplate)
│   ├── puzzle/        (PuzzleGridServer, PuzzleGridClient, WordListPanel,
│   │                    DifficultyPill, PrintButton, RevealSolutionButton)
│   ├── cards/          (CategoryCard, PuzzleCard, GradeLevelCard, PdfDownloadCard)
│   ├── forms/          (ThemeChipSelector, SizeSegmentedControl, DiagonalToggle,
│   │                    WordListTextarea, NewsletterCaptureForm)
│   ├── seo/            (SchemaJsonLd, FaqAccordion)
│   └── ui/             (Button, Pill, Tag, Input, Switch, CardShell — atomes du design system)
│
├── lib/
│   ├── puzzle-engine/  (génération de grille, validation, alphabet français, pondération de lettres)
│   ├── db/             (client Prisma singleton, requêtes par modèle)
│   ├── seo/            (résolveur de gabarits meta, scoring des puzzles liés, données de sitemap)
│   ├── pdf/             (rendu PDF — grille + corrigé)
│   └── search/         (requêtes full-text PostgreSQL)
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed/            (données de référence : grades, difficulties, themes, theme_words initiaux)
│
├── public/
│   └── mascot/, icons/
│
├── tailwind.config.ts   (tokens du design system — Section 3 de DESIGN_SYSTEM.md)
│
└── tests/
    ├── puzzle-engine/   (Vitest — cas limites de la Section 25.5 du PRD)
    └── e2e/             (Playwright — parcours critiques, Section 6 ci-dessous)
```

**Règle de structure :** aucune page de catégorie combo ne doit avoir de logique propre — `app/mots-meles-ecole/[grade]/[theme]/page.tsx` et `app/mots-meles-thematiques/[theme]/page.tsx` consomment le **même** `CategoryTemplate`, seules les données changent. Si Cursor AI se retrouve à dupliquer la logique de rendu entre deux routes de catégorie, c'est un signal d'architecture à corriger immédiatement, pas à laisser filer.

---

## 2. Database Schema

Référence complète : `PRD_Mots_Meles.md` Section 24 (schéma Prisma exécutable). Ci-dessous, la vue CTO — modèles, rôle, relations, index — sans le code.

| Modèle | Rôle | Relations clés | Index critiques |
|--------|------|------------------|----------------------|
| `Grade` | Référentiel niveau scolaire (7 lignes : maternelle → 6e) | 1–N `Puzzle`, 1–N `Category` | `slug` (unique) |
| `Theme` | Référentiel thème (saisonnier ou vocabulaire) | 1–N `ThemeWord`, 1–N `Puzzle`, 1–N `Category` | `slug` (unique) |
| `ThemeWord` | Banque de mots par thème, filtrée par niveau lexical | N–1 `Theme` | `theme_id` |
| `Difficulty` | Référentiel difficulté (4 lignes : Facile/Moyen/Difficile/Géant) | 1–N `Puzzle`, 1–N `Category` | `slug` (unique) |
| `PressBrand` | Référentiel marque presse (Ouest-France, etc.) | 1–1 `Category` | `slug` (unique) |
| `Category` | **Pivot central** : une ligne = une page publiable (grade, theme, seasonal, difficulty, audience, press_brand, ou combo) | auto-référence `parentCategoryId` (hiérarchie) ; N–1 vers `Grade`/`Theme`/`Difficulty`/`PressBrand` (nullable selon type) ; N–M vers `Puzzle` via `CategoryPuzzle` | `slug` (unique), `type`, `status` |
| `Puzzle` | Une grille générée, son contenu et ses métadonnées | N–1 `Difficulty`, N–1 `Grade` (nullable), N–1 `Theme` (nullable) ; N–M vers `Category` via `CategoryPuzzle` | `slug` (unique), `theme_id`, `grade_id`, `difficulty_id`, `status` |
| `CategoryPuzzle` | Table de jointure — **le mécanisme qui permet à un puzzle d'apparaître dans plusieurs catégories sans dupliquer la page** | clé composite `(category_id, puzzle_id)` | les deux colonnes de la clé composite |
| `Redirect` | 301 historiques pour tout changement de slug | aucune (table plate) | `from_path` (unique) |
| `SeoMetaOverride` | Surcharge manuelle de title/meta/canonical par chemin | aucune | `path` (unique) |
| `AnalyticsEvent` | Événements produit internes (print/play/generate/download) | N–1 `Puzzle` (nullable) | `puzzle_id`, `event_type` |
| `AdminUser` | Comptes de l'équipe éditoriale | aucune | `email` (unique) |

**Décision d'architecture à retenir absolument :** `Category` n'est **pas** un alias de `Theme`/`Grade`. Un thème ou un niveau peut exister en base sans avoir encore de page publiée (ex. un thème en cours de préparation éditoriale). `Category` est la **représentation publiable** — c'est elle qui porte le statut, le SEO, le seuil de publication. Si Cursor AI propose de fusionner `Category` et `Theme`/`Grade` pour "simplifier", refuser : cela casse la logique de seuil de publication (Section 5 du PRD) et la possibilité de pages combo.

**Champ à ajouter qui n'était pas explicite dans le PRD initial :** `Puzzle.largePrint` (boolean, défaut `false`) — nécessaire pour la variante grand format/haute lisibilité (persona Seniors, Section 3.4 et 25.2 du PRD) ; sans ce champ, le mode grand format n'a nulle part où se stocker au niveau du contenu publié.

---

## 3. Page Hierarchy

Reprend la structure en silos du PRD (Section 4), annotée par type de page et profondeur de clic depuis l'accueil.

```
Niveau 0 — Accueil (/)
│
├── Niveau 1 — Hubs de silo (lien direct depuis l'accueil, 6 + 2 outils)
│   ├── Mots Mêlés Gratuits ............................ Catégorie
│   ├── Mots Mêlés à Imprimer .......................... Catégorie pilier
│   ├── Jouer en Ligne .................................. Outil
│   ├── Générateur ...................................... Outil
│   ├── Mots Mêlés Enfants / Adultes / Seniors ......... Catégorie (audience) × 3
│   ├── École (hub niveaux) ............................ Catégorie pilier
│   ├── Fêtes & Saisons (hub) ........................... Catégorie pilier
│   ├── Thématiques (hub) ............................... Catégorie pilier
│   └── Journaux & Magazines (hub) ...................... Catégorie hub
│
├── Niveau 2 — Catégories simples (1 clic sous leur hub)
│   ├── École/{niveau} .................................. Catégorie (×7 : maternelle→6e)
│   ├── Fêtes & Saisons/{theme} .......................... Catégorie (×13)
│   ├── Thématiques/{theme} .............................. Catégorie (×~25)
│   ├── Difficulté/{niveau} .............................. Catégorie (×4)
│   └── Journaux & Magazines/{marque} ................... Article support (×5)
│
├── Niveau 3 — Catégories combo (1 clic sous une catégorie Niveau 2)
│   └── École/{niveau}/{theme} ........................... Catégorie combo (Tier 1, ~80–105 pages à terme)
│
├── Pages Puzzle (liées depuis n'importe quelle catégorie pertinente — namespace plat,
│                  jamais à plus de 3 clics grâce au double rattachement combo)
│   └── /mots-meles/{slug}/
│
└── Pages statiques / support (liées depuis le footer, pas depuis la nav principale)
    ├── Solutions, Règles & Conseils
    ├── Pédagogie (support École)
    ├── Personnages (support Thématiques)
    ├── Jeux & Magazines (support Produits)
    ├── Ressources Enseignants (support Produits)
    ├── Application Mots Mêlés
    ├── Mots Mêlés en Langues Étrangères (Phase 3)
    ├── Recherche (noindex,follow)
    └── Mentions légales / Confidentialité / Contact
```

**Règle de profondeur (héritée du PRD, non négociable) :** 3 clics maximum entre l'accueil et n'importe quelle page publiée. C'est la métrique à instrumenter dans le QA, pas seulement une intention de design — un crawler interne (Screaming Frog ou équivalent) doit confirmer cette profondeur avant chaque mise en production majeure.

---

## 4. Component Hierarchy

```
Layout (toutes les pages)
├── Header                          (logo, nav desktop avec mega-menu, icône recherche)
├── MobileBottomNav                  (mobile uniquement — Accueil/Imprimer/Jouer/Créer/Recherche)
└── Footer                           (sitemap complet, NewsletterCaptureForm)

Page Templates (1 par type de page — jamais de logique dupliquée entre routes)
├── HomeTemplate
│   ├── Hero (titre, CTA double, mascotte)
│   ├── StatsBar (compteurs dynamiques)
│   ├── SiloTileGrid (6 tuiles)
│   ├── FeaturedSeasonalTheme (thème actif par date)
│   ├── PuzzleCarousel (puzzles populaires)
│   └── AudienceCardRow (Enfants / Enseignants / Seniors)
│
├── CategoryTemplate                (réutilisé par TOUTES les catégories simples + combo)
│   ├── BreadcrumbTrail
│   ├── CategoryIntro (H1 + paragraphe gabarit)
│   ├── SubCategoryLinks            (si page pilier : liste des enfants)
│   ├── PuzzleCardGrid + Pagination
│   ├── FaqAccordion
│   └── RelatedCategoriesRow
│
├── PuzzleTemplate
│   ├── BreadcrumbTrail
│   ├── PuzzleHeader (titre, badges niveau/difficulté/taille)
│   ├── PuzzleGridServer → hydraté par PuzzleGridClient
│   ├── WordListPanel
│   ├── ActionBar (PrintButton, jouer en ligne toggle, RevealSolutionButton)
│   ├── RelatedPuzzlesGrid (6–8 cartes)
│   └── FaqAccordion (court)
│
├── ToolGeneratorTemplate
│   ├── ThemeChipSelector
│   ├── WordListTextarea
│   ├── SizeSegmentedControl
│   ├── DiagonalToggle
│   └── PuzzleGridClient (aperçu live)
│
├── ToolOnlinePlayTemplate
│   └── PuzzleGridClient (plein écran, timer, sélection difficulté/thème)
│
├── StaticArticleTemplate            (Solutions/Règles, Pédagogie, Personnages, Ressources, Presse)
│   └── contenu rédactionnel + CTA vers Générateur ou catégorie liée
│
└── SearchResultsTemplate
    ├── SearchBar + filtres facettés
    └── PuzzleCardGrid (même composant que CategoryTemplate)

Composants composites (consommés par plusieurs templates)
├── CategoryCard, PuzzleCard, GradeLevelCard, PdfDownloadCard
├── BreadcrumbTrail, FaqAccordion, SchemaJsonLd
└── NewsletterCaptureForm

Composant central (le plus critique du produit)
└── PuzzleGrid
    ├── Variante serveur (rendu HTML/SVG sémantique, lettres dans le DOM — exigence SEO/CWV)
    └── Variante client (hydratation : sélection, états de cellule — voir DESIGN_SYSTEM.md Section 5.4)
        États de cellule : default · selected · found (glow + étincelles) · hint

Atomes (design system — voir DESIGN_SYSTEM.md Section 3)
└── Button, Pill, Tag, Input, Textarea, Switch, ChipButton, SegmentedControlButton, CardShell
```

**Règle de composition :** `PuzzleGrid` est utilisé à 3 endroits (PuzzleTemplate, ToolGeneratorTemplate, ToolOnlinePlayTemplate) avec des props différentes (lecture seule + impression / aperçu live / plein écran chronométré) mais **un seul composant sous-jacent** — ne pas laisser Cursor AI créer trois implémentations de grille séparées, c'est le risque de divergence le plus probable sur ce projet.

---

## 5. Internal Linking Strategy

Reprend et opérationnalise les règles du PRD (Section 10) :

| Règle | Application technique |
|-------|---------------------------|
| Accueil → 6 hubs + 2 outils | Liens statiques dans `SiloTileGrid`, jamais générés dynamiquement |
| Catégorie pilier → ses sous-catégories | `SubCategoryLinks` interroge `Category.childCategories` (relation `parentCategoryId`) — toujours dérivé de la base, jamais codé en dur |
| Catégorie → puzzles | `PuzzleCardGrid` interroge `CategoryPuzzle`, tri popularité puis récence, pagination à 24 |
| Puzzle → catégorie(s) parente(s) + 6 puzzles liés + CTA outil | `BreadcrumbTrail` + `RelatedPuzzlesGrid` (algorithme de scoring, PRD Section 18) + CTA contextuel |
| Combo → catégorie niveau seule ET catégorie thème seule | double lien explicite dans `BreadcrumbTrail` ou bloc dédié — sans cette double remontée, les pages combo deviennent des îles |
| Aucune page orpheline | **À instrumenter en CI** : script de validation du graphe de liens (toute `Category`/`Puzzle` en statut `PUBLISHED` doit être atteignable depuis l'accueil en ≤3 sauts) — pas une vérification manuelle ponctuelle |
| 3 clics maximum | Même script CI que ci-dessus, calcule la profondeur réelle, échoue le build si dépassement |

**Décision à trancher avant le build, pas après :** le script de validation du graphe de liens (orphelins + profondeur) doit faire partie de la CI dès la Phase 1, pas ajouté en Phase 2 "quand on aura le temps" — c'est précisément le type de dette qui devient irrécupérable une fois qu'on a 1 000 pages au lieu de 100.


## 6. Build Order

Reprend l'ordre du PRD (Section 31) en y intégrant les décisions prises dans ce blueprint (script de validation du graphe de liens, champ `largePrint`, garde-fous anti-duplication de `PuzzleGrid`).

| # | Étape | Sortie attendue avant de passer à l'étape suivante |
|---|-------|-----------------------------------------------------|
| 1 | Setup projet (Next.js 15, TypeScript, Tailwind avec les tokens de `DESIGN_SYSTEM.md`, Prisma, CI/CD Vercel) | Build vide qui déploie |
| 2 | Schéma de base de données complet (12 modèles, Section 2 ci-dessus) + seed des référentiels (`Grade` ×7, `Difficulty` ×4, `Theme` ×~15) | Migrations appliquées, requêtes de base testées |
| 3 | Moteur de puzzle (génération + validation, PRD Section 25) | Tests Vitest verts sur les cas limites avant toute UI |
| 4 | Composants atomes + `PuzzleGrid` (variante serveur d'abord, puis client) | Un seul composant grille, utilisé en lecture seule sur une page de test |
| 5 | `CategoryTemplate` + `PuzzleTemplate` + `HomeTemplate` | Rendu correct avec données de seed, Lighthouse passable |
| 6 | Outils (`ToolGeneratorTemplate`, `ToolOnlinePlayTemplate`) | Bout en bout fonctionnel, réutilisent `PuzzleGrid` sans duplication |
| 7 | Export PDF | Génération à la demande + mise en cache (`pdf_url`) |
| 8 | Recherche (PostgreSQL full-text) | Résultats pertinents + fallback "0 résultat" vers le Générateur |
| 9 | SEO technique (sitemap, schema markup, robots, gabarits meta) + **script CI de validation du graphe de liens (Section 5)** | Aucune page orpheline, profondeur ≤3 clics vérifiée automatiquement |
| 10 | Admin panel v1 (auth, CRUD Puzzle/Category/Theme) | Équipe éditoriale autonome pour publier |
| 11 | Seed de contenu (~100–150 puzzles via script admin, pas manuellement) | Toutes les catégories MVP au-dessus du seuil de 4 puzzles |
| 12 | QA + Core Web Vitals | Lighthouse "Good" sur tous les gabarits, mobile réel testé |
| 13 | **Lancement MVP** | Voir Section 8 |
| 14 | Rollout programmatique Phase 2 (combos, AdSense, dashboard analytics, Adultes/Seniors + grand format) | — |
| 15 | Phase 3 (Solveur, comptes, langues, scaling 10k+) | — |

---

## 7. Technical Risks

| # | Risque | Impact si ignoré | Mitigation |
|---|--------|----------------------|----------------|
| 1 | **Pénalité "doorway pages" si le seuil de publication (4 puzzles min.) n'est pas appliqué en code** | Le risque SEO le plus sérieux du projet — Google peut désindexer massivement si le programmatique est perçu comme du contenu creux | Contrainte appliquée au niveau de la requête de publication (pas seulement une convention admin) + job nocturne qui repasse en `noindex` toute catégorie retombée sous le seuil (déjà spécifié au PRD Section 12, à faire respecter strictement) |
| 2 | **Trois implémentations divergentes de la grille de puzzle** (une par usage : page statique, générateur, jeu en ligne) | Bugs incohérents, dette de maintenance qui se multiplie par 3 à chaque correctif | Un seul composant `PuzzleGrid` paramétrable (Section 4) — à faire respecter dès l'étape 4 du build, pas corrigé après coup |
| 3 | **Timeout de fonction serverless sur la génération PDF** (Puppeteer/Chromium en environnement Vercel) | Échecs intermittents d'export PDF, perçus comme un bug produit par les enseignants/parents | Préférer `@react-pdf/renderer` comme chemin par défaut (pas de navigateur headless) ; réserver Puppeteer aux cas de mise en page complexe uniquement, en fonction dédiée avec budget de temps explicite |
| 4 | **Scaling de la génération de grille pour les tailles Géant (18–20×20, 18–25 mots)** | Le retry de placement (jusqu'à 100 tentatives/mot) peut devenir lent à grande échelle, surtout en génération en lot | Plafond de tentatives déjà spécifié (PRD 25.1) ; ajouter un budget de temps global par puzzle et faire échouer proprement (pas de boucle qui bloque un job de génération en lot entier) |
| 5 | **Sitemap généré à la demande sur 10 000+ URLs** | Latence/coût si recalculé à chaque requête de crawler | Pré-génération en arrière-plan + cache, invalidée uniquement à la publication (pas à chaque visite de `/sitemap.xml`) |
| 6 | **Cannibalisation entre catégorie "niveau seul" et catégorie combo du même niveau** | Deux URLs du site en concurrence sur la même requête, dilution du signal SEO | Monitoring actif via Search Console (déjà au PRD Section 34) ; différencier strictement le contenu des deux gabarits dès la rédaction des textes-gabarits, pas seulement par l'intention de mots-clés |
| 7 | **Geste tactile de sélection de mot en conflit avec le scroll de page sur mobile** | Frustration utilisateur sur l'appareil dominant de la persona Enfants | `touch-action: none` sur le composant grille + tests manuels sur device réel (déjà prévu au MVP checklist, mais c'est un risque d'interaction, pas seulement de check-list) |
| 8 | **Conformité publicité enfants (AdSense) non tranchée avant la Phase 2** | Blocage de la monétisation ou risque de non-conformité RGPD/traitement adapté aux enfants | Revue juridique à déclencher en parallèle du développement Phase 2, pas après l'intégration technique d'AdSense (déjà signalé au PRD, à traiter comme un risque de calendrier, pas une note de bas de page) |
| 9 | **Banque de mots (`ThemeWord`) insuffisante pour certains thèmes/niveaux** | Génération en lot produisant des grilles répétitives ou de mauvaise qualité éditoriale, invisible jusqu'à ce qu'un humain les relise | Définir un seuil minimum de mots disponibles par combinaison thème×niveau avant d'autoriser la génération en lot pour cette combinaison (garde-fou de données, pas seulement de code) |
| 10 | **Sur-scaling du programmatique avant validation du signal de trafic** | Des milliers de pages combo Tier 3 publiées avant que le taux d'indexation des paliers précédents soit confirmé | Respecter strictement le plan de scaling par palier du PRD (Section 35) — la vitesse de publication est pilotée par les métriques d'indexation réelles, jamais par un calendrier fixe |

---

## 8. MVP Launch Checklist

Organisée par domaine de responsabilité plutôt qu'en liste plate, pour assigner clairement la propriété de chaque vérification.

**Infrastructure & données**
- [ ] Schéma DB déployé en production, migrations validées, référentiels seedés (grades, difficulties, themes initiaux)
- [ ] Champ `Puzzle.largePrint` présent dès le MVP, même si le silo Seniors n'est pas encore complet
- [ ] Script CI de validation du graphe de liens actif (zéro orpheline, profondeur ≤3 clics)

**Moteur de puzzle**
- [ ] Tests Vitest verts sur tous les cas limites (Section 25.5 du PRD)
- [ ] ~100–150 puzzles publiés, aucune catégorie sous le seuil de 4 puzzles
- [ ] Génération PDF fonctionnelle de bout en bout (grille + corrigé)

**Produit**
- [ ] Générateur et Jeu en ligne fonctionnels de bout en bout, tous deux sur le composant `PuzzleGrid` unique
- [ ] Geste de sélection de mot testé sur device tactile réel (pas seulement émulateur)

**SEO & technique**
- [ ] Tous les gabarits passent Lighthouse "Good" (LCP/INP/CLS) en mobile
- [ ] Schema markup validé (Rich Results Test) sur chaque type de page
- [ ] Sitemap dynamique généré, mis en cache, soumis à Search Console
- [ ] `robots.txt` vérifié, aucune page admin/API indexable
- [ ] Breadcrumbs corrects sur un échantillon de chaque silo

**Conformité**
- [ ] Mentions légales, politique de confidentialité, page contact en place
- [ ] Position juridique sur la publicité enfant-cible tranchée avant tout engagement de calendrier Phase 2 AdSense

**Outils & exploitation**
- [ ] Admin panel : auth fonctionnelle, CRUD Puzzle/Category opérationnel pour l'équipe éditoriale
- [ ] GA4 + Search Console connectés et vérifiés
- [ ] Recherche interne fonctionnelle avec fallback "0 résultat" vers le Générateur

---

*Documents de référence : `PRD_Mots_Meles.md` (stratégie produit/SEO complète), `DESIGN_SYSTEM.md` (tokens et composants visuels), `style-guide.html` (démonstration interactive). Ce blueprint ne remplace aucun des trois — il les arbitre et fixe l'ordre d'exécution.*
