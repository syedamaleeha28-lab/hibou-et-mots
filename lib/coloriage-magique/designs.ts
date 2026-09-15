export type ColoriageShape =
  | { kind: "circle"; cx: number; cy: number; r: number }
  | { kind: "polygon"; points: string }
  | { kind: "path"; d: string }

export type ColoriageRegion = {
  id: string
  shape: ColoriageShape
  /** Which legend number this region belongs to. */
  number: number
  /** Precomputed label position for the printable (outline-only)
   *  version — where the number is printed inside the region. */
  labelX: number
  labelY: number
}

export type ColoriageLegendEntry = {
  number: number
  colorName: string
  colorHex: string
}

export type ColoriageDesign = {
  id: string
  title: string
  viewBox: string
  /** "maternelle-cp" = simple 2-color designs (existing soleil/fleur).
   *  "ce2" = more complex, more-color designs for older kids. Optional
   *  and defaults to "maternelle-cp" in application code below, so
   *  nothing about the existing 2 designs needs to change other than
   *  tagging them explicitly for clarity. */
  level?: "maternelle-cp" | "ce2"
  regions: ColoriageRegion[]
  legend: ColoriageLegendEntry[]
}

/**
 * Both designs below were NOT hand-drawn by eye — every coordinate was
 * computed with actual trigonometry (regular angles around a center
 * point) and then rendered + visually verified as a real PNG before
 * being transcribed here. This matters more for this format than any
 * other puzzle type on the site: a coloring page needs precise,
 * unambiguous enclosed regions to function at all, and there's no
 * reliable way to get that from an AI image generator (it can't
 * guarantee structural correctness — enclosed regions matching exact
 * numbers matching a legend). Constructed geometry, not generated
 * imagery, same "verify before shipping" discipline as the sudoku
 * puzzle-uniqueness check.
 */
