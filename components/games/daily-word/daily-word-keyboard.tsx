"use client"

import type { LetterState } from "@/lib/daily-word"
import { cn } from "@/lib/utils"

const ROWS = [
  ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
  ["ENTER", "W", "X", "C", "V", "B", "N", "BACKSPACE"],
]

type DailyWordKeyboardProps = {
  letterStates: Record<string, LetterState>
  onKey: (key: string) => void
  disabled?: boolean
}

export function DailyWordKeyboard({ letterStates, onKey, disabled = false }: DailyWordKeyboardProps) {
  return (
    <div className="flex flex-col gap-1.5 select-none" role="group" aria-label="Clavier">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1.5">
          {row.map((key) => {
            const isWide = key === "ENTER" || key === "BACKSPACE"
            const state = letterStates[key]
            return (
              <button
                key={key}
                type="button"
                disabled={disabled}
                onClick={() => onKey(key)}
                aria-label={key === "ENTER" ? "Valider" : key === "BACKSPACE" ? "Effacer" : `Lettre ${key}`}
                className={cn(
                  "flex h-11 items-center justify-center rounded-lg font-bold uppercase transition-colors",
                  isWide ? "min-w-16 px-2 text-xs sm:text-sm" : "min-w-8 flex-1 max-w-11 text-sm sm:text-base",
                  state === "correct" && "bg-leaf text-leaf-foreground",
                  state === "present" && "bg-sunny text-sunny-foreground",
                  state === "absent" && "bg-muted-foreground/30 text-muted-foreground",
                  !state && "bg-muted text-foreground hover:bg-secondary/20",
                  disabled ? "cursor-default opacity-60" : "cursor-pointer",
                )}
              >
                {key === "BACKSPACE" ? "⌫" : key === "ENTER" ? "OK" : key}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
