import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
  align?: "left" | "center"
  className?: string
  as?: "h1" | "h2"
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <span className="inline-flex items-center rounded-full bg-secondary/15 px-3 py-1 text-sm font-extrabold uppercase tracking-wide text-secondary">
        {eyebrow}
      </span>
      <Heading className="font-heading text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
        {title}
      </Heading>
      {description && (
        <p
          className={cn(
            "text-lg leading-relaxed text-muted-foreground text-pretty",
            align === "center" ? "max-w-2xl" : "max-w-xl",
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
