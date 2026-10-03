/**
 * Real article body for /solutions-regles-mots-meles/, filling the
 * `body?: ReactNode` slot that renderContentPage already supports but
 * this page never used — the page previously had only a one-sentence
 * introText and 3 short FAQ answers, despite being the page the
 * homepage explicitly promises "détaille chaque direction autorisée"
 * for.
 *
 * The direction rules below are not invented — they're read directly
 * from DIFFICULTY_PRESETS in lib/puzzle-engine/difficulty.ts (facile:
 * HORIZONTAL/VERTICAL only; moyen: adds both diagonals, no reversed
 * words; difficile/géant: all 8 directions including every reversed
 * variant). This matches and makes precise what the existing FAQ
 * already claimed in passing ("Facile n'autorise pas les diagonales").
 */
export function SolutionsArticle() {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-xl font-extrabold text-foreground">
          Comment lire une grille de mots mêlés
        </h2>
        <p className="text-sm leading-relaxed text-foreground/90">
          Une grille de mots mêlés est un carré de lettres dans lequel sont cachés tous les mots
          de la liste affichée à côté. Chaque mot apparaît une seule fois, en ligne droite, sans
          lettre manquante ni ajoutée. Le même mot ne se répète jamais deux fois dans la grille,
          et les lettres qui ne font partie d'aucun mot servent uniquement à remplir l'espace et à
          rendre la recherche plus difficile.
        </p>
        <p className="text-sm leading-relaxed text-foreground/90">
          Pour valider un mot, il suffit de repérer sa première lettre, puis de vérifier que les
          lettres suivantes s'alignent bien dans une direction autorisée — voir le détail ci-dessous
          selon le niveau de difficulté.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-xl font-extrabold text-foreground">
          Les directions autorisées, par niveau
        </h2>
        <p className="text-sm leading-relaxed text-foreground/90">
          Le nombre de directions possibles augmente avec la difficulté — c'est l'une des
          principales raisons pour lesquelles une grille Difficile prend plus de temps qu'une
          grille Facile, même à taille égale.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card/70 p-5">
            <h3 className="font-heading text-base font-extrabold text-foreground">Facile</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Horizontal et vertical uniquement, toujours de gauche à droite et de haut en bas.
              Aucune diagonale, aucun mot à l'envers.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card/70 p-5">
            <h3 className="font-heading text-base font-extrabold text-foreground">Moyen</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Horizontal et vertical, plus les deux diagonales (montante et descendante). Toujours
              dans le sens de lecture normal — pas de mots inversés.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card/70 p-5">
            <h3 className="font-heading text-base font-extrabold text-foreground">Difficile</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Les 8 directions : horizontal, vertical et les deux diagonales, chacune pouvant
              aussi apparaître inversée (de droite à gauche, de bas en haut).
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card/70 p-5">
            <h3 className="font-heading text-base font-extrabold text-foreground">Géant</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Les mêmes 8 directions que le niveau Difficile, sur une grille plus grande avec
              davantage de mots à trouver.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-xl font-extrabold text-foreground">
          Techniques pour résoudre une grille plus vite
        </h2>
        <ul className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/90">
          <li>
            <strong className="font-extrabold text-foreground">Commence par les mots courts.</strong>{" "}
            Un mot de 3 ou 4 lettres a beaucoup moins de positions possibles dans la grille qu'un
            mot de 8 lettres — c'est souvent le point de départ le plus rapide.
          </li>
          <li>
            <strong className="font-extrabold text-foreground">Repère les lettres rares.</strong>{" "}
            Le Q, le X, le Z, le W et le K apparaissent peu dans une grille. Si un mot de la liste
            en contient une, cherche d'abord cette lettre précise plutôt que la première du mot.
          </li>
          <li>
            <strong className="font-extrabold text-foreground">Balaie méthodiquement.</strong>{" "}
            Plutôt que de chercher au hasard, parcours la grille ligne par ligne, puis colonne par
            colonne — l'œil repère plus facilement un alignement de lettres de cette façon.
          </li>
          <li>
            <strong className="font-extrabold text-foreground">
              Sur les niveaux Difficile et Géant, pense aux diagonales et aux mots inversés.
            </strong>{" "}
            Un mot qui ne se trouve pas en horizontal ou en vertical classique peut très bien être
            caché en diagonale, ou se lire de droite à gauche.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-xl font-extrabold text-foreground">
          Comment vérifier sa solution
        </h2>
        <p className="text-sm leading-relaxed text-foreground/90">
          En ligne, chaque grille dispose d'un bouton « Voir la solution » pour comparer ta
          réponse. Sur les grilles imprimées en PDF, le corrigé se trouve systématiquement sur la
          deuxième page — pratique pour une correction en classe ou à la maison sans avoir besoin
          d'une connexion internet.
        </p>
      </section>
    </div>
  )
}
