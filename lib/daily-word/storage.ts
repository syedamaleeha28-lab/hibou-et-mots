import { MAX_GUESSES } from "./engine"

const STATE_KEY = "hibou-et-mots:mot-du-jour:state"
const STATS_KEY = "hibou-et-mots:mot-du-jour:stats"

export type DailyWordStatus = "playing" | "won" | "lost"

export type DailyWordState = {
  dayIndex: number
  guesses: string[]
  status: DailyWordStatus
}

export type DailyWordStats = {
  played: number
  wins: number
  currentStreak: number
  maxStreak: number
  lastCompletedDayIndex: number | null
  /** distribution[i] = number of wins that took i+1 guesses */
  distribution: number[]
}

function emptyStats(): DailyWordStats {
  return {
    played: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    lastCompletedDayIndex: null,
    distribution: new Array(MAX_GUESSES).fill(0),
  }
}

export function readState(dayIndex: number): DailyWordState {
  const fallback: DailyWordState = { dayIndex, guesses: [], status: "playing" }
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(STATE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as DailyWordState
    if (parsed.dayIndex !== dayIndex) return fallback
    return parsed
  } catch {
    return fallback
  }
}

export function writeState(state: DailyWordState): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STATE_KEY, JSON.stringify(state))
  } catch {
    // Storage can fail (private browsing, quota); the game still works in-memory for this session.
  }
}

export function readStats(): DailyWordStats {
  if (typeof window === "undefined") return emptyStats()
  try {
    const raw = window.localStorage.getItem(STATS_KEY)
    if (!raw) return emptyStats()
    const parsed = JSON.parse(raw) as Partial<DailyWordStats>
    return { ...emptyStats(), ...parsed }
  } catch {
    return emptyStats()
  }
}

function writeStats(stats: DailyWordStats): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch {
    // ignore
  }
}

/** Records a finished round exactly once per day (guarded by lastCompletedDayIndex). */
export function recordResult(
  dayIndex: number,
  won: boolean,
  guessCount: number,
): DailyWordStats {
  const stats = readStats()
  if (stats.lastCompletedDayIndex === dayIndex) return stats

  const next: DailyWordStats = {
    ...stats,
    played: stats.played + 1,
    wins: won ? stats.wins + 1 : stats.wins,
    currentStreak: won ? stats.currentStreak + 1 : 0,
    lastCompletedDayIndex: dayIndex,
    distribution: [...stats.distribution],
  }
  next.maxStreak = Math.max(next.maxStreak, next.currentStreak)
  if (won && guessCount >= 1 && guessCount <= next.distribution.length) {
    next.distribution[guessCount - 1] = (next.distribution[guessCount - 1] ?? 0) + 1
  }
  writeStats(next)
  return next
}
