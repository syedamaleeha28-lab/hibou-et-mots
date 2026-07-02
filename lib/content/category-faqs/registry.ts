import type { FaqItem } from "@/lib/db/types/page-data"
import { ADULTES_FAQ } from "@/lib/content/adultes"
import { PEDAGOGIE_FAQ } from "@/lib/content/pedagogie"
import { SENIORS_FAQ } from "@/lib/content/seniors"

/** Page-specific FAQ blocks keyed by category slug — no shared templates. */
export const CATEGORY_FAQ_REGISTRY: Record<string, FaqItem[]> = {
  "hub-gratuits": [
    {
      question: "Les mots mêlés sont-ils vraiment gratuits sur ce site ?",
      answer:
        "Oui : toutes les grilles publiées sur Hibou&Mots sont gratuites, sans limite de téléchargement ni de parties en ligne. Le générateur et les PDF avec corrigé sont inclus.",
    },
    {
      question: "Faut-il créer un compte pour jouer ?",
      answer:
        "Non, aucune inscription n'est requise pour jouer en ligne, imprimer un PDF ou créer une grille personnalisée sur Hibou&Mots.",
    },
    {
      question: "Puis-je imprimer les grilles gratuites ?",
      answer:
        "Oui, chaque grille peut être exportée en PDF format A4 avec corrigé sur une page séparée — idéal pour la classe ou la maison.",
    },
    {
      question: "À quelle fréquence ajoutez-vous de nouvelles grilles ?",
      answer:
        "La bibliothèque s'enrichit régulièrement : comptez environ cinq nouvelles grilles par semaine, réparties entre thèmes, saisons et niveaux scolaires.",
    },
  ],
  "hub-imprimer": [
    {
      question: "Le corrigé est-il inclus dans les PDF à imprimer ?",
      answer:
        "Oui, chaque export de la page Mots mêlés à imprimer place la grille sur la première page et la solution sur la suivante, prête pour la classe.",
    },
    {
      question: "Faut-il une imprimante couleur pour ces PDF ?",
      answer:
        "Non, les grilles du hub Imprimer sont optimisées pour une impression noir et blanc en A4 sans perte de lisibilité.",
    },
    {
      question: "Puis-je imprimer plusieurs grilles pour toute une classe ?",
      answer:
        "Oui, parcourez les thèmes ou niveaux depuis Mots mêlés à imprimer et téléchargez autant de PDF que nécessaire pour vos élèves.",
    },
  ],
  "hub-ecole": [
    {
      question: "Comment les grilles École sont-elles adaptées à chaque niveau ?",
      answer:
        "Le hub Mots mêlés École calibre taille de grille, longueur des mots et directions selon la maternelle, le primaire ou la 6e.",
    },
    {
      question: "Les grilles École suivent-elles le programme officiel ?",
      answer:
        "Elles s'appuient sur le vocabulaire courant de chaque classe du hub École, sans être liées à un manuel précis.",
    },
    {
      question: "Y a-t-il des mots mêlés pour la 6e dans le hub École ?",
      answer:
        "Oui, la section 6e propose des grilles jusqu'à 15×15 avec mots inversés et un lexique adapté au début de collège.",
    },
  ],
  "hub-fetes": [
    {
      question: "Quelles fêtes couvre le hub Fêtes & Saisons ?",
      answer:
        "La page Fêtes & Saisons regroupe Noël, Halloween, Pâques, Carnaval, la rentrée et l'été — chaque fête a sa propre rubrique.",
    },
    {
      question: "Quand utiliser les grilles du hub Fêtes & Saisons en classe ?",
      answer:
        "Avant les vacances ou lors d'un temps fort de l'année : distribuez une grille thématique depuis ce hub pour ancrer le vocabulaire festif.",
    },
    {
      question: "Peut-on imprimer les mots mêlés de fête depuis ce hub ?",
      answer:
        "Oui, toutes les sous-catégories du hub Fêtes & Saisons proposent des PDF A4 avec corrigé, gratuits à télécharger.",
    },
  ],
  "hub-thematiques": [
    {
      question: "Quels thèmes trouve-t-on dans le hub Thématiques ?",
      answer:
        "Le hub Mots mêlés Thématiques réunit animaux, fruits, sport, vocabulaire, couleurs, famille, météo et pays du monde, entre autres.",
    },
    {
      question: "Comment choisir un thème dans le hub Thématiques ?",
      answer:
        "Parcourez les sous-catégories du hub ou utilisez la recherche pour ouvrir directement la page du thème qui correspond à votre séquence.",
    },
    {
      question: "Les grilles thématiques conviennent-elles au primaire ?",
      answer:
        "Oui, chaque thème du hub indique une difficulté ; commencez par « Facile » sur la page choisie pour les plus jeunes.",
    },
  ],
  "hub-difficulte": [
    {
      question: "Quels niveaux de difficulté propose le hub Difficulté ?",
      answer:
        "Le hub Mots mêlés par difficulté classe les grilles en Facile, Moyen, Difficile et Géant — du débutant au champion confirmé.",
    },
    {
      question: "La difficulté change-t-elle la taille des grilles ?",
      answer:
        "Oui, plus vous montez dans le hub Difficulté, plus les grilles s'agrandissent et contiennent de mots à repérer.",
    },
    {
      question: "Par où commencer dans le hub Difficulté ?",
      answer:
        "Choisissez Facile si vous débutez, puis progressez vers Moyen et Difficile selon le confort de lecture sur chaque page du hub.",
    },
  ],
  "hub-presse": [
    {
      question: "Que contient le hub Journaux & Magazines ?",
      answer:
        "Le hub Presse rassemble des grilles inspirées de titres français comme Ouest-France, Sud Ouest ou La Croix, adaptées au web et au PDF.",
    },
    {
      question: "Ces grilles reprennent-elles le style de la presse ?",
      answer:
        "Oui, le hub Journaux & Magazines s'inspire des formats de mots mêlés publiés dans la presse quotidienne et magazine.",
    },
    {
      question: "Peut-on imprimer les grilles du hub Presse ?",
      answer:
        "Oui, chaque marque du hub Presse propose des PDF gratuits avec corrigé, comme le reste du site Hibou&Mots.",
    },
  ],
  maternelle: [
    {
      question: "Les grilles Maternelle sont-elles adaptées aux 3–5 ans ?",
      answer:
        "Oui, la page Mots mêlés Maternelle propose des grilles 8×8 en grandes lettres et des mots très courts pour les tout-petits.",
    },
    {
      question: "Combien de mots par grille en Maternelle ?",
      answer:
        "Comptez en général 6 à 8 mots sur les grilles Maternelle, avec uniquement horizontal et vertical pour faciliter le repérage.",
    },
    {
      question: "Peut-on imprimer les grilles Maternelle pour la classe ?",
      answer:
        "Oui, tous les PDF de la rubrique Maternelle sont gratuits, en A4 noir et blanc, avec solution sur la page suivante.",
    },
  ],
  cp: [
    {
      question: "Quelle taille de grille pour les mots mêlés CP ?",
      answer:
        "La page Mots mêlés CP privilégie des grilles 8×8 avec un vocabulaire de lecture débutante aligné sur la première année.",
    },
    {
      question: "Les grilles CP aident-elles l'orthographe ?",
      answer:
        "Oui, retrouver un mot sur la page CP renforce la mémorisation visuelle des mots outils travaillés en classe.",
    },
    {
      question: "Peut-on jouer en ligne sur la page CP ?",
      answer:
        "Oui, chaque grille CP se joue dans le navigateur ou s'imprime en PDF depuis la même rubrique.",
    },
  ],
  ce1: [
    {
      question: "Quel vocabulaire sur la page Mots mêlés CE1 ?",
      answer:
        "Les listes CE1 ciblent le lexique courant de 7 ans, sur des grilles 10×10 adaptées au cycle 2.",
    },
    {
      question: "Les diagonales sont-elles autorisées en CE1 ?",
      answer:
        "Selon la grille CE1 choisie, les diagonales peuvent apparaître ; filtrez par difficulté « Facile » pour commencer sans diagonale.",
    },
    {
      question: "Comment utiliser la page CE1 en classe ?",
      answer:
        "Distribuez une grille CE1 en échauffement ou en fin de séance de français pour consolider le vocabulaire de la semaine.",
    },
  ],
  ce2: [
    {
      question: "En quoi les grilles CE2 diffèrent-elles du CE1 ?",
      answer:
        "La page Mots mêlés CE2 propose des mots plus longs et un vocabulaire enrichi sur des grilles 10×10, toujours gratuites.",
    },
    {
      question: "Les grilles CE2 conviennent-elles à la dictée ?",
      answer:
        "Oui, elles complètent la dictée CE2 en ancrant la forme visuelle complète des mots travaillés en classe.",
    },
    {
      question: "Peut-on imprimer plusieurs grilles CE2 ?",
      answer:
        "Oui, téléchargez autant de PDF CE2 que nécessaire depuis la rubrique, chaque fichier inclut le corrigé.",
    },
  ],
  cm1: [
    {
      question: "Quelle configuration pour les mots mêlés CM1 ?",
      answer:
        "La page CM1 propose des grilles 12×12 avec diagonales et un vocabulaire plus exigeant, adapté aux élèves de 9 ans.",
    },
    {
      question: "Les grilles CM1 incluent-elles des mots inversés ?",
      answer:
        "Certaines grilles CM1 autorisent les lectures inversées ; vérifiez la difficulté indiquée sur chaque puzzle de la rubrique.",
    },
    {
      question: "Comment choisir une grille CM1 par thème ?",
      answer:
        "Croisez la page CM1 avec un thème saisonnier ou explorez les combos niveau × thème proposés en sous-liens.",
    },
  ],
  cm2: [
    {
      question: "Que propose la page Mots mêlés CM2 ?",
      answer:
        "Des grilles 12×12 pour le CM2, avec diagonales et mots inversés, pour un défi adapté aux élèves de 10 ans.",
    },
    {
      question: "Les grilles CM2 préparent-elles au collège ?",
      answer:
        "Oui, la rubrique CM2 allonge les listes et le repérage visuel avant le passage en 6e.",
    },
    {
      question: "Peut-on jouer en ligne sur la page CM2 ?",
      answer:
        "Oui, chaque grille CM2 est jouable immédiatement ou exportable en PDF depuis la même catégorie.",
    },
  ],
  "6e": [
    {
      question: "Quelle taille de grille sur la page Mots mêlés 6e ?",
      answer:
        "La rubrique 6e propose des grilles jusqu'à 15×15 avec toutes les directions, y compris les mots lus à l'envers.",
    },
    {
      question: "Le vocabulaire 6e est-il adapté au collège ?",
      answer:
        "Oui, les listes de la page 6e ciblent un lexique plus dense, proche des attentes du début de collège.",
    },
    {
      question: "Les enseignants peuvent-ils imprimer les grilles 6e ?",
      answer:
        "Oui, les PDF 6e sont gratuits avec corrigé, prêts pour une activité calme en classe de français.",
    },
  ],
  football: [
    {
      question: "Quels mots de football retrouve-t-on dans ces grilles ?",
      answer:
        "La page Mots mêlés Football mêle ballon, but, gardien, penalty, équipe ou stade selon la grille choisie.",
    },
    {
      question: "Ces grilles Football conviennent-elles aux fans du primaire ?",
      answer:
        "Oui, le thème Football propose des difficultés progressives, des grilles courtes pour les plus jeunes et des listes plus longues pour le CM.",
    },
    {
      question: "Peut-on imprimer une grille Football pour le club ou la classe ?",
      answer:
        "Oui, exportez un PDF depuis la rubrique Football avec corrigé inclus, idéal avant un tournoi scolaire.",
    },
  ],
  vocabulaire: [
    {
      question: "Quel type de mots trouve-t-on sur la page Vocabulaire ?",
      answer:
        "Le thème Vocabulaire regroupe des listes de mots outils, de champs lexicaux variés et de termes utiles au programme de français.",
    },
    {
      question: "Comment utiliser les grilles Vocabulaire en classe ?",
      answer:
        "Distribuez une grille Vocabulaire après une leçon de lexique pour consolider les mots travaillés dans la semaine.",
    },
    {
      question: "Y a-t-il plusieurs niveaux sur la page Vocabulaire ?",
      answer:
        "Oui, filtrez par difficulté sur la rubrique Vocabulaire pour adapter la liste à la maternelle, au primaire ou au collège.",
    },
  ],
  couleurs: [
    {
      question: "Quelles couleurs figurent dans les grilles Couleurs ?",
      answer:
        "La page Mots mêlés Couleurs propose rouge, bleu, vert, jaune, orange, violet et d'autres teintes selon la grille.",
    },
    {
      question: "Ce thème Couleurs convient-il à la maternelle ?",
      answer:
        "Oui, les grilles Courtes de la rubrique Couleurs sont idéales pour les premiers repérages visuels en PS/MS/GS.",
    },
    {
      question: "Peut-on croiser Couleurs et un niveau scolaire ?",
      answer:
        "Oui, explorez les pages École ou choisissez une difficulté facile sur le thème Couleurs pour calibrer la liste.",
    },
  ],
  famille: [
    {
      question: "Quels mots de la famille retrouve-t-on sur cette page ?",
      answer:
        "Le thème Famille inclut papa, maman, frère, sœur, grand-parents, cousin et autres liens de parenté selon la grille.",
    },
    {
      question: "Comment utiliser le thème Famille en classe ?",
      answer:
        "La rubrique Famille accompagne une séquence sur la vie quotidienne ou l'expression orale autour des proches.",
    },
    {
      question: "Les grilles Famille sont-elles jouables en ligne ?",
      answer:
        "Oui, chaque puzzle Famille se lance dans le navigateur ou s'imprime en PDF depuis la même page.",
    },
  ],
  meteo: [
    {
      question: "Quel lexique météo propose cette rubrique ?",
      answer:
        "La page Mots mêlés Météo mêle soleil, pluie, neige, vent, nuage, orage et saisons selon les grilles publiées.",
    },
    {
      question: "Quand utiliser le thème Météo en classe ?",
      answer:
        "Lors d'une séquence sciences ou géographie sur le temps qu'il fait, distribuez une grille Météo en activité calme.",
    },
    {
      question: "Peut-on imprimer les grilles Météo ?",
      answer:
        "Oui, tous les PDF Météo sont gratuits avec corrigé, en format A4 noir et blanc.",
    },
  ],
  "pays-du-monde": [
    {
      question: "Quels pays figurent dans les grilles Pays du Monde ?",
      answer:
        "La rubrique Pays du Monde propose des noms de pays, capitales et mots liés aux continents selon chaque grille.",
    },
    {
      question: "Ce thème convient-il au primaire ?",
      answer:
        "Oui, commencez par des grilles faciles Pays du Monde avec des pays familiers, puis progressez vers des listes plus longues.",
    },
    {
      question: "Comment lier Pays du Monde au programme de géographie ?",
      answer:
        "Utilisez une grille Pays du Monde après une carte ou une leçon sur un continent pour ancrer le vocabulaire.",
    },
  ],
  paques: [
    {
      question: "Quels mots de Pâques retrouve-t-on dans ces grilles ?",
      answer:
        "La page Mots mêlés Pâques mêle œuf, lapin, cloche, chocolat, printemps ou chocolatier selon la grille choisie.",
    },
    {
      question: "Quand utiliser les grilles Pâques en classe ?",
      answer:
        "Avant les vacances de printemps, distribuez une grille Pâques en activité calme ou après un atelier décoration d'œufs.",
    },
    {
      question: "Peut-on imprimer les mots mêlés Pâques ?",
      answer:
        "Oui, chaque puzzle Pâques s'exporte en PDF A4 avec corrigé, gratuit pour la maison ou la classe.",
    },
  ],
  carnaval: [
    {
      question: "Quel vocabulaire Carnaval propose cette page ?",
      answer:
        "La rubrique Mots mêlés Carnaval inclut déguisement, masque, défilé, confetti, costume ou char selon les grilles.",
    },
    {
      question: "Ces grilles Carnaval conviennent-elles à l'école ?",
      answer:
        "Oui, utilisez une grille Carnaval en février ou mars, avant les vacances d'hiver, pour ancrer le lexique festif.",
    },
    {
      question: "Peut-on jouer en ligne sur la page Carnaval ?",
      answer:
        "Oui, lancez une partie Carnaval dans le navigateur ou imprimez le PDF depuis la même rubrique.",
    },
  ],
  rentree: [
    {
      question: "Quels mots de rentrée trouve-t-on sur cette page ?",
      answer:
        "La page Mots mêlés Rentrée propose cartable, cahier, classe, professeur, règle ou école selon les listes publiées.",
    },
    {
      question: "Quand utiliser le thème Rentrée ?",
      answer:
        "En septembre, distribuez une grille Rentrée pour accueillir les élèves ou reprendre le vocabulaire de l'école.",
    },
    {
      question: "Les grilles Rentrée sont-elles adaptées à la maternelle ?",
      answer:
        "Oui, choisissez une difficulté facile sur la rubrique Rentrée pour des mots courts en grandes lettres.",
    },
  ],
  ete: [
    {
      question: "Quel lexique d'été propose cette rubrique ?",
      answer:
        "La page Mots mêlés Été mêle soleil, plage, mer, vacances, glace, parasol ou soleil selon chaque grille estivale.",
    },
    {
      question: "Quand utiliser les grilles Été ?",
      answer:
        "Avant les vacances d'été ou lors d'une séquence sur les saisons, proposez une grille Été en activité calme.",
    },
    {
      question: "Peut-on imprimer les mots mêlés Été pour la classe ?",
      answer:
        "Oui, tous les PDF Été sont gratuits avec corrigé, prêts pour la dernière semaine de juin.",
    },
  ],
  facile: [
    {
      question: "À qui s'adressent les grilles Facile ?",
      answer:
        "La page Mots mêlés Facile cible les débutants : grilles 8×8, peu de mots, horizontal et vertical uniquement.",
    },
    {
      question: "Combien de mots dans une grille Facile ?",
      answer:
        "Comptez en général 6 à 8 mots sur les puzzles classés Facile dans cette rubrique.",
    },
    {
      question: "Peut-on imprimer les grilles Facile ?",
      answer:
        "Oui, chaque PDF Facile est gratuit, en A4, avec solution sur la page suivante.",
    },
  ],
  moyen: [
    {
      question: "Qu'est-ce qui change sur la page Mots mêlés Moyen ?",
      answer:
        "La difficulté Moyen ajoute des grilles 10×10, plus de mots et les directions diagonales pour un défi intermédiaire.",
    },
    {
      question: "Pour quel public choisir Moyen ?",
      answer:
        "La rubrique Moyen convient au CE1, CE2 ou aux adultes qui maîtrisent déjà les grilles faciles.",
    },
    {
      question: "Peut-on jouer en ligne en difficulté Moyen ?",
      answer:
        "Oui, chaque grille Moyen se joue dans le navigateur ou s'imprime depuis la même catégorie.",
    },
  ],
  difficile: [
    {
      question: "Quelles grilles propose la page Difficile ?",
      answer:
        "La rubrique Difficile publie des grilles 12×12 à 15×15 avec mots inversés et toutes les directions de lecture.",
    },
    {
      question: "Pour qui est faite la difficulté Difficile ?",
      answer:
        "La page Difficile s'adresse aux CM2, 6e, adultes et joueurs confirmés qui cherchent un vrai challenge.",
    },
    {
      question: "Comment corriger une grille Difficile ?",
      answer:
        "Ouvrez le puzzle Difficile choisi pour afficher la solution, ou utilisez le corrigé du PDF imprimé.",
    },
  ],
  geant: [
    {
      question: "Qu'est-ce qu'une grille Géant ?",
      answer:
        "La page Mots mêlés Géant propose les plus grandes grilles du site — jusqu'à 20×20 avec de longues listes de mots.",
    },
    {
      question: "Pour quel public est la rubrique Géant ?",
      answer:
        "Géant s'adresse aux experts, adultes passionnés et seniors qui recherchent une grille longue à résoudre.",
    },
    {
      question: "Peut-on imprimer les grilles Géant ?",
      answer:
        "Oui, exportez un PDF Géant en A4 ; le mode grand format améliore la lisibilité sur les très grandes grilles.",
    },
  ],
  enfants: [
    {
      question: "À partir de quel âge un enfant peut-il faire des mots mêlés ?",
      answer:
        "Dès 4–5 ans avec des grilles 6×6 en grandes lettres (maternelle), puis progressivement au CP, CE1, CE2, CM1 et CM2 selon le niveau de lecture.",
    },
    {
      question: "Les grilles sont-elles adaptées aux enfants qui apprennent à lire ?",
      answer:
        "Oui, chaque niveau propose un vocabulaire court et des grilles calibrées : mots outils au CP, lexique thématique au CE1–CE2, mots plus longs au CM1–CM2.",
    },
    {
      question: "Puis-je imprimer plusieurs grilles à la fois pour la classe ?",
      answer:
        "Oui, téléchargez autant de PDF A4 que nécessaire — chaque grille inclut le corrigé sur une page séparée, gratuitement.",
    },
  ],
  adultes: ADULTES_FAQ,
  seniors: SENIORS_FAQ,
  pedagogie: PEDAGOGIE_FAQ,
  personnages: [
    {
      question: "Qui est Hibou sur la page Personnages ?",
      answer:
        "Hibou est la mascotte de Hibou&Mots ; la page Personnages présente son univers et les compagnons du site.",
    },
    {
      question: "Les personnages apparaissent-ils dans les grilles ?",
      answer:
        "Les personnages illustrent le site et guident les enfants ; les grilles restent accessibles depuis les rubriques thématiques.",
    },
    {
      question: "Cette page Personnages est-elle pour les enfants ?",
      answer:
        "Oui, la rubrique Personnages est pensée pour découvrir l'univers ludique de Hibou&Mots en famille ou en classe.",
    },
  ],
  application: [
    {
      question: "L'application Hibou&Mots est-elle disponible ?",
      answer:
        "La page Application présente le projet mobile Hibou&Mots ; la sortie est annoncée prochainement sur cette rubrique.",
    },
    {
      question: "Pourrai-je jouer hors ligne avec l'application ?",
      answer:
        "L'application visera l'accès aux grilles favorites ; en attendant, imprimez un PDF depuis le site ou jouez en ligne.",
    },
    {
      question: "Les grilles du site seront-elles dans l'application ?",
      answer:
        "Oui, l'application reprendra le catalogue et les thèmes déjà disponibles sur Hibou&Mots.",
    },
  ],
  solutions: [
    {
      question: "Que contient la page Solutions et règles ?",
      answer:
        "La rubrique Solutions explique comment lire une grille, quelles directions sont autorisées et comment vérifier ses réponses.",
    },
    {
      question: "Où voir la solution d'une grille en cours ?",
      answer:
        "Sur chaque puzzle, cliquez « Voir la solution » ; la page Solutions détaille aussi les bonnes pratiques de correction.",
    },
    {
      question: "Les règles diffèrent-elles selon la difficulté ?",
      answer:
        "Oui, la page Solutions rappelle que Facile n'autorise pas les diagonales, contrairement à Moyen ou Difficile.",
    },
  ],
  "jeux-magazines": [
    {
      question: "Que propose la page Jeux et magazines ?",
      answer:
        "La rubrique Jeux et magazines recense des titres français de mots mêlés et renvoie vers les grilles inspirées de la presse.",
    },
    {
      question: "Ces jeux sont-ils liés au hub Presse ?",
      answer:
        "Oui, la page Jeux et magazines complète le hub Journaux & Magazines avec une sélection de références populaires.",
    },
    {
      question: "Peut-on jouer gratuitement depuis cette page ?",
      answer:
        "Oui, les grilles liées depuis Jeux et magazines restent gratuites sur Hibou&Mots, en ligne ou en PDF.",
    },
  ],
  "ressources-enseignants": [
    {
      question: "Quelles ressources enseignants trouve-t-on ici ?",
      answer:
        "La page Ressources enseignants regroupe fiches, idées d'activités et liens vers les grilles par niveau et par thème.",
    },
    {
      question: "Ces ressources enseignants sont-elles gratuites ?",
      answer:
        "Oui, toute la rubrique Ressources enseignants est accessible sans frais ni création de compte.",
    },
    {
      question: "Puis-je imprimer les grilles pour ma classe depuis cette page ?",
      answer:
        "Oui, chaque ressource Ressources enseignants renvoie vers des PDF imprimables avec corrigé.",
    },
  ],
  "ce1-noel": [
    {
      question: "Que signifie la page CE1 × Noël ?",
      answer:
        "Cette combinaison croise le vocabulaire de Noël avec le niveau CE1 : listes et grilles calibrées pour des élèves de 7 ans.",
    },
    {
      question: "Quand utiliser les grilles CE1 Noël en classe ?",
      answer:
        "En décembre, distribuez une grille CE1 × Noël avant les vacances pour une activité festive adaptée au cycle 2.",
    },
    {
      question: "Peut-on accéder au thème Noël ou au niveau CE1 seul ?",
      answer:
        "Oui, les liens parents renvoient vers la page Noël et vers la rubrique CE1 pour explorer chaque axe séparément.",
    },
  ],
  "ce1-halloween": [
    {
      question: "Que propose la page CE1 × Halloween ?",
      answer:
        "Cette rubrique croise le lexique d'Halloween avec le niveau CE1 : mots festifs sur des grilles 10×10 adaptées.",
    },
    {
      question: "Quand utiliser CE1 Halloween en classe ?",
      answer:
        "En octobre, proposez une grille CE1 × Halloween en activité calme après un atelier déguisement ou lecture d'automne.",
    },
    {
      question: "Peut-on imprimer les grilles CE1 Halloween ?",
      answer:
        "Oui, chaque puzzle CE1 × Halloween s'exporte en PDF A4 avec corrigé, gratuit pour la classe.",
    },
  ],
  "ouest-france": [
    {
      question: "Les grilles Ouest-France reprennent-elles le style du journal ?",
      answer:
        "La page Mots mêlés Ouest-France s'inspire du format des grilles publiées dans le quotidien régional, adapté au web et au PDF.",
    },
    {
      question: "Peut-on imprimer les grilles Ouest-France ?",
      answer:
        "Oui, exportez un PDF gratuit depuis la rubrique Ouest-France, corrigé sur la page suivante.",
    },
    {
      question: "Cette rubrique convient-elle aux habitués de la presse ?",
      answer:
        "Oui, les passionnés de mots mêlés Ouest-France retrouvent une présentation familière en version numérique.",
    },
  ],
  "sud-ouest": [
    {
      question: "Que contient la page Mots mêlés Sud Ouest ?",
      answer:
        "La rubrique Sud Ouest propose des grilles inspirées du journal du Sud-Ouest, jouables en ligne ou imprimables.",
    },
    {
      question: "Les grilles Sud Ouest sont-elles gratuites ?",
      answer:
        "Oui, toute la page Sud Ouest reste accessible gratuitement, sans inscription, comme le reste de Hibou&Mots.",
    },
    {
      question: "Peut-on jouer en ligne sur Sud Ouest ?",
      answer:
        "Oui, lancez une partie depuis la rubrique Sud Ouest ou téléchargez le PDF pour une version papier.",
    },
  ],
  "la-croix": [
    {
      question: "Les grilles La Croix suivent-elles le style du magazine ?",
      answer:
        "La page Mots mêlés La Croix s'inspire des grilles du titre, avec une mise en page adaptée à l'écran et à l'impression.",
    },
    {
      question: "Peut-on imprimer les grilles La Croix ?",
      answer:
        "Oui, chaque export La Croix est un PDF A4 gratuit avec solution incluse.",
    },
    {
      question: "À qui s'adresse la rubrique La Croix ?",
      answer:
        "Aux lecteurs de La Croix et aux amateurs de mots mêlés de presse qui cherchent une grille quotidienne en ligne.",
    },
  ],
}
