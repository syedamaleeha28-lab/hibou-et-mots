import type { FaqItem } from "@/lib/db/types/page-data"

/** Unique editorial intro for /mots-meles-thematiques/animaux/ (~300 words). */
export const ANIMAUX_INTRO = [
  "Le thème Animaux de Hibou&Mots rassemble des mots mêlés gratuits et des jeux de mots cachés animaux pour enrichir le vocabulaire animaux en français. Chaque puzzle propose une chasse aux lettres : retrouver le lion, le tigre ou l'éléphant dans une grille de savane, repérer girafe et zèbre parmi les herbivores, puis glisser vers le singe quand la jungle monte à la surface. D'autres séries glissent côté ferme avec des animaux domestiques familiers — vache, mouton, poule — pendant que des grilles « océan » introduisent dauphin, baleine ou requin pour varier les milieux.",
  "Les listes distinguent volontiers animaux sauvages et animaux domestiques afin d'ancrer le lexique là où l'enfant vit ou rêve. Trouver un mot caché dans la grille fixe la silhouette orthographique du mot entier ; c'est une activité éducative qui soutient la lecture en maternelle comme les premières années du primaire, sans la lourdeur d'une dictée. Les grilles restent courtes pour les tout-petits, puis gagnent en diagonales et en longueur de mots dès le CP et le CE1.",
  "En classe de découverte du monde, ces mots mêlés servent d'échauffement avant un documentaire, de consolidation après une sortie au zoo ou de fiche calme pendant que l'enseignant prépare la suite. À la maison, elles occupent un créneau pluvieux ou accompagnent un album illustré sur la faune. Chaque puzzle se joue en ligne sur ordinateur ou tablette, ou s'exporte en PDF A4 avec corrigé pour une impression noir et blanc.",
  "Les séries couvrent plusieurs registres — savane africaine, ferme européenne, jungle tropicale, monde marin — pour éviter la monotonie d'une unique liste. La difficulté progresse avec l'âge : grandes cases pour les débutants, grilles 10×10 et 12×12 pour les élèves qui lisent déjà couramment. Tout reste gratuit, sans compte obligatoire, avec des contenus pensés pour les enseignants comme pour les familles qui cherchent un support léger autour du vivant.",
].join("\n\n")

export const ANIMAUX_META_DESCRIPTION =
  "Mots mêlés et mots cachés animaux gratuits : lion, tigre, éléphant, ferme, savane, jungle et océan. Vocabulaire animaux pour la maternelle et le primaire, à imprimer ou à jouer en ligne."

export const ANIMAUX_FAQ: FaqItem[] = [
  {
    question: "Quels animaux retrouve-t-on dans les grilles de ce thème ?",
    answer:
      "Les listes alternent entre animaux sauvages — lion, tigre, éléphant, girafe, zèbre, singe — et animaux domestiques de la ferme, avec des détours vers la jungle ou l'océan selon la grille choisie.",
  },
  {
    question: "À quel niveau proposer des mots cachés animaux ?",
    answer:
      "Dès la maternelle avec des grilles courtes en grandes lettres ; le vocabulaire s'étoffe au CP et au CE1, puis les diagonales conviennent aux élèves du primaire qui lisent déjà couramment.",
  },
  {
    question: "Comment utiliser ce thème comme activité éducative en classe ?",
    answer:
      "Distribuez une grille après une leçon sur la savane, la ferme ou les mers ; les élèves repèrent le vocabulaire animaux pendant un temps calme. Le corrigé au dos du PDF permet une correction rapide ou une relecture collective.",
  },
  {
    question: "Peut-on imprimer ou jouer en ligne les mots mêlés Animaux ?",
    answer:
      "Les deux : ouvrez une grille dans le navigateur pour une partie immédiate, ou téléchargez le PDF A4 avec solution pour la maison ou la classe.",
  },
  {
    question: "Existe-t-il des grilles Animaux par niveau scolaire ?",
    answer:
      "Oui, croisez ce thème avec un niveau — maternelle, CP, CE1 — via les pages École ou choisissez une difficulté facile, moyenne ou difficile selon l'âge de l'enfant.",
  },
]
