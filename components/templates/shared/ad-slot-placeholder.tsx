import { cn } from "@/lib/utils"

type AdSlotPlaceholderProps = {
  label?: string
  className?: string
  variant?: "in-feed" | "sidebar" | "in-content"
}

export function AdSlotPlaceholder({
  label = "Espace publicitaire",
  className,
  variant = "in-content",
}: AdSlotPlaceholderProps) {
  const aspect =
    variant === "sidebar"
      ? "aspect-[300/600] max-w-[300px]"
      : variant === "in-feed"
        ? "aspect-[4/1] w-full"
        : "aspect-[16/5] w-full"

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 text-xs font-bold uppercase tracking-wide text-muted-foreground",
        aspect,
        className,
      )}
      aria-hidden
    >
      {label}
    </div>
  )
}
