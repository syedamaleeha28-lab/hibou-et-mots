import { SectionHeading } from "@/components/layout/section-heading"

export function CategoryEmptyState() {
  return (
    <section aria-label="Grilles à venir">
      <SectionHeading
        align="left"
        eyebrow="Grilles"
        title="Mots mêlés à jouer et imprimer"
        description="De nouvelles grilles arrivent bientôt dans cette catégorie."
      />
      <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
        <p className="text-base font-semibold text-foreground">
          Les grilles de cette catégorie seront bientôt disponibles.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          En attendant, explorez les sous-catégories ci-dessus ou les rubriques associées plus bas.
        </p>
      </div>
    </section>
  )
}
