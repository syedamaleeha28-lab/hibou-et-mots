import Image from "next/image"
import { Heart, Mail, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const columns = [
  {
    title: "Jouer",
    links: ["Catégories", "Puzzles populaires", "Niveaux scolaires", "Générateur"],
  },
  {
    title: "Ressources",
    links: ["PDF à imprimer", "Pour les enseignants", "Pour les parents", "Blog"],
  },
  {
    title: "À propos",
    links: ["Notre mission", "Contact", "Aide", "Mentions légales"],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-accent">
                <Image
                  src="/mascot-wave.png"
                  alt="Hibou, la mascotte"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-cover"
                />
              </span>
              <span className="font-heading text-xl font-extrabold">
                Hibou&Mots
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-background/70">
              Des mots mêlés colorés et éducatifs pour apprendre le français en
              s&apos;amusant, à la maison comme à l&apos;école.
            </p>

            <div className="mt-2 flex flex-col gap-2">
              <p className="text-sm font-bold">Reçois 5 nouvelles grilles par semaine</p>
              <form
                className="flex gap-2"
                action="#"
                aria-label="Inscription à la newsletter"
              >
                <div className="flex flex-1 items-center gap-2 rounded-full bg-background/10 px-4">
                  <Mail className="size-4 text-background/60" />
                  <input
                    type="email"
                    required
                    placeholder="ton@email.fr"
                    className="w-full bg-transparent py-2.5 text-sm font-semibold text-background outline-none placeholder:text-background/50"
                  />
                </div>
                <Button
                  type="submit"
                  className="rounded-full bg-primary font-extrabold text-primary-foreground hover:bg-primary/90"
                >
                  <Sparkles className="size-4" />
                  OK
                </Button>
              </form>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h3 className="font-heading text-sm font-extrabold uppercase tracking-wide text-background/60">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm font-semibold text-background/80 transition-colors hover:text-background"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-background/15 pt-6 sm:flex-row">
          <p className="text-sm font-semibold text-background/60">
            © {new Date().getFullYear()} Hibou&Mots. Tous droits réservés.
          </p>
          <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-background/60">
            Fait avec <Heart className="size-4 fill-primary text-primary" /> pour
            les petits curieux
          </p>
        </div>
      </div>
    </footer>
  )
}
