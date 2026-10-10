import Image from "next/image"
import Link from "next/link"
import { Heart, Mail, Sparkles } from "lucide-react"
import { InstagramIcon, PinterestIcon, XIcon } from "@/components/icons/social-icons"
import { Button } from "@/components/ui/button"
import { footerLegalLinks, footerSiloColumns, type NavLink, type NavSection } from "@/lib/navigation"
import { CONTACT_EMAIL, ROUTES, SOCIAL_PROFILES } from "@/lib/seo"

const socialLinks = [
  {
    href: SOCIAL_PROFILES.instagram,
    label: "Suivez Hibou&Mots sur Instagram",
    Icon: InstagramIcon,
  },
  {
    href: SOCIAL_PROFILES.x,
    label: "Suivez Hibou&Mots sur X",
    Icon: XIcon,
  },
  {
    href: SOCIAL_PROFILES.pinterest,
    label: "Suivez Hibou&Mots sur Pinterest",
    Icon: PinterestIcon,
  },
] as const

/**
 * Link columns. Named silos stay together. Contact sits on the shorter
 * Par public / Éducation stack. Légal sits on Presse / Produits — the
 * short stack — so no column has more than three headings. Putting Légal
 * under Hub principal would make that column much taller than Presse.
 */
const FOOTER_COLUMNS = [
  { titles: ["Hub principal", "🇧🇷 Português"], contact: false, legal: false },
  { titles: ["Par public", "Éducation"], contact: true, legal: false },
  { titles: ["Thèmes & saisons", "Autres activités"], contact: false, legal: false },
  { titles: ["Autres jeux de mots", "Jeux de chiffres"], contact: false, legal: false },
  { titles: ["Presse", "Produits & ressources"], contact: false, legal: true },
] as const

function footerGroupsByTitle(titles: readonly string[]): NavSection[] {
  return titles.map((title) => {
    const group = footerSiloColumns.find((column) => column.title === title)
    if (!group) {
      throw new Error(`Groupe de pied de page introuvable : ${title}`)
    }
    return group
  })
}

const footerColumns = FOOTER_COLUMNS.map((column) => ({
  ...column,
  groups: footerGroupsByTitle(column.titles),
  headings: column.titles.length + Number(column.contact) + Number(column.legal),
}))

if (footerColumns.some((column) => column.headings > 3)) {
  throw new Error("Une colonne du pied de page dépasse 3 titres")
}

const assignedFooterTitles = new Set(footerColumns.flatMap((column) => column.groups.map((group) => group.title)))
const missingFooterTitles = footerSiloColumns
  .map((column) => column.title)
  .filter((title) => !assignedFooterTitles.has(title))

if (missingFooterTitles.length > 0) {
  throw new Error(`Groupes de pied de page non affichés : ${missingFooterTitles.join(", ")}`)
}

const footerTextLinkClass =
  "inline-flex min-h-11 max-w-full items-center text-sm font-semibold text-background/80 transition-colors hover:text-background pointer-fine:lg:inline pointer-fine:lg:min-h-0"

function FooterLinkGroup({ title, links }: { title: string; links: readonly NavLink[] }) {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <h3 className="font-heading text-sm font-extrabold uppercase tracking-wide text-background/60">
        {title}
      </h3>
      <ul className="flex min-w-0 flex-col gap-2">
        {links.map((link) => (
          <li key={`${link.href}:${link.label}`} className="min-w-0">
            <Link href={link.href} className={footerTextLinkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function FooterContact() {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <h3 className="font-heading text-sm font-extrabold uppercase tracking-wide text-background/60">
        Contact
      </h3>
      <p className="min-w-0 text-sm font-semibold text-background/80">
        E-mail :{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-block max-w-full min-h-11 break-all py-2.5 align-top text-sm font-semibold leading-5 text-background/80 transition-colors hover:text-background pointer-fine:lg:min-h-0 pointer-fine:lg:py-0"
        >
          {CONTACT_EMAIL}
        </a>
      </p>
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid min-w-0 gap-10 xl:grid-cols-[minmax(13.5rem,1fr)_repeat(5,minmax(0,1fr))]">
          <div className="flex min-w-0 flex-col gap-4">
            <Link href={ROUTES.home} className="flex min-h-11 items-center gap-2 pointer-fine:lg:min-h-0">
              <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-accent">
                <Image
                  src="/mascot-wave.webp"
                  alt="Hibou, la mascotte"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-cover"
                />
              </span>
              <span className="font-heading text-xl font-extrabold">Hibou&Mots</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-background/70">
              Des mots mêlés gratuits à imprimer et à jouer en ligne — pour les enfants,
              les enseignants et toute la famille.
            </p>

            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-background/10 text-background/80 transition-colors hover:bg-background/20 hover:text-background pointer-fine:lg:h-10 pointer-fine:lg:w-10"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <p className="text-sm font-bold">Reçois 5 nouvelles grilles par semaine</p>
              <form className="flex min-w-0 gap-2" action={ROUTES.contact} aria-label="Inscription à la newsletter">
                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-background/10 px-4">
                  <Mail className="size-4 text-background/60" aria-hidden />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="ton@email.fr"
                    className="w-full bg-transparent py-2.5 text-sm font-semibold text-background outline-none placeholder:text-background/50"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-11 rounded-full bg-primary font-extrabold text-primary-foreground hover:bg-primary/90 pointer-fine:lg:h-8"
                >
                  <Sparkles className="size-4" aria-hidden />
                  OK
                </Button>
              </form>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-10 xl:contents">
            {footerColumns.map((column) => (
              <div
                key={column.titles.join("|")}
                data-footer-column=""
                className="contents md:flex md:min-w-0 md:flex-col md:gap-8 md:self-start"
              >
                {column.groups.map((group) => (
                  <FooterLinkGroup key={group.title} title={group.title} links={group.links} />
                ))}
                {column.contact ? <FooterContact /> : null}
                {column.legal ? <FooterLinkGroup title="Légal" links={footerLegalLinks} /> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-background/15 pt-6 sm:flex-row">
          <p className="text-sm font-semibold text-background/60">
            © {new Date().getFullYear()} Hibou&Mots. Tous droits réservés.
          </p>
          <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-background/60">
            Fait avec <Heart className="size-4 fill-primary text-primary" aria-hidden /> pour les
            petits curieux
          </p>
        </div>
      </div>
    </footer>
  )
}
