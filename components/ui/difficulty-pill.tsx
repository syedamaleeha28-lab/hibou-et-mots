import { cn } from "@/lib/utils"

const DIFFICULTY_STYLES: Record<string, string> = {
  facile: "bg-leaf/15 text-leaf",
  moyen: "bg-sunny/30 text-sunny-foreground",
  difficile: "bg-coral/15 text-coral",
  geant: "bg-sky/15 text-sky",
}

type DifficultyPillProps = {
  slug: string
  name: string
  className?: string
}

export function DifficultyPill({ slug, name, className }: DifficultyPillProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-extrabold",
        DIFFICULTY_STYLES[slug] ?? "bg-muted text-muted-foreground",
        className,
      )}
    >
      {name}
    </span>
  )
}
