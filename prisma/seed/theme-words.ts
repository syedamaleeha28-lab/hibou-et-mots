import type { ThemeSlug } from "./themes"

export type ThemeWordSeed = {
  themeSlug: ThemeSlug
  word: string
  minGradeOrder: number
}

/** Normalise for length: uppercase, no accents for storage consistency with puzzle engine */
function wordLength(word: string): number {
  return word
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z]/g, "").length
}

function entry(
  themeSlug: ThemeSlug,
  word: string,
  minGradeOrder: number,
): ThemeWordSeed {
  return { themeSlug, word: word.toUpperCase(), minGradeOrder }
}

const rawWords: ThemeWordSeed[] = [
  // Noël
  ...[
    ["noel", "NEIGE", 0],
    ["noel", "LUTIN", 0],
    ["noel", "JOIE", 0],
    ["noel", "SAPIN", 1],
    ["noel", "CADEAU", 1],
    ["noel", "ETOILE", 1],
    ["noel", "RENNE", 1],
    ["noel", "CLOCHES", 2],
    ["noel", "BONNET", 2],
    ["noel", "GUIMAUVE", 3],
    ["noel", "COURONNE", 3],
    ["noel", "CALENDRIER", 5],
    ["noel", "DECORATION", 5],
    ["noel", "FESTIVITE", 6],
    ["noel", "TRADITION", 6],
  ].map(([s, w, g]) => entry(s as ThemeSlug, w as string, g as number)),

  // Halloween
  ...[
    ["halloween", "HIBOU", 0],
    ["halloween", "CHAT", 0],
    ["halloween", "NUIT", 1],
    ["halloween", "SORT", 1],
    ["halloween", "FANTOME", 2],
    ["halloween", "SQUELETTE", 3],
    ["halloween", "CITROUILLE", 3],
    ["halloween", "SORCIERE", 3],
    ["halloween", "CHAUDRON", 4],
    ["halloween", "COSTUME", 2],
    ["halloween", "EFFROI", 4],
    ["halloween", "TOILE", 2],
    ["halloween", "ARAIGNEE", 4],
    ["halloween", "MYSTERE", 5],
    ["halloween", "TERRIFIANT", 6],
  ].map(([s, w, g]) => entry(s as ThemeSlug, w as string, g as number)),

  // Pâques
  ...[
    ["paques", "OEUF", 0],
    ["paques", "LAPIN", 1],
    ["paques", "HERBE", 1],
    ["paques", "PANIER", 2],
    ["paques", "FETE", 1],
    ["paques", "PRINTEMPS", 3],
    ["paques", "CHOCOLAT", 3],
    ["paques", "COLOMBE", 3],
    ["paques", "JARDIN", 2],
    ["paques", "FLEUR", 1],
    ["paques", "PAPILLON", 4],
    ["paques", "TRADITION", 6],
    ["paques", "CELEBRATION", 6],
    ["paques", "DECORATION", 5],
    ["paques", "CHASSE", 2],
  ].map(([s, w, g]) => entry(s as ThemeSlug, w as string, g as number)),

  // Carnaval
  ...[
    ["carnaval", "MASQUE", 1],
    ["carnaval", "FETE", 1],
    ["carnaval", "RIO", 1],
    ["carnaval", "DEFILE", 2],
    ["carnaval", "COSTUME", 2],
    ["carnaval", "CONFETTI", 3],
    ["carnaval", "CHAR", 1],
    ["carnaval", "MUSIQUE", 3],
    ["carnaval", "DANSE", 2],
    ["carnaval", "PARADE", 3],
    ["carnaval", "FANTAISIE", 5],
    ["carnaval", "CIRQUE", 3],
    ["carnaval", "FESTIVAL", 5],
    ["carnaval", "CELEBRATION", 6],
    ["carnaval", "COSTUMER", 4],
  ].map(([s, w, g]) => entry(s as ThemeSlug, w as string, g as number)),

  // Rentrée
  ...[
    ["rentree", "SAC", 0],
    ["rentree", "CRAYON", 1],
    ["rentree", "LIVRE", 1],
    ["rentree", "ECOLE", 1],
    ["rentree", "CLASSE", 2],
    ["rentree", "CAHIER", 2],
    ["rentree", "REGLE", 2],
    ["rentree", "GOMME", 2],
    ["rentree", "STYLO", 2],
    ["rentree", "CARTABLE", 3],
    ["rentree", "PROFESSEUR", 4],
    ["rentree", "APPRENTISSAGE", 6],
    ["rentree", "ORGANISATION", 6],
    ["rentree", "REVISION", 5],
    ["rentree", "COLLATION", 4],
  ].map(([s, w, g]) => entry(s as ThemeSlug, w as string, g as number)),

  // Été
  ...[
    ["ete", "SOLEIL", 1],
    ["ete", "MER", 0],
    ["ete", "PLAGE", 2],
    ["ete", "SABLE", 2],
    ["ete", "GLACE", 1],
    ["ete", "VACANCES", 3],
    ["ete", "NAGE", 1],
    ["ete", "CHALEUR", 3],
    ["ete", "PARASOL", 4],
    ["ete", "MAILLOT", 3],
    ["ete", "CAMPING", 3],
    ["ete", "BARBECUE", 4],
    ["ete", "CANICULE", 5],
    ["ete", "CROISIERE", 6],
    ["ete", "ACTIVITE", 5],
  ].map(([s, w, g]) => entry(s as ThemeSlug, w as string, g as number)),

  // Animaux
  ...[
    ["animaux", "CHAT", 0],
    ["animaux", "CHIEN", 1],
    ["animaux", "LION", 1],
    ["animaux", "OURS", 1],
    ["animaux", "ZEBRE", 2],
    ["animaux", "TIGRE", 2],
    ["animaux", "LAPIN", 1],
    ["animaux", "RENARD", 2],
    ["animaux", "ELEPHANT", 3],
    ["animaux", "GIRAFE", 3],
    ["animaux", "CROCODILE", 4],
    ["animaux", "HIPPOPOTAME", 5],
    ["animaux", "PAPILLON", 4],
    ["animaux", "DAUPHIN", 4],
    ["animaux", "KANGOUROU", 5],
  ].map(([s, w, g]) => entry(s as ThemeSlug, w as string, g as number)),

  // Fruits
  ...[
    ["fruits", "POMME", 1],
    ["fruits", "POIRE", 1],
    ["fruits", "BANANE", 2],
    ["fruits", "FRAISE", 2],
    ["fruits", "CERISE", 2],
    ["fruits", "RAISIN", 2],
    ["fruits", "MELON", 2],
    ["fruits", "KIWI", 1],
    ["fruits", "ORANGE", 2],
    ["fruits", "ANANAS", 3],
    ["fruits", "FRAMBOISE", 4],
    ["fruits", "MANGUE", 3],
    ["fruits", "PASTEQUE", 4],
    ["fruits", "GROSEILLE", 5],
    ["fruits", "MANDARINE", 4],
  ].map(([s, w, g]) => entry(s as ThemeSlug, w as string, g as number)),

  // Sport
  ...[
    ["sport", "BALLON", 2],
    ["sport", "COURSE", 2],
    ["sport", "SAUT", 1],
    ["sport", "NATATION", 4],
    ["sport", "TENNIS", 3],
    ["sport", "RUGBY", 3],
    ["sport", "VOLLEY", 3],
    ["sport", "SKI", 1],
    ["sport", "JUDO", 2],
    ["sport", "GYMNASTIQUE", 5],
    ["sport", "ATHLETISME", 5],
    ["sport", "CHAMPION", 4],
    ["sport", "EQUIPE", 3],
    ["sport", "ENTRAINEMENT", 6],
    ["sport", "COMPETITION", 6],
  ].map(([s, w, g]) => entry(s as ThemeSlug, w as string, g as number)),

  // Football
  ...[
    ["football", "BUT", 0],
    ["football", "BALLON", 2],
    ["football", "GARDIEN", 3],
    ["football", "STADE", 2],
    ["football", "MATCH", 2],
    ["football", "EQUIPE", 3],
    ["football", "TIR", 1],
    ["football", "CORNER", 3],
    ["football", "PENALTY", 4],
    ["football", "DEFENSE", 4],
    ["football", "ATTAQUE", 4],
    ["football", "ENTRAINEMENT", 6],
    ["football", "CHAMPIONNAT", 6],
    ["football", "ARBITRE", 4],
    ["football", "TOURNOI", 4],
  ].map(([s, w, g]) => entry(s as ThemeSlug, w as string, g as number)),

  // Vocabulaire
  ...[
    ["vocabulaire", "MOT", 0],
    ["vocabulaire", "LIRE", 1],
    ["vocabulaire", "ECRIRE", 2],
    ["vocabulaire", "PHRASE", 2],
    ["vocabulaire", "TEXTE", 2],
    ["vocabulaire", "LETTRE", 2],
    ["vocabulaire", "SYLLABE", 4],
    ["vocabulaire", "ORTHOGRAPHE", 6],
    ["vocabulaire", "DICTIONNAIRE", 6],
    ["vocabulaire", "LECTURE", 3],
    ["vocabulaire", "GRAMMAIRE", 5],
    ["vocabulaire", "CONJUGAISON", 6],
    ["vocabulaire", "EXPRESSION", 5],
    ["vocabulaire", "VOCABULAIRE", 5],
    ["vocabulaire", "COMPREHENSION", 6],
  ].map(([s, w, g]) => entry(s as ThemeSlug, w as string, g as number)),

  // Couleurs
  ...[
    ["couleurs", "ROUGE", 1],
    ["couleurs", "BLEU", 1],
    ["couleurs", "VERT", 1],
    ["couleurs", "JAUNE", 2],
    ["couleurs", "ROSE", 1],
    ["couleurs", "NOIR", 1],
    ["couleurs", "BLANC", 2],
    ["couleurs", "ORANGE", 2],
    ["couleurs", "VIOLET", 3],
    ["couleurs", "MARRON", 3],
    ["couleurs", "GRIS", 2],
    ["couleurs", "TURQUOISE", 5],
    ["couleurs", "MAUVE", 3],
    ["couleurs", "BEIGE", 3],
    ["couleurs", "DORE", 2],
  ].map(([s, w, g]) => entry(s as ThemeSlug, w as string, g as number)),

  // Famille
  ...[
    ["famille", "PAPA", 0],
    ["famille", "MAMAN", 0],
    ["famille", "BEBE", 0],
    ["famille", "FRERE", 1],
    ["famille", "SOEUR", 1],
    ["famille", "ONCLE", 2],
    ["famille", "TANTE", 2],
    ["famille", "COUSIN", 2],
    ["famille", "GRAND", 1],
    ["famille", "FAMILLE", 3],
    ["famille", "PARENTS", 3],
    ["famille", "ENFANTS", 3],
    ["famille", "MARIAGE", 4],
    ["famille", "GENERATION", 6],
    ["famille", "FOYER", 3],
  ].map(([s, w, g]) => entry(s as ThemeSlug, w as string, g as number)),

  // Météo
  ...[
    ["meteo", "PLUIE", 1],
    ["meteo", "NEIGE", 1],
    ["meteo", "SOLEIL", 2],
    ["meteo", "NUAGE", 2],
    ["meteo", "VENT", 1],
    ["meteo", "ORAGE", 2],
    ["meteo", "BROUILLARD", 5],
    ["meteo", "TEMPETE", 4],
    ["meteo", "ARCENCIEL", 4],
    ["meteo", "GRELE", 2],
    ["meteo", "CANICULE", 5],
    ["meteo", "CLIMAT", 4],
    ["meteo", "SAISON", 3],
    ["meteo", "TEMPERATURE", 6],
    ["meteo", "METEOROLOGIE", 6],
  ].map(([s, w, g]) => entry(s as ThemeSlug, w as string, g as number)),

  // Corps humain
  ...[
    ["corps-humain", "TETE", 0],
    ["corps-humain", "MAIN", 0],
    ["corps-humain", "PIED", 0],
    ["corps-humain", "BRAS", 1],
    ["corps-humain", "JAMBE", 2],
    ["corps-humain", "OEIL", 1],
    ["corps-humain", "OREILLE", 3],
    ["corps-humain", "NEZ", 1],
    ["corps-humain", "BOUCHE", 2],
    ["corps-humain", "COEUR", 3],
    ["corps-humain", "ESTOMAC", 4],
    ["corps-humain", "PEAU", 2],
    ["corps-humain", "CHEVEU", 2],
    ["corps-humain", "DENT", 1],
    ["corps-humain", "DOIGT", 2],
  ].map(([s, w, g]) => entry(s as ThemeSlug, w as string, g as number)),

  // Pays du monde
  ...[
    ["pays-du-monde", "FRANCE", 2],
    ["pays-du-monde", "ITALIE", 3],
    ["pays-du-monde", "ESPAGNE", 3],
    ["pays-du-monde", "JAPON", 3],
    ["pays-du-monde", "CHINE", 2],
    ["pays-du-monde", "BRESIL", 3],
    ["pays-du-monde", "CANADA", 3],
    ["pays-du-monde", "MAROC", 3],
    ["pays-du-monde", "EGYPTE", 3],
    ["pays-du-monde", "SUISSE", 3],
    ["pays-du-monde", "ALLEMAGNE", 4],
    ["pays-du-monde", "ANGLETERRE", 4],
    ["pays-du-monde", "AUSTRALIE", 4],
    ["pays-du-monde", "ARGENTINE", 5],
    ["pays-du-monde", "PORTUGAL", 5],
  ].map(([s, w, g]) => entry(s as ThemeSlug, w as string, g as number)),

  // Sciences
  ...[
    ["sciences", "EAU", 0],
    ["sciences", "AIR", 0],
    ["sciences", "SOLEIL", 1],
    ["sciences", "LUNE", 1],
    ["sciences", "PLANTE", 1],
    ["sciences", "GRAINE", 2],
    ["sciences", "RACINE", 2],
    ["sciences", "ENERGIE", 3],
    ["sciences", "GRAVITE", 3],
    ["sciences", "PLANETE", 3],
    ["sciences", "ETOILE", 2],
    ["sciences", "MATIERE", 4],
    ["sciences", "MOLECULE", 5],
    ["sciences", "EXPERIENCE", 5],
    ["sciences", "MICROSCOPE", 5],
  ].map(([s, w, g]) => entry(s as ThemeSlug, w as string, g as number)),

  // Métiers
  ...[
    ["metiers", "CHEF", 0],
    ["metiers", "FACTEUR", 1],
    ["metiers", "POMPIER", 1],
    ["metiers", "MEDECIN", 2],
    ["metiers", "BOULANGER", 2],
    ["metiers", "FERMIER", 2],
    ["metiers", "PROFESSEUR", 2],
    ["metiers", "POLICIER", 2],
    ["metiers", "DENTISTE", 3],
    ["metiers", "VETERINAIRE", 4],
    ["metiers", "INFIRMIER", 3],
    ["metiers", "INGENIEUR", 4],
    ["metiers", "ARCHITECTE", 5],
    ["metiers", "JOURNALISTE", 5],
    ["metiers", "ASTRONAUTE", 4],
  ].map(([s, w, g]) => entry(s as ThemeSlug, w as string, g as number)),
]

export const themeWordSeed = rawWords.map((w) => ({
  ...w,
  length: wordLength(w.word),
}))
