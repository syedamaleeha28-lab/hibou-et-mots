import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { featuredThemeCategories } from "@/lib/home/featured-themes"
import { colorClasses } from "@/lib/colors"
import { SectionHeading } from "@/components/layout/section-heading"

export function FeaturedCategories() {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow="Thèmes"
        title="Explore nos catégories"
        description="Du règne animal aux fêtes de l'année, choisis un thème et plonge dans des grilles pleines de nouveaux mots."
      />

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {featuredThemeCategories.map((cat) => {
          const c = colorClasses[cat.color]
          const Icon = cat.icon
          return (
            <Link
              key={cat.href}
              href={cat.href}
              className="group flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 ring-2 ring-transparent transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${c.soft}`}
              >
                <Icon className="size-6" />
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-heading text-lg font-extrabold leading-tight text-foreground">
                  {cat.title}
                </h3>
                <p className="text-sm leading-snug text-muted-foreground">
                  {cat.description}
                </p>
              </div>
              <div className="mt-auto flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-muted-foreground">
                  {cat.countLabel}
                </span>
                <ArrowRight
                  className={`size-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 ${c.text}`}
                />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
