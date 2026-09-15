import { getSudokuGrade } from "@/lib/sudoku/grades"
import { SudokuGradePage, buildSudokuGradeMetadata } from "@/components/templates/sudoku/sudoku-grade-page"

const grade = getSudokuGrade("cm2")!

export const metadata = buildSudokuGradeMetadata(grade)

export default function SudokuCm2Page() {
  return <SudokuGradePage grade={grade} />
}
