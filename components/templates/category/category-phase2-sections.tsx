import Link from "next/link"
import { SectionHeading } from "@/components/layout/section-heading"
import { ROUTES, gradePath, seasonalPath, themePath } from "@/lib/seo/routes"
import { gradeSeed } from "@/prisma/seed/grades"

type CategoryPhase2SectionsProps = {
  slug: string
}

const PHASE2_SLUGS = new Set(["hub-gratuits", "hub-imprimer", "hub-ecole", "enfants"])

export function CategoryPhase2Sections({ slug }: CategoryPhase2SectionsProps) {
  if (!PHASE2_SLUGS.has(slug)) return null

  return (
    <div className="flex flex-col gap-8">
      {slug === "enfants" && <EnfantsPhase2 />}
      {slug === "hub-imprimer" && <ImprimerPhase2 />}
      {slug === "hub-gratuits" && <GratuitsPhase2 />}
      {slug === "hub-ecole" && <EcolePhase2 />}
    </div>
  )
}

function InternalLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="text-sm font-semibold text-primary hover:underline">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function EnfantsPhase2() {
  return (
    <>
      <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <SectionHeading
          align="left"
          eyebrow="Pédagogie"
          title="Les bienfaits des mots mêlés pour l'apprentissage"
          description="Un jeu de repérage visuel qui soutient plusieurs compétences du primaire — sans l'effort d'une fiche d'exercices classique."
        />
        <div className="mt-6 flex flex-col gap-5 text-sm leading-relaxed text-muted-foreground">
          <p>
            Les mots mêlés demandent à l&apos;enfant de maintenir son attention sur une consigne
            unique pendant plusieurs minutes : c&apos;est un entraînement concret à la{" "}
            <strong className="text-foreground">concentration</strong>, utile en classe comme lors
            des devoirs à la maison.
          </p>
          <p>
            Chaque mot trouvé ancre sa forme dans la{" "}
            <strong className="text-foreground">mémoire visuelle</strong> : l&apos;enfant compare
            lettre par lettre la liste et la grille, ce qui renforce le{" "}
            <strong className="text-foreground">vocabulaire</strong> travaillé en français et
            prépare la <strong className="text-foreground">lecture</strong> de mots entiers, au-delà
            du décodage syllabique.
          </p>
          <p>
            L&apos;orthographe en bénéficie indirectement : revoir un mot dans plusieurs directions
            (horizontal, vertical, diagonal) oblige à le reconnaître dans toutes ses orientations.
            L&apos;enfant gagne aussi en <strong className="text-foreground">autonomie</strong> —
            il peut avancer seul, vérifier ses trouvailles et reprendre une grille interrompue sans
            aide constante d&apos;un adulte.
          </p>
          <p>
            Cette combinaison fait des mots mêlés un support d&apos;
            <strong className="text-foreground">apprentissage ludique</strong> : la réussite est
            visible (mot surligné, liste cochée), ce qui motive les élèves hésitants face à une
            dictée ou à une fiche de lecture.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <h2 className="font-heading text-xl font-extrabold text-foreground">
          Comparer les grilles par tranche d&apos;âge
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Choisissez une grille adaptée au niveau de lecture — pas seulement à l&apos;âge chronologique.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 pr-4 font-extrabold">Tranche d&apos;âge</th>
                <th className="py-2 pr-4 font-extrabold">Niveau</th>
                <th className="py-2 pr-4 font-extrabold">Grille</th>
                <th className="py-2 font-extrabold">Objectif principal</th>
              </tr>
            </thead>
            <tbody className="text-foreground/90">
              <tr className="border-b border-border/60">
                <td className="py-2 pr-4">3–5 ans</td>
                <td className="py-2 pr-4">
                  <Link href={gradePath("maternelle")} className="text-primary hover:underline">
                    Maternelle
                  </Link>
                </td>
                <td className="py-2 pr-4">6×6</td>
                <td className="py-2">Repérage visuel, premiers mots</td>
              </tr>
              <tr className="border-b border-border/60">
                <td className="py-2 pr-4">6–7 ans</td>
                <td className="py-2 pr-4">
                  <Link href={gradePath("cp")} className="text-primary hover:underline">
                    CP
                  </Link>
                </td>
                <td className="py-2 pr-4">8×8</td>
                <td className="py-2">Lecture de mots outils, syllabes stables</td>
              </tr>
              <tr className="border-b border-border/60">
                <td className="py-2 pr-4">7–8 ans</td>
                <td className="py-2 pr-4">
                  <Link href={gradePath("ce1")} className="text-primary hover:underline">
                    CE1
                  </Link>
                </td>
                <td className="py-2 pr-4">8×8 – 10×10</td>
                <td className="py-2">Vocabulaire thématique, fluidité</td>
              </tr>
              <tr className="border-b border-border/60">
                <td className="py-2 pr-4">8–9 ans</td>
                <td className="py-2 pr-4">
                  <Link href={gradePath("ce2")} className="text-primary hover:underline">
                    CE2
                  </Link>
                </td>
                <td className="py-2 pr-4">10×10</td>
                <td className="py-2">Mots plus longs, diagonales simples</td>
              </tr>
              <tr className="border-b border-border/60">
                <td className="py-2 pr-4">9–10 ans</td>
                <td className="py-2 pr-4">
                  <Link href={gradePath("cm1")} className="text-primary hover:underline">
                    CM1
                  </Link>
                </td>
                <td className="py-2 pr-4">12×12</td>
                <td className="py-2">Enrichissement lexical, concentration</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">10–12 ans</td>
                <td className="py-2 pr-4">
                  <Link href={gradePath("cm2")} className="text-primary hover:underline">
                    CM2
                  </Link>
                </td>
                <td className="py-2 pr-4">12×12 – 14×14</td>
                <td className="py-2">Préparation collège, mots complexes</td>
              </tr>
            </tbody>
          </table>
        </div>
        <InternalLinks
          links={[
            { href: ROUTES.ecoleHub, label: "Hub Mots mêlés École" },
            { href: themePath("animaux"), label: "Thème Animaux" },
            { href: ROUTES.fetesHub, label: "Fêtes & saisons" },
            { href: gradePath("cp"), label: "Grilles CP" },
            { href: gradePath("ce1"), label: "Grilles CE1" },
            { href: gradePath("cm2"), label: "Grilles CM2" },
          ]}
        />
      </section>
    </>
  )
}

