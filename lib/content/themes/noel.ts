import type { FaqItem } from "@/lib/db/types/page-data"

/** Unique editorial intro for /mots-meles-fetes-saisons/noel/ (~300 words). */
export const NOEL_INTRO = [
  "Le thème Noël de Hibou&Mots rassemble des mots mêlés gratuits et des jeux de mots cachés Noël pour faire vivre le vocabulaire de Noël en français. Chaque grille propose une chasse aux lettres festive : le Père Noël survole les toits dans son traîneau, tiré par des rennes ; plus bas, le sapin brille de guirlandes et de bougies, entouré de cadeaux. Les lutins préparent la tournée pendant que le bonhomme de neige veille au jardin — autant de mots familiers que les enfants retrouvent dans albums, chants et fenêtres illuminées.",
  "Les listes s'intègrent à une activité de Noël calme, en classe comme pendant les vacances scolaires. Ouvrir une case du calendrier de l'Avent peut précéder une petite grille ; un repas de réveillon se conclut par une partie entre cousins. Trouver un mot caché fixe la forme du mot entier et consolide la lecture sans gommer la magie des fêtes. Maternelle et CP commencent par des grilles courtes en grandes lettres ; le CE1 et le CE2 progressent avec des diagonales et un vocabulaire plus riche.",
  "En décembre, les enseignants impriment les PDF pour la dernière semaine avant les congés ; les familles les glissent dans un cahier d'activités ou les proposent après la décoration du sapin. Chaque puzzle se joue en ligne ou s'exporte en PDF A4 avec corrigé, en noir et blanc pour une impression économique. Les thèmes voisins — Père Noël, atelier des lutins, marché de Noël — varient d'une grille à l'autre pour éviter la répétition mécanique.",
  "Hibou&Mots reste entièrement gratuit, sans compte obligatoire. Si vous souhaitez croiser fête et niveau scolaire, explorez les grilles CE1 × Noël ou choisissez une difficulté facile, moyenne ou difficile selon l'âge. Le vocabulaire de Noël devient ainsi un fil léger entre programme de français et ambiance des fêtes, du premier jour de l'Avent au réveillon du 24 décembre.",
].join("\n\n")

export const NOEL_META_DESCRIPTION =
  "Mots mêlés et mots cachés Noël gratuits : Père Noël, sapin, cadeaux, lutins, réveillon. Activité de Noël pour les vacances scolaires — vocabulaire de Noël à imprimer ou à jouer en ligne."

export const NOEL_FAQ: FaqItem[] = [
  {
    question: "Quels mots figurent dans les grilles Noël ?",
    answer:
      "Les listes mêlent le lexique des fêtes : Père Noël, renne, traîneau, sapin, cadeaux, lutins, guirlande, bonhomme de neige, calendrier de l'Avent ou réveillon, selon la grille choisie.",
  },
  {
    question: "Quand utiliser ces mots cachés Noël en classe ?",
    answer:
      "Idéal en décembre, avant les vacances scolaires : activité calme après la décoration du sapin, échauffement avant une histoire de Noël ou fiche à distribuer lors de la dernière semaine.",
  },
  {
    question: "Ces grilles conviennent-elles aux vacances scolaires à la maison ?",
    answer:
      "Oui : imprimez plusieurs PDF pour occuper les journées sans écran, compléter un calendrier de l'Avent ou animer un goûter de réveillon entre cousins.",
  },
  {
    question: "Peut-on jouer en ligne ou imprimer les mots mêlés Noël ?",
    answer:
      "Les deux modes sont disponibles : partie immédiate dans le navigateur, ou téléchargement PDF A4 avec corrigé pour la maison et la classe.",
  },
  {
    question: "Existe-t-il des grilles Noël par niveau scolaire ?",
    answer:
      "Oui, croisez le thème avec un niveau — par exemple CE1 × Noël — pour une liste calibrée à la classe, ou choisissez une difficulté facile pour les plus jeunes.",
  },
]
