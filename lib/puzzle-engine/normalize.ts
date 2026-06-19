import type { PreparedWord } from "./types"
import { PuzzleGenerationError } from "./errors"

/** Precomposed French / Latin accents → ASCII (fallback when NFD leaves composed chars). */
const ACCENTED_CHARS: Record<string, string> = {
  À: "A",
  Á: "A",
  Â: "A",
  Ã: "A",
  Ä: "A",
  Å: "A",
  Æ: "AE",
  Ç: "C",
  È: "E",
  É: "E",
  Ê: "E",
  Ë: "E",
  Ì: "I",
  Í: "I",
  Î: "I",
  Ï: "I",
  Ñ: "N",
  Ò: "O",
  Ó: "O",
  Ô: "O",
  Õ: "O",
  Ö: "O",
  Œ: "OE",
  Ù: "U",
  Ú: "U",
  Û: "U",
  Ü: "U",
  Ý: "Y",
  Ÿ: "Y",
  à: "a",
  á: "a",
  â: "a",
  ã: "a",
  ä: "a",
  å: "a",
  æ: "ae",
  ç: "c",
  è: "e",
  é: "e",
  ê: "e",
  ë: "e",
  ì: "i",
  í: "i",
  î: "i",
  ï: "i",
  ñ: "n",
  ò: "o",
  ó: "o",
  ô: "o",
  õ: "o",
  ö: "o",
  œ: "oe",
  ù: "u",
  ú: "u",
  û: "u",
  ü: "u",
  ý: "y",
  ÿ: "y",
}

export function stripAccents(input: string): string {
  const decomposed = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  return decomposed.replace(
    /[^\u0000-\u007F]/g,
    (char) => ACCENTED_CHARS[char] ?? char,
  )
}

/** Normalise for grid placement: uppercase, letters only; optionally strip accents. */
export function normalizeWord(input: string, simplifyAccents = true): string {
  const base = simplifyAccents ? stripAccents(input) : input
  return base.toUpperCase().replace(/[^A-Z]/g, "")
}

export function prepareWords(
  rawWords: string[],
  simplifyAccents: boolean,
  maxWordLength: number,
): PreparedWord[] {
  const seen = new Set<string>()
  const prepared: PreparedWord[] = []

  for (const raw of rawWords) {
    const trimmed = raw.trim()
    if (!trimmed) continue

    const gridWord = normalizeWord(trimmed, simplifyAccents)
    if (gridWord.length < 2) continue
    if (gridWord.length > maxWordLength) continue

    if (seen.has(gridWord)) continue
    seen.add(gridWord)

    prepared.push({
      displayWord: trimmed.toUpperCase().replace(/[^A-Za-zÀ-ÿ]/g, "") || gridWord,
      gridWord,
    })
  }

  return prepared.sort((a, b) => b.gridWord.length - a.gridWord.length)
}