function ImprimerPhase2() {
  return (
    <>
      <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <SectionHeading
          align="left"
          eyebrow="PDF"
          title="Cahiers de mots mêlés thématiques à imprimer"
          description="Des sélections prêtes pour la maison ou la classe — chaque thème regroupe plusieurs grilles en format PDF A4."
        />
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Tous les cahiers Hibou&Mots sont exportés en <strong className="text-foreground">PDF</strong>,
          pensés pour une impression <strong className="text-foreground">A4</strong> en{" "}
          <strong className="text-foreground">noir et blanc</strong>, avec le{" "}
          <strong className="text-foreground">corrigé</strong> sur la page suivante. Chaque fichier
          propose un jeu de mots cachés à retrouver dans la grille — voici les thématiques les plus
          demandées :
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            <Link href={themePath("animaux")} className="font-semibold text-primary hover:underline">
              Animaux
            </Link>
            — ferme, savane, animaux domestiques ; idéal maternelle et CP.
          </li>
          <li>
            <Link href={themePath("sport")} className="font-semibold text-primary hover:underline">
              Sport
            </Link>
            — disciplines olympiques et jeux de cour ; convient au CE1–CM2.
          </li>
          <li>
            <Link href={seasonalPath("noel")} className="font-semibold text-primary hover:underline">
              Noël
            </Link>
            — vocabulaire des fêtes, à distribuer avant les vacances.
          </li>
          <li>
            <Link href={seasonalPath("halloween")} className="font-semibold text-primary hover:underline">
              Halloween
            </Link>
            — thème saisonnier pour une activité d&apos;automne en classe.
          </li>
          <li>
            <Link href={themePath("vocabulaire")} className="font-semibold text-primary hover:underline">
              Vocabulaire
            </Link>
            — listes lexicales pour enrichir l&apos;expression écrite.
          </li>
          <li>
            <Link href={ROUTES.ecoleHub} className="font-semibold text-primary hover:underline">
              École
            </Link>
            — grilles calibrées par niveau, de la maternelle à la 6e.
          </li>
        </ul>
      </section>

      <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <h2 className="font-heading text-xl font-extrabold text-foreground">
          Conseils pour une impression réussie
        </h2>
        <ul className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Vérifiez le format <strong className="text-foreground">A4</strong> et l&apos;orientation
            portrait dans la boîte de dialogue d&apos;impression.
          </li>
          <li>
            Utilisez l&apos;option « économiser l&apos;encre » : les grilles sont lisibles sans
            couleur ni photo.
          </li>
          <li>
            Imprimez d&apos;abord une page test pour ajuster les marges si votre imprimante rogne
            les bords.
          </li>
          <li>
            Conservez le PDF sur votre ordinateur : vous pourrez réimprimer le corrigé séparément
            pour corriger les copies.
          </li>
          <li>
            Pour une classe entière, téléchargez plusieurs grilles différentes depuis le hub{" "}
            <Link href={ROUTES.gratuits} className="text-primary hover:underline">
              mots mêlés gratuits
            </Link>{" "}
            afin que chaque élève ait une version unique.
          </li>
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Chaque fichier reste au format <strong className="text-foreground">PDF</strong> vectoriel
          : la grille occupe la page 1, le <strong className="text-foreground">corrigé</strong> la
          page 2. Vous pouvez archiver les fichiers sur un drive scolaire et les réutiliser d&apos;une
          année sur l&apos;autre sans perte de qualité à l&apos;impression.
        </p>
        <InternalLinks
          links={[
            { href: ROUTES.gratuits, label: "Mots mêlés gratuits" },
            { href: ROUTES.jouer, label: "Jouer en ligne" },
            { href: ROUTES.generateur, label: "Générateur de grilles" },
            { href: ROUTES.thematiquesHub, label: "Mots mêlés thématiques" },
            { href: ROUTES.fetesHub, label: "Fêtes & saisons" },
            { href: ROUTES.enfants, label: "Mots mêlés enfants" },
            { href: ROUTES.adultes, label: "Mots mêlés adultes" },
            { href: ROUTES.ecoleHub, label: "Mots mêlés École" },
          ]}
        />
      </section>
    </>
  )
}

