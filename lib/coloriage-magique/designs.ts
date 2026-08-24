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
]

export function getDesignById(id: string): ColoriageDesign | undefined {
  return COLORIAGE_DESIGNS.find((d) => d.id === id)
}
