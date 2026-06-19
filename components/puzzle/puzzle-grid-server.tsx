import { cn } from "@/lib/utils"

type PuzzleGridServerProps = {
  grid: string[][]
  largePrint?: boolean
  className?: string
}

export function PuzzleGridServer({ grid, largePrint = false, className }: PuzzleGridServerProps) {
  const size = grid.length

  return (
    <div
      className={cn(
        "overflow-x-auto rounded-2xl border border-border bg-card p-3 shadow-sm",
        className,
      )}
    >
      <table
        className="mx-auto border-collapse"
        role="grid"
        aria-label="Grille de mots mêlés"
      >
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((letter, colIndex) => (
                <td
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    "border border-border/60 text-center font-bold uppercase text-foreground",
                    largePrint
                      ? "min-h-10 min-w-10 p-2 text-base sm:text-lg"
                      : "min-h-7 min-w-7 p-1 text-xs sm:min-h-8 sm:min-w-8 sm:text-sm",
                  )}
                  role="gridcell"
                  aria-label={`Lettre ${letter}`}
                >
                  {letter}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="sr-only">Grille de {size} colonnes sur {size} lignes.</p>
    </div>
  )
}
