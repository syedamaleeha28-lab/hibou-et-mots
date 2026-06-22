import Image from "next/image"
import Link from "next/link"
import { Heart, Mail, Sparkles } from "lucide-react"
import { InstagramIcon, PinterestIcon, XIcon } from "@/components/icons/social-icons"
import { Button } from "@/components/ui/button"
import { footerLegalLinks, footerSiloColumns } from "@/lib/navigation"
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

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_repeat(3,1fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-4 lg:col-span-1">
            <Link href={ROUTES.home} className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-accent">
                <Image
                  src="/mascot-wave.png"
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
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background/80 transition-colors hover:bg-background/20 hover:text-background"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <p className="text-sm font-bold">Reçois 5 nouvelles grilles par semaine</p>
              <form className="flex gap-2" action={ROUTES.contact} aria-label="Inscription à la newsletter">
                <div className="flex flex-1 items-center gap-2 rounded-full bg-background/10 px-4">
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
                  className="rounded-full bg-primary font-extrabold text-primary-foreground hover:bg-primary/90"
                >
                  <Sparkles className="size-4" aria-hidden />
                  OK
                </Button>
              </form>
            </div>
          </div>

          {footerSiloColumns.slice(0, 3).map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h3 className="font-heading text-sm font-extrabold uppercase tracking-wide text-background/60">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-semibold text-background/80 transition-colors hover:text-background"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-1 lg:grid-cols-1">
            {footerSiloColumns.slice(3).map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <h3 className="font-heading text-sm font-extrabold uppercase tracking-wide text-background/60">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm font-semibold text-background/80 transition-colors hover:text-background"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="flex flex-col gap-3">
              <h3 className="font-heading text-sm font-extrabold uppercase tracking-wide text-background/60">
                Contact
              </h3>
              <p className="text-sm font-semibold text-background/80">
                E-mail :{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="transition-colors hover:text-background"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-heading text-sm font-extrabold uppercase tracking-wide text-background/60">
                Légal
              </h3>
              <ul className="flex flex-col gap-2">
                {footerLegalLinks.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-semibold text-background/80 transition-colors hover:text-background"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
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
