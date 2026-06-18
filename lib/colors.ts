import type { ColorKey } from "@/lib/content"

/** Static class maps so Tailwind keeps the utilities in the build. */
export const colorClasses: Record<
  ColorKey,
  { soft: string; solid: string; text: string; ring: string }
> = {
  coral: {
    soft: "bg-coral/12 text-coral",
    solid: "bg-coral text-coral-foreground",
    text: "text-coral",
    ring: "group-hover:ring-coral/40",
  },
  teal: {
    soft: "bg-teal/12 text-teal",
    solid: "bg-teal text-teal-foreground",
    text: "text-teal",
    ring: "group-hover:ring-teal/40",
  },
  sunny: {
    soft: "bg-sunny/25 text-sunny-foreground",
    solid: "bg-sunny text-sunny-foreground",
    text: "text-sunny-foreground",
    ring: "group-hover:ring-sunny/50",
  },
  sky: {
    soft: "bg-sky/12 text-sky",
    solid: "bg-sky text-sky-foreground",
    text: "text-sky",
    ring: "group-hover:ring-sky/40",
  },
  leaf: {
    soft: "bg-leaf/12 text-leaf",
    solid: "bg-leaf text-leaf-foreground",
    text: "text-leaf",
    ring: "group-hover:ring-leaf/40",
  },
}
