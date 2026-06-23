import type { FaqItem } from "@/lib/db/types/page-data"

/** Unique editorial intro for /mots-meles-thematiques/sport/ (~300 words). */
export const SPORT_INTRO = [
  "Le thème Sport de Hibou&Mots propose des mots mêlés gratuits et des jeux de mots cachés pour enrichir le vocabulaire du sport en français. Chaque grille fait circuler des disciplines très variées : le football sur la pelouse, le basket sous le panier, le tennis sur le court ou la natation dans le bassin. Le vélo file sur la piste, le rugby rassemble les mêlées, la gymnastique enchaîne les figures et l'athlétisme mesure la course sur le tartan. Le handball complète souvent les listes collectives — autant d'activités sportives que les enfants pratiquent à l'école, au club ou devant les compétitions télévisées.",
  "Ces puzzles s'intègrent en activité sportive calme : utile en éducation physique quand la météo retient la classe à l'intérieur, ou en français pour consolider le lexique avant un tournoi interclasses. Trouver un mot caché ancre l'orthographe du mot entier — ballon, sprinteur, gymnaste — sans transformer la séance en dictée lourde. Le vocabulaire du sport progresse avec l'âge : mots courts pour la maternelle et le CP, puis athlétisme, gymnastique ou handball lorsque l'élève lit déjà des termes plus longs.",
  "En éducation physique, les enseignants distribuent une grille en échauffement mental avant un atelier motricité ; en classe, la fiche accompagne un dossier sur les Jeux olympiques ou la vie associative du collège voisin. Les familles impriment un PDF pour occuper un mercredi pluvieux ou préparer un quiz avant un match. Chaque puzzle se joue en ligne ou s'exporte en PDF A4 avec corrigé, en noir et blanc pour une impression simple.",
  "Hibou&Mots reste gratuit, sans inscription. Les séries alternent sports collectifs, sports individuels et disciplines de piste — football et rugby côté ballon ovale ou rond, tennis et basket pour les raquettes et les paniers, natation et course pour l'effort continu. Croisez le thème avec un niveau scolaire ou choisissez une difficulté adaptée : le vocabulaire du sport devient un fil concret entre programme de français et passion du terrain.",
].join("\n\n")

export const SPORT_META_DESCRIPTION =
  "Mots mêlés et mots cachés sport gratuits : football, basket, tennis, natation, rugby, gymnastique. Vocabulaire du sport et activité sportive pour l'éducation physique — à imprimer ou à jouer en ligne."

export const SPORT_FAQ: FaqItem[] = [
  {
    question: "Quelles disciplines figurent dans les grilles Sport ?",
    answer:
      "Les listes sport mêlent football, basket, tennis, natation, vélo, rugby, gymnastique, athlétisme, handball ou course, selon la grille choisie.",
  },
  {
    question: "Comment utiliser ce thème en éducation physique ?",
    answer:
      "Proposez une grille en échauffement mental avant la séance, ou en fin de cours quand l'espace gymnasium est indisponible : les élèves repèrent le vocabulaire du sport pendant un temps calme.",
  },
  {
    question: "Ces mots mêlés conviennent-ils aux plus jeunes ?",
    answer:
      "Oui : commencez par des grilles Sport faciles avec football, vélo ou course ; gymnastique et athlétisme arrivent progressivement au CE1 et au CE2.",
  },
  {
    question: "Peut-on jouer en ligne ou imprimer les grilles Sport ?",
    answer:
      "Les deux modes sont disponibles sur la rubrique Sport : partie en ligne ou PDF A4 avec corrigé pour la maison et la classe.",
  },
  {
    question: "Le thème Sport couvre-t-il les sports collectifs et individuels ?",
    answer:
      "Oui, les séries alternent disciplines d'équipe — football, rugby, handball, basket — et sports individuels — tennis, natation, vélo, athlétisme.",
  },
]