export const COLORIAGE_DESIGNS: ColoriageDesign[] = [
  {
    id: "soleil",
    title: "Soleil",
    viewBox: "0 0 200 200",
    level: "maternelle-cp",
    legend: [
      { number: 1, colorName: "Jaune", colorHex: "#FDCA3A" },
      { number: 2, colorName: "Orange", colorHex: "#F1683B" },
    ],
    regions: [
      { id: "center", shape: { kind: "circle", cx: 100, cy: 100, r: 42 }, number: 1, labelX: 100, labelY: 100 },
      { id: "ray-0", shape: { kind: "polygon", points: "141.1,91.3 185.0,100.0 141.1,108.7" }, number: 2, labelX: 155.7, labelY: 100.0 },
      { id: "ray-1", shape: { kind: "polygon", points: "135.2,122.9 160.1,160.1 122.9,135.2" }, number: 2, labelX: 139.4, labelY: 139.4 },
      { id: "ray-2", shape: { kind: "polygon", points: "108.7,141.1 100.0,185.0 91.3,141.1" }, number: 2, labelX: 100.0, labelY: 155.7 },
      { id: "ray-3", shape: { kind: "polygon", points: "77.1,135.2 39.9,160.1 64.8,122.9" }, number: 2, labelX: 60.6, labelY: 139.4 },
      { id: "ray-4", shape: { kind: "polygon", points: "58.9,108.7 15.0,100.0 58.9,91.3" }, number: 2, labelX: 44.3, labelY: 100.0 },
      { id: "ray-5", shape: { kind: "polygon", points: "64.8,77.1 39.9,39.9 77.1,64.8" }, number: 2, labelX: 60.6, labelY: 60.6 },
      { id: "ray-6", shape: { kind: "polygon", points: "91.3,58.9 100.0,15.0 108.7,58.9" }, number: 2, labelX: 100.0, labelY: 44.3 },
      { id: "ray-7", shape: { kind: "polygon", points: "122.9,64.8 160.1,39.9 135.2,77.1" }, number: 2, labelX: 139.4, labelY: 60.6 },
    ],
  },
  {
    id: "fleur",
    title: "Fleur",
    viewBox: "0 0 200 200",
    level: "maternelle-cp",
    legend: [
      { number: 1, colorName: "Jaune", colorHex: "#FDCA3A" },
      { number: 2, colorName: "Rose", colorHex: "#EC7A9B" },
    ],
    regions: [
      { id: "petal-0", shape: { kind: "path", d: "M 100.0,100.0 Q 127.5,116.0 155.0,100.0 Q 127.5,84.0 100.0,100.0 Z" }, number: 2, labelX: 138.0, labelY: 100.0 },
      { id: "petal-1", shape: { kind: "path", d: "M 100.0,100.0 Q 99.9,131.8 127.5,147.6 Q 127.6,115.8 100.0,100.0 Z" }, number: 2, labelX: 119.0, labelY: 132.9 },
      { id: "petal-2", shape: { kind: "path", d: "M 100.0,100.0 Q 72.4,115.8 72.5,147.6 Q 100.1,131.8 100.0,100.0 Z" }, number: 2, labelX: 81.0, labelY: 132.9 },
      { id: "petal-3", shape: { kind: "path", d: "M 100.0,100.0 Q 72.5,84.0 45.0,100.0 Q 72.5,116.0 100.0,100.0 Z" }, number: 2, labelX: 62.0, labelY: 100.0 },
      { id: "petal-4", shape: { kind: "path", d: "M 100.0,100.0 Q 100.1,68.2 72.5,52.4 Q 72.4,84.2 100.0,100.0 Z" }, number: 2, labelX: 81.0, labelY: 67.1 },
      { id: "petal-5", shape: { kind: "path", d: "M 100.0,100.0 Q 127.6,84.2 127.5,52.4 Q 99.9,68.2 100.0,100.0 Z" }, number: 2, labelX: 119.0, labelY: 67.1 },
      { id: "center", shape: { kind: "circle", cx: 100, cy: 100, r: 18 }, number: 1, labelX: 100, labelY: 100 },
    ],
  },
  {
    id: "papillon",
    title: "Papillon",
    viewBox: "0 0 200 200",
    level: "ce2",
    legend: [
      { number: 1, colorName: "Rose", colorHex: "#EC7A9B" },
      { number: 2, colorName: "Jaune", colorHex: "#FDCA3A" },
      { number: 3, colorName: "Orange", colorHex: "#F1683B" },
    ],
    regions: [
      { id: "upper-left-wing", shape: { kind: "polygon", points: "93.9,60.4 94.8,64.0 94.9,67.9 94.2,71.9 92.7,75.8 90.4,79.7 87.4,83.4 83.8,86.8 79.7,89.9 75.1,92.5 70.2,94.6 65.1,96.1 59.9,97.0 54.8,97.4 49.9,97.1 45.2,96.2 41.0,94.7 37.3,92.6 34.2,90.0 31.7,87.0 30.1,83.6 29.2,80.0 29.1,76.1 29.8,72.1 31.3,68.2 33.6,64.3 36.6,60.6 40.2,57.2 44.3,54.1 48.9,51.5 53.8,49.4 58.9,47.9 64.1,47.0 69.2,46.6 74.1,46.9 78.8,47.8 83.0,49.3 86.7,51.4 89.8,54.0 92.3,57.0 93.9,60.4" }, number: 1, labelX: 62, labelY: 72 },
      { id: "upper-right-wing", shape: { kind: "polygon", points: "169.9,83.6 168.3,87.0 165.8,90.0 162.7,92.6 159.0,94.7 154.8,96.2 150.1,97.1 145.2,97.4 140.1,97.0 134.9,96.1 129.8,94.6 124.9,92.5 120.3,89.9 116.2,86.8 112.6,83.4 109.6,79.7 107.3,75.8 105.8,71.9 105.1,67.9 105.2,64.0 106.1,60.4 107.7,57.0 110.2,54.0 113.3,51.4 117.0,49.3 121.2,47.8 125.9,46.9 130.8,46.6 135.9,47.0 141.1,47.9 146.2,49.4 151.1,51.5 155.7,54.1 159.8,57.2 163.4,60.6 166.4,64.3 168.7,68.2 170.2,72.1 170.9,76.1 170.8,80.0 169.9,83.6" }, number: 1, labelX: 138, labelY: 72 },
      { id: "lower-left-wing", shape: { kind: "polygon", points: "93.3,116.3 93.6,118.8 93.5,121.4 92.8,123.9 91.6,126.5 90.0,128.9 87.8,131.2 85.3,133.2 82.5,134.9 79.4,136.4 76.1,137.5 72.8,138.2 69.4,138.5 66.0,138.4 62.9,137.9 59.9,137.0 57.2,135.7 54.9,134.1 53.1,132.2 51.7,130.0 50.7,127.7 50.4,125.2 50.5,122.6 51.2,120.1 52.4,117.5 54.0,115.1 56.2,112.8 58.7,110.8 61.5,109.1 64.6,107.6 67.9,106.5 71.2,105.8 74.6,105.5 78.0,105.6 81.1,106.1 84.1,107.0 86.8,108.3 89.1,109.9 90.9,111.8 92.3,114.0 93.3,116.3" }, number: 2, labelX: 72, labelY: 122 },
      { id: "lower-right-wing", shape: { kind: "polygon", points: "149.3,127.7 148.3,130.0 146.9,132.2 145.1,134.1 142.8,135.7 140.1,137.0 137.1,137.9 134.0,138.4 130.6,138.5 127.2,138.2 123.9,137.5 120.6,136.4 117.5,134.9 114.7,133.2 112.2,131.2 110.0,128.9 108.4,126.5 107.2,123.9 106.5,121.4 106.4,118.8 106.7,116.3 107.7,114.0 109.1,111.8 110.9,109.9 113.2,108.3 115.9,107.0 118.9,106.1 122.0,105.6 125.4,105.5 128.8,105.8 132.1,106.5 135.4,107.6 138.5,109.1 141.3,110.8 143.8,112.8 146.0,115.1 147.6,117.5 148.8,120.1 149.5,122.6 149.6,125.2 149.3,127.7" }, number: 2, labelX: 128, labelY: 122 },
      { id: "body", shape: { kind: "polygon", points: "106.0,100.0 105.9,105.3 105.7,110.5 105.3,115.4 104.9,120.0 104.2,124.0 103.5,127.5 102.7,130.3 101.9,132.3 100.9,133.6 100.0,134.0 99.1,133.6 98.1,132.3 97.3,130.3 96.5,127.5 95.8,124.0 95.1,120.0 94.7,115.4 94.3,110.5 94.1,105.3 94.0,100.0 94.1,94.7 94.3,89.5 94.7,84.6 95.1,80.0 95.8,76.0 96.5,72.5 97.3,69.7 98.1,67.7 99.1,66.4 100.0,66.0 100.9,66.4 101.9,67.7 102.7,69.7 103.5,72.5 104.2,76.0 104.9,80.0 105.3,84.6 105.7,89.5 105.9,94.7 106.0,100.0" }, number: 3, labelX: 100, labelY: 100 },
    ],
  },
  {
    id: "maison",
    title: "Maison",
    viewBox: "0 0 200 200",
    level: "ce2",
    legend: [
      { number: 1, colorName: "Jaune", colorHex: "#FDCA3A" },
      { number: 2, colorName: "Orange", colorHex: "#F1683B" },
      { number: 3, colorName: "Blanc", colorHex: "#FFFFFF" },
      { number: 4, colorName: "Turquoise", colorHex: "#36BABB" },
      { number: 5, colorName: "Vert", colorHex: "#61BD67" },
    ],
    regions: [
      { id: "sun", shape: { kind: "circle", cx: 170, cy: 30, r: 18 }, number: 1, labelX: 170, labelY: 30 },
      { id: "roof", shape: { kind: "polygon", points: "40,90 100,40 160,90" }, number: 2, labelX: 100, labelY: 73.3 },
      { id: "walls", shape: { kind: "path", d: "M 50,90 L 150,90 L 150,170 L 50,170 Z" }, number: 3, labelX: 58, labelY: 160 },
      { id: "door", shape: { kind: "path", d: "M 88,125 L 112,125 L 112,170 L 88,170 Z" }, number: 4, labelX: 100, labelY: 148 },
      { id: "window-left", shape: { kind: "path", d: "M 60,105 L 80,105 L 80,125 L 60,125 Z" }, number: 5, labelX: 70, labelY: 115 },
      { id: "window-right", shape: { kind: "path", d: "M 120,105 L 140,105 L 140,125 L 120,125 Z" }, number: 5, labelX: 130, labelY: 115 },
    ],
  },
]

export function getDesignById(id: string): ColoriageDesign | undefined {
  return COLORIAGE_DESIGNS.find((d) => d.id === id)
}