function GratuitsPhase2() {
  return (
    <>
      <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <SectionHeading
          align="left"
          eyebrow="Gratuité"
          title="Pourquoi choisir des mots mêlés gratuits ?"
          description="Accéder à l'intégralité du catalogue sans payer, sans compte et sans limite de téléchargement."
        />
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Hibou&Mots a été conçu pour les familles et les classes qui cherchent une activité
          fiable sans abonnement. Toutes les grilles publiées — jeu en ligne, export PDF, générateur
          personnalisé — restent accessibles gratuitement. Vous évitez les applications payantes
          avec paliers verrouillés, les magazines à acheter pour une seule grille ou les sites
          limités à une impression par jour.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          La gratuité permet aussi aux enseignants de constituer un fonds d&apos;activités
          imprimables pour l&apos;année scolaire, et aux parents de proposer des écrans utiles à la
          maison, complémentaires du cahier de lecture. Les grilles{" "}
          <Link href={ROUTES.seniors} className="text-primary hover:underline">
            pour les seniors
          </Link>{" "}
          et les publics adultes restent accessibles dans les mêmes conditions — sans abonnement
          croisé ni version « premium » cachée.
        </p>
      </section>

      <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <h2 className="font-heading text-xl font-extrabold text-foreground">
          Ce que la gratuité inclut concrètement
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>Jeu en ligne illimité sur ordinateur, tablette ou smartphone.</li>
          <li>Téléchargement PDF A4 avec corrigé pour chaque grille publiée.</li>
          <li>Générateur de grilles personnalisées avec vos propres listes de mots.</li>
          <li>Accès aux hubs thématiques, scolaires et saisonniers sans filtrage payant.</li>
          <li>Pas de création de compte obligatoire pour jouer ou imprimer.</li>
        </ul>
      </section>

      <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <h2 className="font-heading text-xl font-extrabold text-foreground">
          Gratuit vs payant : que change concrètement ?
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 pr-4 font-extrabold">Critère</th>
                <th className="py-2 pr-4 font-extrabold">Hibou&Mots (gratuit)</th>
                <th className="py-2 font-extrabold">Offres payantes courantes</th>
              </tr>
            </thead>
            <tbody className="text-foreground/90">
              <tr className="border-b border-border/60">
                <td className="py-3 pr-4 font-bold">Accès aux grilles</td>
                <td className="py-3 pr-4">Illimité, sans inscription</td>
                <td className="py-3">Quota ou abonnement mensuel</td>
              </tr>
              <tr className="border-b border-border/60">
                <td className="py-3 pr-4 font-bold">PDF avec corrigé</td>
                <td className="py-3 pr-4">Inclus sur chaque puzzle</td>
                <td className="py-3">Parfois réservé à l&apos;offre premium</td>
              </tr>
              <tr className="border-b border-border/60">
                <td className="py-3 pr-4 font-bold">Générateur personnalisé</td>
                <td className="py-3 pr-4">
                  <Link href={ROUTES.generateur} className="text-primary hover:underline">
                    Gratuit et illimité
                  </Link>
                </td>
                <td className="py-3">Export payant ou filigrane</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-bold">Public visé</td>
                <td className="py-3 pr-4">Enfants, école, adultes, seniors</td>
                <td className="py-3">Souvent adulte ou presse uniquement</td>
              </tr>
            </tbody>
          </table>
        </div>
        <InternalLinks
          links={[
            { href: ROUTES.imprimer, label: "Imprimer une grille PDF" },
            { href: ROUTES.jouer, label: "Jouer en ligne" },
            { href: ROUTES.generateur, label: "Créer ma grille" },
            { href: ROUTES.enfants, label: "Mots mêlés enfants" },
            { href: ROUTES.seniors, label: "Mots mêlés seniors" },
            { href: ROUTES.ecoleHub, label: "Mots mêlés École" },
          ]}
        />
      </section>
    </>
  )
}

