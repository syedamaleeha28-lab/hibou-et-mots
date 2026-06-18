# PRD — Site Mots Mêlés (Plateforme Française de Jeux de Mots Mêlés Éducatifs)

**Type de document :** Product Requirements Document — destiné à l'implémentation directe via Cursor AI
**Stack cible :** Next.js 15 (App Router) · TypeScript · Tailwind CSS · PostgreSQL · Prisma · Vercel
**Fondation :** Carte topique de 1 703 mots-clés, 25 clusters, 6 silos parents, 47 550 recherches/mois mesurées (déjà livrée — voir `topical_map_mots_meles.xlsx`)
**Objectif :** 100 000+ visites organiques/mois, couverture complète de la niche "mots mêlés" en France

> **Note pour Cursor AI :** ce document est la source de vérité unique du projet. Chaque section contient des spécifications directement exploitables (schémas, structures de données, conventions de nommage, arborescences d'URL). Implémenter dans l'ordre indiqué en Section 30 ("Build Order"). Ne pas inventer de structure de données qui contredit la Section "Database Design" — l'étendre si nécessaire, mais en respectant les conventions de nommage `snake_case` en base et `camelCase` côté TypeScript/Prisma.

---

## 1. Executive Summary

Le projet consiste à construire le site de référence francophone pour les jeux de "mots mêlés" (word search), combinant trois piliers : (1) un moteur de génération de grilles propriétaire permettant de produire des milliers de puzzles uniques et imprimables, (2) une architecture de contenu programmatique calquée sur la carte topique déjà établie (niveau scolaire × thème × saison × difficulté), et (3) deux outils interactifs (générateur personnalisé, jeu jouable en ligne) qui constituent la différenciation produit face à des concurrents purement statiques.

L'analyse de mots-clés préalable a identifié que le terme générique "mots meles" capte 28 000 recherches/mois (KD 7,5) et que la longue traîne combinatoire (niveau scolaire × thème × saison) représente un potentiel de centaines de pages à compétition quasi nulle. Le site doit donc être conçu, dès l'architecture technique, pour scaler vers 10 000+ pages indexées sans dette technique ni pénalité de contenu dupliqué — chaque page programmatique doit contenir un puzzle réellement unique (la grille elle-même), ce qui constitue la meilleure défense structurelle contre le risque de "thin content".

Le public cible est large et hétérogène (enfants 6-12 ans, parents, enseignants du primaire, seniors en activité cognitive), ce qui impose une UX modulaire : ludique et colorée pour les enfants, fonctionnelle et rapide pour les parents/enseignants (impression PDF en 2 clics), accessible et grand format pour les seniors.

---

## 2. Business Goals

| # | Objectif | Métrique cible | Horizon |
|---|----------|-----------------|---------|
| 1 | Couvrir l'intégralité de la niche "mots mêlés" identifiée dans la carte topique | 25/25 clusters couverts par au moins 1 page live | Fin MVP (M0–M3) |
| 2 | Atteindre 100 000 visites organiques/mois | Google Search Console + GA4 | 18–24 mois |
| 3 | Construire une douve produit via les outils interactifs | Générateur + jeu en ligne live et utilisés (>10% des sessions) | MVP |
| 4 | Scaler le contenu programmatique sans pénalité qualité | 10 000+ pages indexées, taux d'indexation >80% | 12–18 mois |
| 5 | Monétiser le trafic | AdSense actif dès Phase 2 ; RPM suivi au dashboard admin | Phase 2 |
| 6 | Maintenir une expérience technique irréprochable | Core Web Vitals "Good" sur 100% des templates de page | Continu, dès MVP |
| 7 | Devenir la référence "presse & marques" pour les mots mêlés de journaux | Pages Ouest-France / Notre Temps / Le Parisien / 20 Minutes live et indexées | M1–M2 |

**Modèle de revenu envisagé (ordre de priorité) :** (1) AdSense display (volume de pages + faible friction = bon fit), (2) affiliation produits physiques (livres/jeux Goliath identifiés dans le cluster "Produits & Ressources Tierces"), (3) offre premium sans publicité / packs PDF thématiques téléchargeables en Phase 3, (4) API/export B2B pour enseignants (fiches en lot) en Phase 3.

---

## 3. User Personas

### 3.1 Enfants (6–12 ans)
- **Contexte d'usage :** tablette ou ordinateur familial/scolaire, souvent supervisé par un parent ou enseignant ; faible tolérance à la friction et au texte dense.
- **Objectifs :** s'amuser, réussir rapidement, voir une récompense visuelle (confettis, mascotte qui félicite).
- **Douleurs actuelles :** sites concurrents surchargés de publicités intrusives, grilles trop difficiles ou trop scolaires, pas de guidage visuel.
- **Pages d'entrée typiques :** `/jouer-mots-meles-en-ligne/`, pages thématiques (`/mots-meles-thematiques/animaux/`), pages saisonnières.
- **Device dominant :** mobile/tablette tactile.

### 3.2 Parents
- **Contexte d'usage :** recherche rapide sur mobile ou desktop pendant les vacances, le mercredi, ou un trajet ; cherche une activité "écran productif" ou une impression rapide.
- **Objectifs :** trouver et imprimer une grille adaptée à l'âge de l'enfant en moins de 60 secondes, gratuitement, sans création de compte.
- **Douleurs actuelles :** PDF payants ou nécessitant un compte, sites avec popups agressifs, grilles non adaptées à l'âge.
- **Pages d'entrée typiques :** `/mots-meles-gratuits/`, `/mots-meles-a-imprimer/`, `/mots-meles-enfants/`, pages saisonnières (Noël, Halloween, anniversaire).
- **Device dominant :** mobile en recherche, bascule desktop pour imprimer.

### 3.3 Enseignants (primaire, CP à 6e)
- **Contexte d'usage :** préparation de classe, recherche de fiches alignées sur le programme et le niveau exact (CP, CE1, CE2, CM1, CM2).
- **Objectifs :** télécharger des fiches PDF prêtes à imprimer en lot, avec corrigé, alignées sur un thème pédagogique (vocabulaire, saisons, histoire des arts).
- **Douleurs actuelles :** contenu non calibré par niveau scolaire réel, absence de corrigé, mise en page non imprimable proprement (gaspillage d'encre/papier).
- **Pages d'entrée typiques :** `/mots-meles-ecole/`, pages par niveau (`/mots-meles-ecole/ce1/`), `/mots-meles-pedagogie/`.
- **Device dominant :** desktop.

### 3.4 Seniors
- **Contexte d'usage :** activité de gymnastique cognitive, à domicile ou en EHPAD/club seniors ; lecture parfois difficile (vue), motricité fine parfois réduite si usage tactile.
- **Objectifs :** grilles en gros caractères, contraste élevé, niveau de difficulté adapté (ni trop facile, ni illisible), impression simple.
- **Douleurs actuelles :** police trop petite, grilles trop denses, interfaces en ligne peu accessibles (boutons trop petits, navigation confuse).
- **Pages d'entrée typiques :** `/mots-meles-seniors/`, `/mots-meles-difficulte/`, `/mots-meles-a-imprimer/`.
- **Device dominant :** desktop ou tablette ; nécessite un mode "grand format / haute lisibilité" dédié (voir Section 24 — Accessibilité).

---

## 4. Site Architecture

L'architecture suit la structure en silos déjà validée par la carte topique (homepage → 6 silos parents → catégories → puzzles individuels).

```
/ (Accueil)
│
├── SILO 1 — Hub Principal
│   ├── /mots-meles-gratuits/
│   ├── /mots-meles-a-imprimer/                    [Pilier]
│   ├── /jouer-mots-meles-en-ligne/                [Outil]
│   ├── /generateur-mots-meles/                    [Outil]
│   ├── /mots-meles-difficulte/{niveau}/
│   ├── /mots-meles-langues/{langue}/
│   ├── /application-mots-meles/
│   └── /solutions-regles-mots-meles/
│
├── SILO 2 — Par Public
│   ├── /mots-meles-enfants/
│   ├── /mots-meles-adultes/
│   └── /mots-meles-seniors/
│
├── SILO 3 — Éducation / École                     [Pilier programmatique]
│   ├── /mots-meles-ecole/
│   ├── /mots-meles-ecole/{niveau}/                 (maternelle, cp, ce1, ce2, cm1, cm2, 6e)
│   ├── /mots-meles-ecole/{niveau}/{theme}/          (combo Tier 1)
│   └── /mots-meles-pedagogie/
│
├── SILO 4 — Saisonnier & Thématique                [Pilier programmatique]
│   ├── /mots-meles-fetes-saisons/
│   ├── /mots-meles-fetes-saisons/{theme}/           (noel, halloween, paques, carnaval, ...)
│   ├── /mots-meles-thematiques/
│   ├── /mots-meles-thematiques/{theme}/             (animaux, sport, voyage, ...)
│   └── /mots-meles-personnages/
│
├── SILO 5 — Presse & Marques
│   ├── /mots-meles-journaux-magazines/
│   └── /mots-meles-journaux-magazines/{marque}/     (ouest-france, notre-temps, le-parisien, 20-minutes, le-figaro)
│
├── SILO 6 — Produits & Ressources Tierces
│   ├── /jeux-magazines-mots-meles/
│   └── /ressources-enseignants-mots-meles/
│
└── PUZZLES (namespace plat, lié depuis toutes les catégories pertinentes)
    └── /mots-meles/{slug-puzzle}/
```

**Règle de profondeur :** aucune page ne doit être à plus de 3 clics de l'accueil (Accueil → Catégorie → Puzzle, ou Accueil → Sous-catégorie → Puzzle). Les pages combo (`{niveau}/{theme}`) sont à 3 clics depuis l'accueil via leur catégorie parente.

---

## 5. Category Structure

Les catégories sont **entièrement pilotées par base de données** (table `categories`, voir Section "Database Design") — aucune catégorie ne doit être codée en dur dans le front-end. Chaque catégorie a un `type` parmi :

| Type | Exemple | Page parente | Combinable ? |
|------|---------|---------------|----------------|
| `grade` | CE1 | `/mots-meles-ecole/` | Oui, avec `theme` |
| `theme` | Noël, Animaux | `/mots-meles-thematiques/` ou `/mots-meles-fetes-saisons/` | Oui, avec `grade` |
| `seasonal` | Halloween | `/mots-meles-fetes-saisons/` | Oui, avec `grade` |
| `difficulty` | Facile, Géant | `/mots-meles-difficulte/` | Oui, avec `audience` |
| `audience` | Enfants, Seniors | (racine silo 2) | Oui, avec `difficulty` |
| `press_brand` | Ouest-France | `/mots-meles-journaux-magazines/` | Non |
| `combo` | CE1 + Noël | `/mots-meles-ecole/ce1/` | — (résultat de combinaison) |

**Règle de publication :** une page de catégorie (y compris combo) ne passe en `status = published` (et donc indexable) que lorsqu'elle contient **au moins 4 puzzles publiés**. En dessous de ce seuil, la page reste accessible mais en `noindex, follow` pour éviter les pages "vides" perçues comme thin content par Google. Ce seuil est un paramètre admin configurable (voir Section "Admin Panel").

---

## 6. Theme Structure

Thèmes initiaux (basés sur les clusters `TOPIC` et `SEAS_*` de la carte topique), organisés en groupes pour la navigation et le planning éditorial :

| Groupe | Thèmes (slug) |
|--------|----------------|
| Saisons & Fêtes | `noel`, `halloween`, `paques`, `carnaval`, `ete`, `hiver`, `automne`, `printemps`, `anniversaire`, `mariage`, `rentree`, `chandeleur`, `fete-des-meres` |
| Nature & Animaux | `animaux`, `fruits`, `legumes`, `insectes`, `dinosaures`, `zoo`, `chats-et-chiens` |
| Monde & Voyage | `pays-du-monde`, `drapeaux`, `europe`, `egypte-ancienne` |
| Sport & Loisirs | `sport`, `football`, `jeux-olympiques`, `ski` |
| École & Savoir | `vocabulaire`, `histoire-des-arts`, `sciences`, `metiers`, `mois-de-l-annee`, `couleurs` |
| Famille & Quotidien | `famille`, `meteo`, `corps-humain`, `alimentation` |

Chaque thème = un enregistrement dans la table `themes` avec : slug, nom affiché, groupe, icône (SVG, style mascotte cohérent), description SEO, `is_seasonal` (booléen), `active_date_range` (pour mise en avant automatique sur l'accueil — ex. Noël actif du 15 nov. au 6 jan., Halloween du 1er au 31 oct.).

**Priorité de déploiement :** Noël (170/mo) et Halloween (70/mo) en premier (déjà validés par données réelles de la carte topique), puis Animaux/Sport/Pâques/Carnaval, puis le reste du catalogue en Phase 2/3.

---

## 7. Grade-Level Structure (Niveau Scolaire)

| Slug | Nom affiché | Âge | Taille de grille par défaut | Complexité lexicale |
|------|-------------|-----|-------------------------------|------------------------|
| `maternelle` | Maternelle (PS/MS/GS) | 3–5 ans | 8×8 | Mots de 3–5 lettres, sans accents complexes |
| `cp` | CP | 6 ans | 8×8 | Mots de 3–6 lettres |
| `ce1` | CE1 | 7 ans | 10×10 | Mots de 4–7 lettres |
| `ce2` | CE2 | 8 ans | 10×10 | Mots de 4–8 lettres |
| `cm1` | CM1 | 9 ans | 12×12 | Mots de 5–9 lettres, diagonales activées |
| `cm2` | CM2 | 10 ans | 12×12 | Mots de 5–10 lettres, diagonales + inversé |
| `6e` | 6e (Collège) | 11 ans | 15×15 | Mots de 6–12 lettres, toutes directions |

Chaque niveau = un enregistrement dans la table `grades`, avec règles de génération par défaut (taille de grille, nombre de mots, directions autorisées) injectées automatiquement au moteur de puzzle lors d'une génération liée à ce niveau (voir Section "Puzzle Engine").

---

## 8. URL Structure

Convention : tout en minuscules, slugs séparés par tirets, slash final systématique, pas d'accents ni de caractères spéciaux dans les URLs (Noël → `noel`).

```
/                                                          Accueil
/mots-meles-gratuits/                                      Catégorie
/mots-meles-a-imprimer/                                     Catégorie pilier
/jouer-mots-meles-en-ligne/                                  Outil
/generateur-mots-meles/                                      Outil
/mots-meles-difficulte/                                       Catégorie hub
/mots-meles-difficulte/{facile|moyen|difficile|geant}/       Sous-catégorie
/mots-meles-enfants/  /mots-meles-adultes/  /mots-meles-seniors/   Catégorie (audience)
/mots-meles-ecole/                                            Catégorie pilier (hub niveaux)
/mots-meles-ecole/{niveau}/                                   Catégorie (grade)
/mots-meles-ecole/{niveau}/{theme}/                            Catégorie combo (Tier 1 programmatique)
/mots-meles-pedagogie/                                         Article support
/mots-meles-fetes-saisons/                                     Catégorie pilier (hub saisons)
/mots-meles-fetes-saisons/{theme}/                             Catégorie (saisonnier)
/mots-meles-thematiques/                                       Catégorie pilier (hub thèmes)
/mots-meles-thematiques/{theme}/                                Catégorie (thème)
/mots-meles-personnages/                                        Article support
/mots-meles-journaux-magazines/                                 Catégorie hub
/mots-meles-journaux-magazines/{marque}/                        Article support (presse)
/jeux-magazines-mots-meles/   /ressources-enseignants-mots-meles/   Article support
/mots-meles-langues/{langue}/                                    Catégorie (Phase 3)
/application-mots-meles/   /solutions-regles-mots-meles/          Statique
/mots-meles/{slug-puzzle}/                                       Page Puzzle (namespace plat)
/recherche/?q={query}                                            Résultats de recherche (noindex,follow)
/generateur-mots-meles/resultat/{id}/                             Puzzle généré à la volée (noindex)
```

**Pourquoi un namespace plat pour les puzzles (`/mots-meles/{slug}/`) plutôt qu'imbriqué sous chaque catégorie ?** Un même puzzle peut appartenir à plusieurs catégories (ex. "Noël CE1" relève à la fois du thème Noël et du niveau CE1). Un slug plat avec une URL canonique unique évite toute duplication/canonicalisation complexe, tandis que la relation many-to-many (`category_puzzles`) permet au puzzle d'apparaître dans toutes les listes de catégories pertinentes sans dupliquer la page.

**Convention de slug puzzle :** `{theme-ou-grade}-{difficulte}-{numero}` — ex. `noel-ce1-facile-01`, `animaux-difficile-07`, `halloween-geant-03`.

---

## 9. Navigation Structure

**Header (desktop) :**
`Logo` · `Imprimer ▾` (mega-menu : par Thème / par Niveau / par Difficulté) · `Jouer en ligne` · `Créer ma grille` · `École ▾` (par niveau) · `Plus ▾` (Adultes, Seniors, Presse, Ressources) · icône Recherche

**Header (mobile) :** Logo + icône Recherche + icône Menu (hamburger → drawer plein écran reprenant la mega-menu en accordéon)

**Bottom tab bar (mobile uniquement, position fixe) :** Accueil · Imprimer · Jouer · Créer · Recherche — 5 icônes, conforme au pattern Duolingo/app éducative, cible tactile ≥44px.

**Footer (sitemap complet) :** colonnes reprenant les 6 silos avec leurs catégories principales, + colonne légale (mentions légales, politique de confidentialité, contact, à propos) + réseaux sociaux.

---

## 10. Internal Linking Rules

1. **Accueil → tous les hubs de silo** (lien direct vers les 6 pages racines de silo + les 2 outils).
2. **Page de catégorie pilier → toutes ses sous-catégories** (ex. `/mots-meles-ecole/` liste les 7 niveaux ; `/mots-meles-fetes-saisons/` liste tous les thèmes saisonniers publiés).
3. **Page de catégorie → 6 à 12 cartes puzzles** appartenant à cette catégorie (via la table `category_puzzles`), avec pagination après 24 puzzles.
4. **Page puzzle → catégorie(s) parente(s)** (breadcrumb + lien explicite "Voir tous les mots mêlés {thème}"), **+ 6 puzzles liés** (voir Section 18 — Related Puzzle Logic), **+ CTA vers le Générateur** ("Créez votre propre grille").
5. **Pages combo (`{niveau}/{theme}`) → catégorie niveau seule ET catégorie thème seule** (double rattachement pour le maillage), en plus de leurs puzzles.
6. **Aucune page orpheline** : toute page créée (catégorie ou puzzle) doit être liée depuis au moins une page de catégorie parente ET apparaître dans le sitemap XML au moment de la publication.
7. **Liens vers les outils omniprésents** : chaque page de catégorie et chaque page puzzle inclut un CTA secondaire vers `/generateur-mots-meles/` ou `/jouer-mots-meles-en-ligne/` selon le contexte.
8. **Pas plus de 3 clics** entre l'accueil et n'importe quelle page (cf. Section 4).

---

## 11. SEO Strategy

- **Couverture totale de la carte topique :** chaque cluster identifié (25) doit avoir une page dédiée et indexée avant la fin du MVP.
- **Title/Meta par type de page :** gabarits dynamiques (voir Section 13 — Content Templates) générant un title/H1/meta unique par combinaison de variables (niveau, thème, difficulté), jamais de title dupliqué.
- **Canonicalisation :** chaque page combo est auto-canonique (ne pointe pas vers son parent) — c'est une page à part entière avec une intention de recherche propre (ex. "mots mêlés CE1 Noël" est différent de "mots mêlés CE1").
- **Indexation conditionnelle :** `noindex,follow` automatique pour toute catégorie sous le seuil de 4 puzzles publiés, pour les résultats de recherche, et pour les puzzles générés à la volée via l'outil Générateur (non curés).
- **Défense anti-duplicate-content :** chaque page programmatique contient (a) un puzzle visuellement unique (la grille), (b) un paragraphe d'introduction généré à partir d'un gabarit avec variables substituées (jamais de texte 100% identique entre deux pages), (c) un bloc FAQ thématique variant selon le type de catégorie.
- **Budget de crawl :** sitemaps segmentés par type (voir Section 21), priorité de soumission aux clusters à fort volume d'abord (Gratuits, Imprimer, Enfants, École) puis montée en charge progressive du programmatique.
- **Indexation mobile-first :** rendu serveur (RSC) garanti identique mobile/desktop, pas de contenu caché conditionnellement à la largeur d'écran sans qu'il soit dans le DOM.
- **Pas de hreflang requis** (marché unique fr-FR au lancement) ; prévoir `lang="fr"` sur `<html>` et structure prête pour extension Belgique/Suisse/Québec en Phase 3.


## 12. Programmatic SEO Framework

| Modèle | Variables | Pages estimées | Priorité | Condition de publication |
|--------|-----------|-------------------|-----------|------------------------------|
| Niveau × Thème | 7 niveaux × ~15 thèmes | 80–105 | Tier 1 | ≥4 puzzles générés pour la combinaison |
| Saisonnier (thème seul) | ~13 fêtes/saisons | 13 | Tier 1 | ≥6 puzzles |
| Thématique (thème seul) | ~25 thèmes de vocabulaire | 25 | Tier 2 | ≥6 puzzles |
| Public × Difficulté | 3 publics × 4 difficultés | 12 | Tier 2 | ≥4 puzzles |
| Niveau × Thème × Difficulté | extension Tier 1 | +200 (Phase 2) | Tier 3 | ≥4 puzzles |
| Langue × Thème (Phase 3) | 3 langues × thèmes scolaires | ~10 | Tier 4 | ≥4 puzzles |

**Pipeline de génération de contenu (à automatiser dans l'admin) :**
1. Sélection de la combinaison (ex. `grade=ce1`, `theme=noel`).
2. Génération automatique de N puzzles (N≥6) via le moteur (Section "Puzzle Engine"), avec liste de mots tirée d'un dictionnaire thématique pré-rempli (table `theme_word_banks`, à créer — liste de mots associés à chaque thème, filtrée par longueur selon le niveau).
3. Génération du texte de la page catégorie via gabarit (Section 13) avec variables substituées.
4. Statut `draft` jusqu'à validation manuelle ou automatique (seuil de puzzles atteint + QA automatique passée — voir "Puzzle validation logic").
5. Passage à `published`, ajout automatique au sitemap, injection des liens internes (catégorie parente niveau + catégorie parente thème).

**Garde-fou qualité :** un job de validation (cron/queue) vérifie chaque nuit qu'aucune page publiée n'est tombée sous le seuil minimum de puzzles (ex. suite à une dépublication manuelle) et repasse automatiquement en `noindex` si c'est le cas.

---

## 13. Content Templates

Gabarits de texte avec variables `{grade}`, `{theme}`, `{difficulty}`, `{count}` substituées dynamiquement. Plusieurs variantes par slot (rotation aléatoire déterministe basée sur l'ID de catégorie) pour éviter toute répétition exacte entre pages voisines.

**Title :** `Mots Mêlés {Theme} {Grade} — {count} Grilles Gratuites à Imprimer`
**H1 :** `Mots Mêlés {Theme} pour {Grade}`
**Meta description :** `Découvrez {count} grilles de mots mêlés {theme} adaptées au niveau {grade}, gratuites, imprimables en PDF et jouables en ligne.`

**Paragraphe d'introduction (gabarit, 2–3 variantes) :**
> Variante A : « Envie d'associer {theme} et apprentissage du vocabulaire ? Ces grilles de mots mêlés conçues pour le niveau {grade} permettent de réviser en s'amusant. Imprimez-les gratuitement ou jouez directement en ligne. »
> Variante B : « Voici une sélection de mots mêlés sur le thème {theme}, calibrés pour les élèves de {grade}. Chaque grille est imprimable en PDF avec corrigé, ou jouable directement depuis le navigateur. »

**Bloc « Comment jouer »** (statique, identique sur toutes les pages catégorie/puzzle — court, 3 étapes illustrées par icônes : 1. Repérez un mot de la liste 2. Tracez-le dans la grille (horizontal, vertical ou diagonal) 3. Trouvez tous les mots pour terminer).

**Bloc FAQ (3–5 questions, gabarit par type de catégorie) :**
- Catégorie `grade` : "À partir de quel âge peut-on faire des mots mêlés {grade} ?", "Les mots mêlés aident-ils à apprendre le vocabulaire en {grade} ?"
- Catégorie `theme`/`seasonal` : "Quels mots trouve-t-on dans une grille {theme} ?", "Puis-je imprimer ces mots mêlés {theme} gratuitement ?"
- Catégorie `combo` : combine les deux ensembles ci-dessus.

**Bloc CTA :** « Imprimer cette grille » / « Jouer en ligne » / « Créer ma propre grille {theme} » → lien vers `/generateur-mots-meles/?theme={theme}`.

---

## 14. Category Page Templates

| | |
|---|---|
| **Purpose** | Lister et donner accès à toutes les grilles d'une catégorie donnée (niveau, thème, saison, difficulté, public, combo) ; servir de hub de maillage interne. |
| **SEO objective** | Capter le volume de recherche du cluster correspondant (ex. cluster `GRADE_LEVEL`, `SEAS_OTHER`) ; ranking cible : 0–6 mois pour les catégories à KD≤5, 6–12 mois pour les hubs à KD 5–15. |
| **Required components** | Breadcrumb · H1 dynamique · paragraphe d'intro (gabarit) · liste des sous-catégories (si page pilier) · grille de cartes puzzles (vignette + titre + badges niveau/difficulté) avec pagination (24/page) · bloc "Comment jouer" · bloc FAQ (schema FAQPage) · bloc catégories liées · emplacements publicitaires (in-feed toutes les 8 cartes, sidebar desktop) |
| **Data requirements** | `Category` (slug, type, seo fields, intro_text, faq_json) · liste paginée de `Puzzle` via `category_puzzles` (triés par popularité puis récence) · sous-catégories enfants si `parent_category_id` référencé · catégories "liées" (même groupe de thème, ou niveau adjacent) |

---

## 15. Puzzle Page Templates

| | |
|---|---|
| **Purpose** | Page de destination finale : afficher une grille spécifique, jouable et imprimable, avec son corrigé. |
| **SEO objective** | Capter la longue traîne ultra-spécifique et consolider l'autorité thématique de la catégorie parente ; contenu unique (la grille) = défense anti-duplicate-content. |
| **Required components** | Breadcrumb · H1 (`Mots Mêlés {Theme/Grade} — {Titre spécifique}`) · grille interactive (composant client, voir 15.1) · liste des mots à trouver (cochée au fur et à mesure en mode jeu) · badges (niveau, difficulté, taille) · bouton "Télécharger le PDF" · bouton "Jouer en ligne" / "Imprimer" (toggle de mode) · bouton "Voir la solution" (reveal) · timer optionnel · bloc "Mots mêlés similaires" (6–8 cartes, Section 18) · breadcrumb + lien retour catégorie · bloc FAQ court · emplacement publicitaire (1 above-the-fold désactivé pour ne pas nuire au CWV, 1 in-content après la grille, 1 sous les puzzles liés) |
| **Data requirements** | `Puzzle` complet (grid_data, word_list, solution_data, size, difficulty, grade_id, theme_id, slug, meta, pdf_url) · catégories parentes (via `category_puzzles`) pour le breadcrumb · liste de puzzles liés calculée à la requête (Section 18) |

**15.1 Composant grille interactif — exigences techniques :** rendu initial **côté serveur** (RSC) sous forme de table HTML/SVG sémantique (pas de canvas pur, pour le SEO et l'accessibilité — le texte des lettres doit être dans le DOM) ; l'interactivité (sélection/tracé de mot, surlignage) est hydratée côté client via un petit composant isolé (`<PuzzleGridClient>`) pour limiter le JS chargé sur les pages à fort trafic. Le mode impression utilise un composant séparé optimisé pour le rendu PDF (voir Puzzle Engine).

---

## 16. Homepage Layout

1. **Hero** — Titre H1 ("Mots Mêlés Gratuits à Imprimer et à Jouer en Ligne"), sous-titre, barre de recherche/CTA double ("Imprimer une grille" / "Créer ma grille"), mascotte illustrée.
2. **Bandeau de confiance** — compteurs dynamiques ("X grilles disponibles", "Y thèmes", "100% gratuit").
3. **Tuiles de silos** — 6 tuiles cliquables vers les hubs de silo (icône + nom + courte accroche), reprenant la structure de la Section 4.
4. **Thème du moment** — mise en avant automatique du thème saisonnier actif (`themes.active_date_range`, ex. Noël en décembre).
5. **Puzzles populaires** — carrousel des 8–12 puzzles les plus vus (basé sur `view_count`).
6. **Comment ça marche** — 3 étapes illustrées (Choisir → Jouer/Imprimer → Apprendre).
7. **Section par public** — 3 cartes (Enfants / Enseignants / Seniors) renvoyant vers les pages publics dédiées.
8. **Footer sitemap complet** (Section 9).

---

## 17. Search Functionality

- **Index :** recherche plein texte PostgreSQL (`pg_trgm` + `tsvector`) sur `puzzles.title`, `themes.name`, `grades.name`, suffisant jusqu'à ~10–15k pages ; migration vers Meilisearch envisageable en Phase 3 si latence dégradée.
- **UI :** barre de recherche dans le header (desktop) et plein écran (mobile), autosuggestion dès 2 caractères (debounce 200ms), filtres facettés (thème, niveau, difficulté, taille de grille).
- **Page de résultats** (`/recherche/?q=`) : même gabarit de carte que les pages catégorie, `noindex,follow`, fallback explicite si 0 résultat ("Aucun résultat — créez votre propre grille avec ce mot" → CTA Générateur).

---

## 18. Related Puzzle Logic

Algorithme de scoring exécuté à la requête (ou mis en cache 1h via ISR) :

```
score(puzzle_candidat) =
    3 × (même theme_id que le puzzle courant)
  + 2 × (même grade_id que le puzzle courant)
  + 1 × (même difficulty_id que le puzzle courant)
  + 0.5 × log(view_count + 1)        // léger biais de popularité
exclude: puzzle courant lui-même
fallback: si < 6 résultats avec score > 0, compléter avec les puzzles
          les plus populaires de la même catégorie parente
limit: 6 (page puzzle) / 8 (bloc "vous aimerez aussi" en bas de catégorie)
order: score DESC, view_count DESC
```

---

## 19. Breadcrumb Structure

Format : `Accueil > {Silo} > {Catégorie} > {Sous-catégorie si combo} > {Puzzle}`, avec balisage `BreadcrumbList` JSON-LD sur chaque page.

Exemples concrets :
- `Accueil > École > CE1 > Mots Mêlés CE1` (page catégorie niveau)
- `Accueil > École > CE1 > Noël > Mots Mêlés CE1 Noël` (page catégorie combo)
- `Accueil > École > CE1 > Noël > Sapin et Cadeaux` (page puzzle, titre spécifique)
- `Accueil > Presse & Marques > Mots Mêlés Ouest-France` (page support)


## 20. Schema Markup Requirements

| Type de page | Schema(s) JSON-LD requis |
|---------------|------------------------------|
| Toutes les pages | `BreadcrumbList` |
| Accueil | `WebSite` (+ `SearchAction` pour le sitelinks search box), `Organization` |
| Catégorie | `ItemList` (liste des puzzles), `FAQPage` (bloc FAQ) |
| Puzzle | `CreativeWork` avec `learningResourceType: "puzzle"`, `educationalLevel` (= grade si applicable), `audience`, `isAccessibleForFree: true`, `image` (vignette de la grille) |
| Outils (Générateur / Jeu en ligne) | `SoftwareApplication` (`applicationCategory: "GameApplication"`, `offers.price: "0"`) |
| Pages presse/marques | `Article` ou `WebPage` standard |
| Page "Solutions, Règles" | `HowTo` (étapes pour jouer) en complément du `WebPage` |

---

## 21. Sitemap Strategy

```
/sitemap.xml                          → index référençant les sitemaps ci-dessous
/sitemaps/sitemap-static.xml          → accueil, hubs de silo, pages statiques (~30 URLs)
/sitemaps/sitemap-categories.xml      → toutes les catégories publiées (grade/theme/seasonal/combo/...)
/sitemaps/sitemap-puzzles-{n}.xml     → puzzles publiés, paginés par lots de 5 000 URLs
/sitemaps/sitemap-images.xml          → vignettes des grilles (balisage image sitemap)
```

- Génération **dynamique** via route Next.js (`app/sitemaps/.../route.ts`), régénérée à chaque publication (webhook depuis l'admin) plutôt qu'un fichier statique figé au build.
- `lastmod` reflète `updated_at` réel de chaque enregistrement.
- Priorité décroissante : silos/hubs (1.0) > catégories niveau/thème (0.8) > catégories combo (0.6) > puzzles individuels (0.5).
- Soumission progressive à Search Console par lot (ne pas soumettre 10 000 URLs le jour 1 — suivre le plan de scaling en Section 34).

---

## 22. Technical SEO Requirements

- `robots.txt` : `Disallow: /admin/`, `/api/`, `/recherche/`, `/generateur-mots-meles/resultat/` ; `Allow: /` sinon ; référence au `sitemap.xml`.
- **Canonical** : self-referencing sur toutes les pages indexables ; jamais de canonical vers une page parente pour les pages combo (intention de recherche distincte).
- **Noindex automatique** : catégories <4 puzzles, résultats de recherche, puzzles générés à la volée (outil), pages de pagination ≥2 si contenu jugé insuffisamment différencié (title unique conservé malgré tout).
- **Redirections** : table `redirects` (301) pour tout changement de slug — aucun slug ne doit jamais retourner une 404 silencieuse après modification en admin.
- **URLs** : minuscules forcées, slash final systématique, aucun paramètre de tracking dans les URLs canoniques.
- **Images** : `next/image`, formats WebP/AVIF, lazy-loading sous la ligne de flottaison, `priority` sur la grille puzzle above-the-fold uniquement.
- **Indexation mobile-first** vérifiée (parité totale du contenu mobile/desktop, pas de contenu masqué côté mobile absent du DOM).

---

## 23. Core Web Vitals Requirements

| Métrique | Cible | Mesures clés |
|----------|-------|----------------|
| **LCP** | < 2,5 s | Grille puzzle rendue en HTML/SVG server-side (pas d'attente d'hydratation JS) ; police critique en `font-display: swap` + préchargement ; image hero compressée et `priority`. |
| **INP** | < 200 ms | Interactivité de la grille isolée dans un petit composant client ; pas de bundle JS lourd partagé entre toutes les pages ; recherche avec debounce. |
| **CLS** | < 0,1 | Conteneurs de taille fixe (`aspect-ratio`) réservés pour la grille et chaque emplacement publicitaire avant chargement ; pas d'insertion de contenu au-dessus du pli après le chargement initial. |
| **Budget JS** | < 150 Ko gzip / route | Code-splitting par route via App Router ; RSC par défaut, `"use client"` uniquement sur les composants strictement interactifs (grille, recherche, formulaire générateur). |
| **Stratégie de rendu** | ISR | Pages catégorie/puzzle en ISR (`revalidate: 3600` ou à la demande via webhook de publication) ; Edge caching Vercel activé. |


## 24. Database Design

ORM : **Prisma** sur **PostgreSQL**. Convention : tables en `snake_case` (via `@@map`), modèles Prisma en `PascalCase`/`camelCase`.

### 24.1 Schéma Prisma (`schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum CategoryType {
  GRADE
  THEME
  SEASONAL
  DIFFICULTY
  AUDIENCE
  PRESS_BRAND
  COMBO
}

enum ContentStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum AdminRole {
  ADMIN
  EDITOR
}

model Grade {
  id            String     @id @default(cuid())
  slug          String     @unique
  name          String
  ageRange      String     @map("age_range")
  order         Int
  defaultGridSize Int      @map("default_grid_size")
  seoTitle      String?    @map("seo_title")
  metaDescription String?  @map("meta_description")
  introText     String?    @map("intro_text") @db.Text
  puzzles       Puzzle[]
  categories    Category[]
  createdAt     DateTime   @default(now()) @map("created_at")
  updatedAt     DateTime   @updatedAt @map("updated_at")

  @@map("grades")
}

model Theme {
  id              String     @id @default(cuid())
  slug            String     @unique
  name            String
  group           String
  iconUrl         String?    @map("icon_url")
  isSeasonal      Boolean    @default(false) @map("is_seasonal")
  activeDateStart String?    @map("active_date_start")
  activeDateEnd   String?    @map("active_date_end")
  seoTitle        String?    @map("seo_title")
  metaDescription String?    @map("meta_description")
  introText       String?    @map("intro_text") @db.Text
  wordBank        ThemeWord[]
  puzzles         Puzzle[]
  categories      Category[]
  createdAt       DateTime   @default(now()) @map("created_at")
  updatedAt       DateTime   @updatedAt @map("updated_at")

  @@map("themes")
}

model ThemeWord {
  id        String   @id @default(cuid())
  themeId   String   @map("theme_id")
  theme     Theme    @relation(fields: [themeId], references: [id], onDelete: Cascade)
  word      String
  length    Int
  minGradeOrder Int  @map("min_grade_order")

  @@index([themeId])
  @@map("theme_words")
}

model Difficulty {
  id          String     @id @default(cuid())
  slug        String     @unique
  name        String
  gridSizeMin Int        @map("grid_size_min")
  gridSizeMax Int        @map("grid_size_max")
  wordCountMin Int       @map("word_count_min")
  wordCountMax Int       @map("word_count_max")
  directions  String[]
  puzzles     Puzzle[]
  categories  Category[]

  @@map("difficulties")
}

model PressBrand {
  id              String   @id @default(cuid())
  slug            String   @unique
  name            String
  description     String?  @db.Text
  logoUrl         String?  @map("logo_url")
  seoTitle        String?  @map("seo_title")
  metaDescription String?  @map("meta_description")
  category        Category?

  @@map("press_brands")
}

model Category {
  id                String        @id @default(cuid())
  type              CategoryType
  slug              String        @unique
  parentCategoryId  String?       @map("parent_category_id")
  parentCategory    Category?     @relation("CategoryHierarchy", fields: [parentCategoryId], references: [id])
  childCategories   Category[]    @relation("CategoryHierarchy")
  gradeId           String?       @map("grade_id")
  grade             Grade?        @relation(fields: [gradeId], references: [id])
  themeId           String?       @map("theme_id")
  theme             Theme?        @relation(fields: [themeId], references: [id])
  difficultyId      String?       @map("difficulty_id")
  difficulty        Difficulty?   @relation(fields: [difficultyId], references: [id])
  pressBrandId      String?       @unique @map("press_brand_id")
  pressBrand        PressBrand?   @relation(fields: [pressBrandId], references: [id])
  seoTitle          String        @map("seo_title")
  metaDescription   String        @map("meta_description")
  h1                String
  introText         String        @map("intro_text") @db.Text
  faqJson           Json?         @map("faq_json")
  status            ContentStatus @default(DRAFT)
  minPuzzleThreshold Int          @default(4) @map("min_puzzle_threshold")
  puzzles           CategoryPuzzle[]
  createdAt         DateTime      @default(now()) @map("created_at")
  updatedAt         DateTime      @updatedAt @map("updated_at")

  @@index([type])
  @@index([status])
  @@map("categories")
}

model Puzzle {
  id              String        @id @default(cuid())
  slug            String        @unique
  title           String
  gridData        Json          @map("grid_data")        // matrice de lettres
  wordList        Json          @map("word_list")         // [{word, row, col, direction}]
  solutionData    Json          @map("solution_data")
  size            Int
  difficultyId    String        @map("difficulty_id")
  difficulty      Difficulty    @relation(fields: [difficultyId], references: [id])
  gradeId         String?       @map("grade_id")
  grade           Grade?        @relation(fields: [gradeId], references: [id])
  themeId         String?       @map("theme_id")
  theme           Theme?        @relation(fields: [themeId], references: [id])
  language        String        @default("fr")
  status          ContentStatus @default(DRAFT)
  pdfUrl          String?       @map("pdf_url")
  thumbnailUrl    String?       @map("thumbnail_url")
  viewCount       Int           @default(0) @map("view_count")
  printCount      Int           @default(0) @map("print_count")
  metaTitle       String?       @map("meta_title")
  metaDescription String?       @map("meta_description")
  categories      CategoryPuzzle[]
  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")

  @@index([slug])
  @@index([themeId])
  @@index([gradeId])
  @@index([difficultyId])
  @@index([status])
  @@map("puzzles")
}

model CategoryPuzzle {
  categoryId String   @map("category_id")
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  puzzleId   String   @map("puzzle_id")
  puzzle     Puzzle   @relation(fields: [puzzleId], references: [id], onDelete: Cascade)

  @@id([categoryId, puzzleId])
  @@index([categoryId])
  @@index([puzzleId])
  @@map("category_puzzles")
}

model Redirect {
  id        String   @id @default(cuid())
  fromPath  String   @unique @map("from_path")
  toPath    String   @map("to_path")
  type      Int      @default(301)
  createdAt DateTime @default(now()) @map("created_at")

  @@map("redirects")
}

model SeoMetaOverride {
  id              String  @id @default(cuid())
  path            String  @unique
  title           String?
  metaDescription String? @map("meta_description")
  ogImage         String? @map("og_image")
  canonicalOverride String? @map("canonical_override")

  @@map("seo_meta_overrides")
}

model AnalyticsEvent {
  id        String   @id @default(cuid())
  eventType String   @map("event_type")   // print | play | generate | download
  puzzleId  String?  @map("puzzle_id")
  sessionId String   @map("session_id")
  createdAt DateTime @default(now()) @map("created_at")

  @@index([puzzleId])
  @@index([eventType])
  @@map("analytics_events")
}

model AdminUser {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String    @map("password_hash")
  role         AdminRole @default(EDITOR)
  createdAt    DateTime  @default(now()) @map("created_at")

  @@map("admin_users")
}
```

### 24.2 Relations clés

- `Category` ↔ `Puzzle` : many-to-many via `CategoryPuzzle` (un puzzle "Noël CE1" appartient à la catégorie `theme=noel`, à la catégorie `grade=ce1`, ET à la catégorie combo `ce1/noel`).
- `Category.parentCategoryId` : auto-référence pour la hiérarchie (ex. la catégorie combo `ce1/noel` a pour parent la catégorie `grade=ce1`).
- `Grade`/`Theme`/`Difficulty` sont des tables de référence ; `Category` les relie au contexte SEO/contenu (une catégorie n'est pas un thème, elle est *la page qui représente* ce thème — séparation permettant à un même thème d'avoir plusieurs représentations de page si besoin futur).
- `ThemeWord` (banque de mots par thème) alimente le moteur de génération automatique (Section 25).

### 24.3 Index critiques (déjà déclarés ci-dessus, résumé)

`puzzles.slug` (unique), `puzzles.theme_id`, `puzzles.grade_id`, `puzzles.difficulty_id`, `puzzles.status`, `categories.slug` (unique), `categories.type`, `categories.status`, `category_puzzles(category_id, puzzle_id)` (clé composite), `theme_words.theme_id`, `redirects.from_path` (unique).


## 25. Puzzle Engine

### 25.1 Algorithme de génération de grille

```
FONCTION genererGrille(wordList: string[], size: int, directions: Direction[]) -> Grid:
  1. Trier wordList par longueur décroissante (placer les mots longs en premier réduit les échecs de placement)
  2. Initialiser une grille size×size vide
  3. POUR chaque mot:
       tentatives = 0
       TANT QUE non placé ET tentatives < 100:
         - choisir une direction aléatoire parmi `directions`
         - choisir une position de départ aléatoire
         - vérifier la compatibilité case par case :
             une case vide accepte la lettre ;
             une case déjà remplie n'accepte que la MÊME lettre (permet les croisements)
         - si compatible sur toute la longueur du mot → placer, sortir de la boucle
         - sinon → tentatives++
       SI tentatives = 100 → augmenter size de 1 et redémarrer la génération complète
  4. Remplir les cases vides restantes avec des lettres aléatoires
     (pondérées par fréquence des lettres en français : E, A, I, S, N... plus fréquentes
      que K, W, X, Y — évite une grille "trop facile à scanner")
  5. Retourner { grid, placements: [{word, row, col, direction}] }
```

- **Alphabet français :** gestion des accents (é, è, à, ç, ô, û, î, ï, ù, ê, â) — pour les niveaux `maternelle`/`cp`/`ce1`, option `simplifyAccents: true` qui remplace les lettres accentuées par leur équivalent simple dans la grille (mais conserve l'orthographe correcte dans la liste de mots affichée).
- **Directions disponibles :** `HORIZONTAL`, `HORIZONTAL_INVERSE`, `VERTICAL`, `VERTICAL_INVERSE`, `DIAGONAL_DESCENDANTE`, `DIAGONAL_DESCENDANTE_INVERSE`, `DIAGONAL_MONTANTE`, `DIAGONAL_MONTANTE_INVERSE`.

### 25.2 Niveaux de difficulté

| Difficulté | Taille de grille | Nb de mots | Directions autorisées |
|------------|---------------------|--------------|---------------------------|
| Facile | 8×8 | 6–8 | Horizontal, Vertical (sens normal uniquement) |
| Moyen | 10×10 | 8–10 | + Diagonales (sens normal) |
| Difficile | 12×12 à 15×15 | 12–15 | Toutes les 8 directions (incl. inversées) |
| Géant | 18×18 à 20×20 | 18–25 | Toutes les 8 directions |

**Variante "Grand Format / Haute Lisibilité"** (champ `puzzle.largePrint: boolean`, indépendant de la difficulté) : police agrandie (taille de cellule ×1,4), contraste renforcé, recommandée par défaut pour la persona Seniors quelle que soit la difficulté choisie — la difficulté contrôle le challenge cognitif, le mode grand format contrôle la lisibilité ; les deux sont des axes indépendants dans l'UI du générateur.

### 25.3 Génération de PDF imprimable

- Génération **à la demande, puis mise en cache** (`pdf_url` stocké après première génération ; régénéré uniquement si `grid_data` change).
- Rendu via `@react-pdf/renderer` (composant React → PDF, évite la dépendance lourde à un navigateur headless en environnement serverless) ; alternative : fonction Vercel dédiée avec Puppeteer/Chromium si une mise en page plus complexe est nécessaire.
- Contenu du PDF : page 1 = grille + liste de mots + logo/marque + QR code de retour vers l'URL canonique du puzzle ; page 2 = corrigé (grille avec mots surlignés) — utile pour les enseignants.
- Format A4, marges imprimantes standard, noir et blanc par défaut (économie d'encre), option couleur en Phase 2.

### 25.4 Génération aléatoire ("Surprise-moi" / outil Générateur)

- Distincte du contenu programmatique curé : un puzzle généré via l'outil public (`/generateur-mots-meles/`) est persisté avec un slug unique mais **statut `DRAFT` et balisage `noindex`** par défaut (pour ne pas polluer l'index avec du contenu non curé/non garanti unique en qualité éditoriale).
- L'utilisateur peut "publier" volontairement sa création vers une galerie communautaire (Phase 3, hors MVP) — fonctionnalité optionnelle à évaluer selon modération nécessaire.

### 25.5 Logique de validation du puzzle

Avant tout passage en `status = PUBLISHED`, exécuter :
1. **Unicité des mots** : pas de doublons dans `wordList`, pas de mot inclus comme sous-chaîne d'un autre de manière ambiguë (ex. "CHAT" et "CHATON" → avertissement, pas un blocage).
2. **Faisabilité géométrique** : tous les mots sont effectivement placés dans `gridData` (longueur ≤ taille de grille, pas de mot orphelin suite à un échec silencieux de l'algorithme).
3. **Cohérence des croisements** : à chaque case partagée entre deux mots placés, vérifier que la lettre est identique (sinon grille invalide).
4. **Reconstruction de la solution** : `solutionData` doit permettre de retracer exactement les coordonnées de chaque mot (utilisé par le bouton "Voir la solution" et la page 2 du PDF) — test automatisé comparant `solutionData` à `gridData`.
5. **Adéquation âge/niveau** : longueur des mots conforme aux bornes définies dans `Grade`/`Difficulty` (rejet ou avertissement si non conforme).
6. **Tests unitaires obligatoires** (Vitest) couvrant : mot plus long que la grille (doit déclencher l'agrandissement automatique), liste de mots vide (doit rejeter), grille 100% remplie sans collision possible (doit échouer proprement avec message clair, pas de boucle infinie — d'où le plafond de 100 tentatives par mot en 25.1).


## 26. Features by Phase

### MVP (Phase 1)
- Homepage complète (Section 16).
- 2 outils : Générateur de grille personnalisée, Jeu en ligne jouable.
- Moteur de puzzle v1 (3 difficultés : Facile/Moyen/Difficile ; Géant en Phase 2).
- Export PDF (grille + corrigé).
- Silos live : Hub Principal (Gratuits, Imprimer, Difficulté), Enfants, École (hub + niveaux CP/CE1/CM2), Saisonnier (hub + Noël + Halloween).
- ~100–150 puzzles curés pré-générés et publiés à travers ces catégories.
- Recherche basique (PostgreSQL full-text).
- Admin panel v1 : CRUD Puzzle, CRUD Category, statut publish/draft.
- Schema markup de base (BreadcrumbList, WebSite, CreativeWork, FAQPage).
- Sitemap dynamique v1, robots.txt, GA4 + Search Console connectés.
- Responsive mobile-first sur tous les templates.

### Phase 2
- Pages Adultes/Seniors + mode Grand Format/Haute Lisibilité.
- Niveaux scolaires restants (Maternelle, GS, CM1, CE2, 6e).
- Thèmes saisonniers restants (~10) + thèmes de vocabulaire (~20).
- Pages Presse & Marques (5 marques).
- Rollout Tier 1 du programmatique (combos Niveau × Thème, ~80-105 pages).
- Difficulté Géant.
- AdSense intégré (emplacements définis en Section 27).
- Admin : génération en lot, édition SEO en masse, dashboard analytics interne.
- Sauvegarde locale des favoris (localStorage, sans compte).

### Phase 3
- Outil Solveur/Scanner (photo → solution).
- Mots mêlés en langues étrangères (EN/ES/DE).
- Comptes utilisateurs (favoris, suivi de progression enfant, gamification — badges/séries façon Duolingo).
- Rollout complet programmatique (10 000+ pages, Tier 3/4).
- Monétisation étendue : offre premium sans publicité, packs PDF thématiques téléchargeables, API B2B enseignants (export en lot).
- Préparation internationalisation (Belgique/Suisse/Québec).
- Personnalisation avancée (recommandations basées sur l'historique).

---

## 27. Page Types — Synthèse Purpose / SEO / Components / Data

| Page | Purpose | SEO objective | Required components | Data requirements |
|------|---------|------------------|---------------------------|------------------------|
| Accueil | Point d'entrée, hub vers les 6 silos | Capter "mots meles" générique (28k/mo) | Hero, tuiles silos, thème du moment, carrousel populaires, footer sitemap | Puzzles top `view_count`, thème actif par date |
| Catégorie (grade/theme/seasonal/difficulty/audience) | Lister les puzzles d'une catégorie | Capter le cluster correspondant | Intro, grille de cartes, FAQ, sous-catégories | `Category` + `Puzzle[]` paginé |
| Catégorie combo | Intersection niveau×thème | Longue traîne programmatique | Identique + double lien parent | `Category(type=COMBO)` + parents |
| Puzzle | Jouer/imprimer une grille spécifique | Longue traîne ultra-spécifique + autorité catégorie | Grille interactive, liste mots, PDF, solution, puzzles liés | `Puzzle` complet + related (Section 18) |
| Outil Générateur | Créer une grille personnalisée | "générateur mots mêlés" (770/mo) | Formulaire (mots, thème, taille), preview live, export | Aucune donnée persistée requise pour l'aperçu ; sauvegarde optionnelle |
| Outil Jeu en ligne | Jouer à une grille aléatoire/choisie | "mots meles en ligne" (2 080/mo, meilleur ratio vol/KD) | Grille interactive plein écran, timer, sélection thème/difficulté | `Puzzle` aléatoire filtré par paramètres |
| Recherche | Trouver un puzzle/thème précis | Néant (noindex) — UX uniquement | Barre de recherche, filtres facettés, grille de résultats | Requête full-text sur `Puzzle`/`Theme`/`Grade` |
| Presse & Marques | Capter le trafic navigationnel des lecteurs de presse | "mots meles ouest france" etc. | Article informationnel + CTA vers Générateur | `PressBrand` + `Category` liée |
| Statique (Solutions/Règles, Pédagogie, Personnages, Ressources) | Contenu de support, FAQ approfondie | Longue traîne informationnelle | Article structuré, `HowTo` si applicable | Contenu rédactionnel statique |

---

## 28. UI/UX

### 28.1 Direction visuelle ("Duolingo-inspired")
- Palette vive et amicale (2-3 couleurs primaires + neutres), formes arrondies (`rounded-2xl` sur les cartes/boutons), ombres douces, gros boutons tactiles avec micro-interactions (confettis CSS à la résolution d'un puzzle, mascotte qui réagit).
- Barres de progression et mécaniques légères de gamification dès le MVP côté outil "Jeu en ligne" (ex. décompte de mots restants animé), comptes/séries/badges réservés à la Phase 3 (nécessitent un compte utilisateur).

### 28.2 Mascotte
- Une mascotte animale unique et cohérente sur toute la marque (éviter la ressemblance directe avec le hibou Duolingo) — proposition : **un renard ("Filou")** ou **une chouette stylisée différenciée par couleur/forme** — apparaît sur l'accueil, dans les états vides, sur les confirmations de réussite, et en illustration des 6 tuiles de silo (variantes d'expression).
- Livrée en SVG vectoriel (légèreté, scalabilité, anime-able en CSS).

### 28.3 Mobile-first
- Conception base 375px ; cibles tactiles ≥44×44px ; bottom tab bar fixe (Section 9) ; grille de puzzle responsive avec zoom/pan tactile sur petits écrans pour les grandes grilles (Géant 20×20).

### 28.4 Accessibilité
- Cible **WCAG 2.1 AA** : contraste ≥4,5:1, navigation clavier complète sur la grille interactive (flèches + Entrée pour sélectionner), labels ARIA sur chaque cellule et bouton, respect de `prefers-reduced-motion`.
- **Mode Grand Format/Haute Lisibilité** dédié (police agrandie, contraste renforcé) — prioritaire pour la persona Seniors mais activable par tout utilisateur.
- Option **police adaptée dyslexie** (ex. OpenDyslexic) en toggle utilisateur.

### 28.5 AdSense-ready
- Emplacements réservés avec conteneurs à dimensions fixes (`aspect-ratio` CSS) pour garantir CLS=0 à l'insertion :
  - Catégorie : bannière in-feed toutes les 8 cartes + sidebar desktop.
  - Puzzle : 1 bloc in-content après la grille, 1 bloc sous les puzzles liés (jamais d'annonce superposée à la grille interactive elle-même).
  - Mobile : bannière sticky en pied de page (hors zone de jeu).
- **Point de conformité à valider avant lancement (juridique, pas seulement technique) :** le site s'adressant en partie à des enfants, prévoir le paramétrage Google "traitement adapté aux enfants" / limitation de la personnalisation publicitaire sur les pages identifiées comme enfant-cible, conformément aux exigences Google et RGPD applicables aux mineurs (ePrivacy). À valider avec un conseil juridique avant l'activation d'AdSense en Phase 2.

---

## 29. Admin Panel

| Module | Fonctionnalités |
|--------|---------------------|
| **Gestion des puzzles** | Liste/recherche/filtre, création manuelle ou via moteur (paramètres : thème, niveau, difficulté, nb de mots), édition des métadonnées, prévisualisation, publier/dépublier, génération en lot (N puzzles pour une combinaison donnée), régénération PDF, statistiques par puzzle (vues, impressions, téléchargements). |
| **Gestion des catégories** | CRUD complet, gestion de la hiérarchie (`parentCategoryId`), édition des champs SEO et du bloc FAQ, mise en avant homepage, publication conditionnée au seuil de puzzles (configurable), alerte automatique si une catégorie publiée retombe sous le seuil. |
| **Gestion des thèmes** | CRUD, groupe, upload d'icône, plage de dates d'activation saisonnière (mise en avant homepage automatique), gestion de la banque de mots (`ThemeWord`) par thème. |
| **Gestion SEO** | Éditeur de gabarits de title/meta globaux, table d'overrides par page (`SeoMetaOverride`), gestionnaire de redirections (`Redirect`), statut de génération des sitemaps, vérificateur de liens cassés. |
| **Dashboard Analytics** | Vue trafic (intégration GA4 ou `AnalyticsEvent` interne), top puzzles/catégories par vues, couverture d'indexation (pages soumises vs indexées via API Search Console), snapshot Core Web Vitals (CrUX API), revenu AdSense (Phase 2, via API AdSense). |

**Authentification admin :** Auth.js (NextAuth) avec rôles `ADMIN`/`EDITOR`, accès `/admin/*` protégé par middleware Next.js.

---

## 30. Technology Stack

| Couche | Choix | Justification |
|--------|-------|-------------------|
| Framework | **Next.js 15** (App Router, React Server Components, Server Actions) | RSC = JS minimal côté client (CWV), ISR natif pour le scaling programmatique |
| Langage | **TypeScript** (strict mode) | Sécurité de type sur un schéma de données complexe (catégories combo, moteur de puzzle) |
| Styles | **Tailwind CSS** + shadcn/ui pour les composants de base | Vitesse de build UI, cohérence design system |
| Base de données | **PostgreSQL** (Neon, Supabase ou Vercel Postgres) | Relationnel adapté aux relations many-to-many catégories↔puzzles ; `tsvector`/`pg_trgm` pour la recherche |
| ORM | **Prisma** | Migrations versionnées, typage généré, cohérent avec le schéma Section 24 |
| Déploiement | **Vercel** | Edge caching, ISR natif, fonctions serverless pour génération PDF |
| Stockage fichiers | Vercel Blob ou S3-compatible | PDFs générés, vignettes de grilles |
| Recherche | PostgreSQL full-text (MVP) → Meilisearch (Phase 3 si besoin) | Suffisant jusqu'à ~10-15k pages |
| Génération PDF | `@react-pdf/renderer` (+ Puppeteer/Chromium serverless en option Phase 2) | Pas de dépendance navigateur lourde pour le cas simple |
| Auth admin | Auth.js (NextAuth) | Intégration native Next.js, gestion de rôles |
| Validation | Zod | Schémas partagés client/serveur (formulaire générateur, API) |
| Tests | Vitest (unitaire — moteur de puzzle), Playwright (E2E) | Couverture critique de l'algorithme de génération (Section 25.5) |
| Analytics | GA4 + Search Console API + `AnalyticsEvent` interne | Couverture externe + dashboard admin sans dépendance tierce pour les métriques produit |


## 31. Build Order

> Ordre d'implémentation technique — distinct des priorités de contenu (déjà livrées séparément). L'infrastructure précède toujours le contenu.

1. **Setup projet** — Next.js 15 + TypeScript + Tailwind + Prisma + connexion PostgreSQL ; CI/CD Vercel ; ESLint/Prettier.
2. **Schéma de base de données** — implémenter le schéma Prisma complet (Section 24), migrations initiales, seed des tables de référence (`Grade` ×7, `Difficulty` ×4, `Theme` ×~15 de départ).
3. **Moteur de puzzle** — algorithme de génération (25.1), validation (25.5), tests Vitest avant toute UI.
4. **Composants UI fondamentaux** — design system Tailwind (boutons, cartes, badges), composant `<PuzzleGrid>` (rendu serveur + variante interactive client).
5. **Pages cœur** — gabarit Catégorie générique (Section 14), gabarit Puzzle (Section 15), Accueil (Section 16).
6. **Outils** — Générateur (formulaire + preview live), Jeu en ligne (grille interactive plein écran).
7. **Export PDF** — intégration `@react-pdf/renderer`, génération à la demande + cache.
8. **Recherche** — index full-text PostgreSQL, UI de recherche + filtres.
9. **SEO technique** — sitemap dynamique, schema markup, robots.txt, meta gabarits (Sections 20–22).
10. **Admin panel v1** — auth, CRUD Puzzle/Category/Theme.
11. **Seed de contenu initial** — génération de ~100–150 puzzles curés à travers les catégories MVP (via script admin, pas manuellement un par un).
12. **QA + Core Web Vitals** — audit Lighthouse sur chaque gabarit, correction avant lancement.
13. **Lancement MVP.**
14. **Rollout programmatique Phase 2** (génération en lot, catégories combo, AdSense, dashboard analytics).
15. **Phase 3** (Solveur, comptes utilisateurs, langues, scaling 10k+).

---

## 32. Development Roadmap (estimation indicative)

| Semaines | Livrable |
|----------|-------------|
| S1–S2 | Setup projet, schéma DB, design system de base |
| S3–S4 | Moteur de puzzle + tests + validation |
| S5–S6 | Gabarits Accueil / Catégorie / Puzzle (RSC) |
| S7–S8 | Outils (Générateur, Jeu en ligne) + export PDF |
| S9–S10 | Admin panel v1 + seed de ~100-150 puzzles + recherche |
| S11–S12 | SEO technique complet, QA Core Web Vitals, GA4/Search Console, **Lancement MVP** |
| S13–S18 | Phase 2 : catégories combo, niveaux/thèmes restants, AdSense, Adultes/Seniors + grand format |
| S19+ | Phase 3 : Solveur, comptes, langues, scaling 10k+ |

---

## 33. MVP Launch Checklist

- [ ] Schéma DB déployé en production, migrations validées, tables de référence seedées (grades, difficulties, themes initiaux).
- [ ] Moteur de puzzle validé par les tests Vitest (couverture des cas limites — Section 25.5).
- [ ] ~100–150 puzzles publiés, répartis sur toutes les catégories MVP (aucune catégorie publiée sous le seuil de 4 puzzles).
- [ ] Les 2 outils (Générateur, Jeu en ligne) fonctionnels de bout en bout, y compris export PDF.
- [ ] Tous les gabarits (Accueil, Catégorie, Puzzle) passent Lighthouse "Good" sur LCP/INP/CLS en mobile.
- [ ] Schema markup validé (Rich Results Test de Google) sur chaque type de page.
- [ ] Sitemap dynamique généré et accessible, soumis à Search Console.
- [ ] `robots.txt` vérifié, aucune page admin/api indexable.
- [ ] Recherche interne fonctionnelle avec fallback "0 résultat" vers le Générateur.
- [ ] Breadcrumbs corrects sur 100% des pages (vérification manuelle d'un échantillon par silo).
- [ ] GA4 + Search Console connectés et vérifiés (événements de page vue confirmés).
- [ ] Admin panel : auth fonctionnelle, CRUD Puzzle/Category opérationnel pour l'équipe éditoriale.
- [ ] Mentions légales, politique de confidentialité, page contact en place (prérequis légal avant tout trafic, et avant AdSense en Phase 2).
- [ ] Test mobile réel (pas seulement émulateur) sur au moins un device Android et un iOS.
- [ ] Mode Grand Format/Haute Lisibilité testé et fonctionnel (même si Seniors n'est pas encore un silo complet en MVP, le toggle doit exister).

---

## 34. Post-Launch SEO Checklist

- [ ] Soumission de toutes les pages MVP via Search Console (inspection d'URL en lot sur les pages prioritaires : Accueil, Gratuits, Imprimer, Enfants, École).
- [ ] Suivi hebdomadaire du taux d'indexation (pages soumises vs réellement indexées) — objectif >80% à S+4.
- [ ] Surveillance des Core Web Vitals réels (CrUX, pas seulement Lighthouse en local) dès que le volume de trafic le permet.
- [ ] Détection de cannibalisation entre pages proches (ex. catégorie "Niveau" vs catégorie "Combo" du même niveau) via Search Console (requêtes qui font apparaître 2 URLs du site en concurrence).
- [ ] Première vague de backlinks : annuaires éducatifs francophones, blogs d'enseignants (cluster `EDU_BLOG` déjà identifié comme audience pertinente), relai presse local si pertinent.
- [ ] Cadence de publication régulière établie (ex. +20-30 nouvelles pages/puzzles par semaine) pour signaler un site actif à Google.
- [ ] Vérification mensuelle des pages passées sous le seuil de publication (catégories dépubliées automatiquement) — confirmer que la logique de noindex automatique fonctionne réellement en production.
- [ ] Mise à jour des pages saisonnières actives (Noël, Halloween, etc.) avant chaque période clé, avec mise en avant homepage automatique vérifiée.

---

## 35. Scaling Plan to 10 000+ Pages

| Palier | Contenu cumulé | Prérequis avant d'avancer au palier suivant |
|--------|--------------------|----------------------------------------------|
| 0 → 150 | MVP (catégories de base + 100-150 puzzles) | Indexation >80%, CWV "Good", aucune alerte Search Console critique |
| 150 → 1 000 | Niveaux/thèmes restants, premiers combos Niveau×Thème (Tier 1) | Pipeline de génération en lot opérationnel en admin (Section 12), QA automatique passée systématiquement |
| 1 000 → 2 500 | Combos Niveau×Thème complets, thèmes de vocabulaire complets, pages Presse | Monitoring de cannibalisation actif, maillage interne auto-injecté à la publication (pas de lien manuel) |
| 2 500 → 5 000 | Extension Niveau×Thème×Difficulté (Tier 3), audience×difficulté | Vérifier que le budget de crawl n'est pas saturé (taux d'exploration stable dans Search Console) |
| 5 000 → 10 000+ | Langues (Phase 3), long tail combinatoire complet, éventuelle galerie communautaire | Automatisation complète : génération, validation, publication, mise à jour sitemap et liens internes sans intervention manuelle page par page |

**Principe directeur à chaque palier :** ne jamais publier un lot de pages programmatiques sans (1) puzzles réellement uniques générés et validés (Section 25.5), (2) texte de gabarit avec au moins 2 variantes en rotation, (3) liens internes automatiquement injectés depuis les catégories parentes, (4) entrée automatique dans le sitemap correspondant. La vitesse de scaling doit être pilotée par le taux d'indexation réel observé (Section 34), pas par un calendrier arbitraire — ralentir la cadence de publication si le taux d'indexation chute sous 70% à un palier donné.

---

*Fin du document. Toute extension de périmètre (nouveau type de page, nouvelle table) doit rester cohérente avec les conventions de nommage et la structure de silos définies dans ce PRD.*
