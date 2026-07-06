import { cn } from "@/lib/utils"

type AdSlotPlaceholderProps = {
  label?: string
  className?: string
  variant?: "in-feed" | "sidebar" | "in-content"
}

/** Fixed responsive heights reserved before AdSense loads (prevents CLS). */
const RESERVED_DIMENSIONS = {
  sidebar: "h-[600px] w-full max-w-[300px] shrink-0",
  "in-feed":
    "h-[88px] w-full shrink-0 sm:h-[152px] md:h-[184px] lg:h-[160px] xl:h-[220px]",
  "in-content":
    "h-[112px] w-full shrink-0 sm:h-[190px] md:h-[230px] lg:h-[305px] xl:h-[380px]",
} as const

const PLACEHOLDER_STYLING =
  "flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 text-xs font-bold uppercase tracking-wide text-muted-foreground"

export function AdSlotPlaceholder({
  label = "Espace publicitaire",
  className,
  variant = "in-content",
}: AdSlotPlaceholderProps) {
  return (
    <div className={cn(RESERVED_DIMENSIONS[variant], className)} aria-hidden>
      <div className={PLACEHOLDER_STYLING}>{label}</div>
    </div>
  )
}