function EcolePhase2() {
  const cycle1 = gradeSeed.filter((g) => g.slug === "maternelle")
  const cycle2 = gradeSeed.filter((g) => ["cp", "ce1", "ce2"].includes(g.slug))
  const cycle3 = gradeSeed.filter((g) => ["cm1", "cm2"].includes(g.slug))
  const college = gradeSeed.filter((g) => g.slug === "6e")

  return (
    <>
      <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <SectionHeading
          align="left"
          eyebrow="Cycles"
          title="Des grilles alignées sur les cycles scolaires"
          description="Maternelle, primaire et début de collège — chaque cycle a ses propres attentes en vocabulaire et en taille de grille."
        />

        <div className="mt-6 flex flex-col gap-6">
          <div>
            <h3 className="font-heading text-lg font-extrabold text-foreground">Cycle 1 — Éveil et découverte</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              En maternelle, les grilles courtes en grandes lettres favorisent le premier contact avec
              l&apos;écrit. Les mots restent très courts ; l&apos;objectif est le plaisir de
              retrouver une forme connue, pas la vitesse. Les enseignants s&apos;en servent pour
              introduire le vocabulaire de la classe, les prénoms ou les thèmes de la semaine sans
              imposer une lecture fluide immédiate.
            </p>
            <InternalLinks
              links={cycle1.map((g) => ({
                href: gradePath(g.slug),
                label: `Grilles ${g.name}`,
              }))}
            />
          </div>

          <div>
            <h3 className="font-heading text-lg font-extrabold text-foreground">
              Cycle 2 — Apprentissages fondamentaux
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Du CP au CE2, les grilles accompagnent la lecture fluide et le vocabulaire thématique
              (animaux, saison, classe). Les diagonales apparaissent progressivement ; les listes
              reprennent des mots outils et des champs lexicaux du programme de français. En CP et
              CE1, privilégiez des listes courtes liées à la lecture quotidienne ; au CE2, allongez
              les mots et autorisez les directions croisées pour consolider l&apos;orthographe
              visuelle.
            </p>
            <InternalLinks
              links={cycle2.map((g) => ({
                href: gradePath(g.slug),
                label: `Mots mêlés ${g.name}`,
              }))}
            />
          </div>

          <div>
            <h3 className="font-heading text-lg font-extrabold text-foreground">
              Cycle 3 — Consolidation au primaire
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              En CM1 et CM2, les grilles deviennent plus denses : mots plus longs, directions
              variées, vocabulaire de culture générale. Idéal pour une activité de fin de séance ou
              un devoir maison ciblé sur un thème de la semaine. Les élèves peuvent comparer leurs
              stratégies de recherche (horizontal d&apos;abord, puis diagonales) et chronométrer
              leurs progrès sur plusieurs séances.
            </p>
            <InternalLinks
              links={cycle3.map((g) => ({
                href: gradePath(g.slug),
                label: `Mots mêlés ${g.name}`,
              }))}
            />
          </div>

          <div>
            <h3 className="font-heading text-lg font-extrabold text-foreground">Collège — 6e</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              La 6e accueille des grilles jusqu&apos;à 15×15 avec mots inversés et listes plus
              exigeantes. Elles conviennent à une classe de français en quête d&apos;activités
              autonomes ou à un club lecture. Le vocabulaire peut croiser géographie, sciences ou
              lexique argumenté — utile pour préparer le collège sans charge de correction lourde.
            </p>
            <InternalLinks
              links={college.map((g) => ({
                href: gradePath(g.slug),
                label: `Mots mêlés ${g.name}`,
              }))}
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <h2 className="font-heading text-xl font-extrabold text-foreground">
          Idées pour les enseignants
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Distribuez une grille différente par table pour limiter la triche lors d&apos;une
            évaluation formative du vocabulaire.
          </li>
          <li>
            Croisez un niveau et un thème saisonnier (Noël, rentrée) pour ancrer le lexique dans un
            contexte motivant.
          </li>
          <li>
            Proposez la grille en fin de séance comme activité calme pendant que vous corrigez des
            copies.
          </li>
          <li>
            Imprimez le corrigé au verso ou sur une feuille séparée : correction collective en
            quelques minutes.
          </li>
          <li>
            Utilisez le{" "}
            <Link href={ROUTES.generateur} className="text-primary hover:underline">
              générateur
            </Link>{" "}
            avec les mots de la leçon de la semaine pour une fiche sur mesure.
          </li>
        </ul>
        <h3 className="mt-6 font-heading text-base font-extrabold text-foreground">
          Tous les niveaux scolaires
        </h3>
        <InternalLinks
          links={gradeSeed.map((g) => ({
            href: gradePath(g.slug),
            label: `${g.name} (${g.ageRange})`,
          }))}
        />
        <InternalLinks
          links={[
            { href: ROUTES.pedagogie, label: "Pédagogie des mots mêlés" },
            { href: ROUTES.thematiquesHub, label: "Mots mêlés par thème" },
            { href: ROUTES.imprimer, label: "Imprimer en PDF" },
          ]}
        />
      </section>

      <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <h2 className="font-heading text-xl font-extrabold text-foreground">
          Quand utiliser une grille en classe ?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Les mots mêlés se prêtent à plusieurs moments de la journée : accueil du matin pendant
          que les élèves arrivent, révision d&apos;un chapitre de vocabulaire avant une évaluation,
          ou activité différenciée lorsque certains terminent une fiche plus tôt. Comme chaque
          grille est disponible en PDF A4 avec corrigé, vous pouvez l&apos;intégrer à un cahier
          d&apos;activités, à une classe inversée ou à un devoir maison sans préparation
          supplémentaire.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Pour croiser niveau et thème — par exemple CE1 × Noël — parcourez les pages combinées
          depuis chaque fiche de niveau ou explorez les{" "}
          <Link href={ROUTES.fetesHub} className="text-primary hover:underline">
            grilles de fêtes
          </Link>{" "}
          avant de choisir la difficulté adaptée à votre classe.
        </p>
      </section>
    </>
  )
}
