import Link from "next/link"
import type { ReactElement } from "react"
import { ROUTES } from "@/lib/seo/routes"

type GameTile = {
  label: string
  href: string
  bg: string
  icon: ReactElement
}

/** Small flat SVG icons, single-color strokes, sized for a colored tile background. */
function WordSearchIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-9 w-9" aria-hidden="true">
      <rect x="6" y="6" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="2.5" />
      <path d="M13 13h6M13 18h9M13 23h4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="27" cy="27" r="5.5" stroke="currentColor" strokeWidth="2.5" />
      <path d="M31 31l4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function CalendarStarIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-9 w-9" aria-hidden="true">
      <rect x="7" y="9" width="26" height="24" rx="3" stroke="currentColor" strokeWidth="2.5" />
      <path d="M7 16h26" stroke="currentColor" strokeWidth="2.5" />
      <path d="M13 6v6M27 6v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M20 20l1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z"
        fill="currentColor"
      />
    </svg>
  )
}

function PencilGridIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-9 w-9" aria-hidden="true">
      <rect x="6" y="6" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth="2.5" />
      <path d="M6 14h16M14 6v16" stroke="currentColor" strokeWidth="2" />
      <path
        d="M24 33l1.3-5.4 8-8a2 2 0 0 1 2.8 2.8l-8 8L23 33z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PrinterIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-9 w-9" aria-hidden="true">
      <rect x="9" y="14" width="22" height="14" rx="2.5" stroke="currentColor" strokeWidth="2.5" />
      <path d="M13 14V8h14v6" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="13" y="23" width="14" height="10" stroke="currentColor" strokeWidth="2.5" />
      <path d="M14 18h2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-9 w-9" aria-hidden="true">
      <path
        d="M8 8h13l11 11-13 13L8 21z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="15" cy="15" r="2.4" fill="currentColor" />
    </svg>
  )
}

function GraduationCapIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-9 w-9" aria-hidden="true">
      <path d="M20 9 5 16l15 7 15-7z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M12 20v7c0 2 4 4.5 8 4.5s8-2.5 8-4.5v-7" stroke="currentColor" strokeWidth="2.5" />
      <path d="M35 16v9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

const GAME_TILES: GameTile[] = [
  {
    label: "Jouer en ligne",
    href: ROUTES.jouer,
    bg: "bg-primary text-primary-foreground",
    icon: <WordSearchIcon />,
  },
  {
    label: "Mot du jour",
    href: "/mot-du-jour/",
    bg: "bg-sunny text-sunny-foreground",
    icon: <CalendarStarIcon />,
  },
  {
    label: "Créer ma grille",
    href: ROUTES.generateur,
    bg: "bg-secondary text-secondary-foreground",
    icon: <PencilGridIcon />,
  },
  {
    label: "À imprimer",
    href: ROUTES.imprimer,
    bg: "bg-accent text-accent-foreground",
    icon: <PrinterIcon />,
  },
  {
    label: "Par thème",
    href: ROUTES.thematiquesHub,
    bg: "bg-leaf text-leaf-foreground",
    icon: <TagIcon />,
  },
  {
    label: "Par niveau scolaire",
    href: ROUTES.ecoleHub,
    bg: "bg-destructive text-white",
    icon: <GraduationCapIcon />,
  },
]

export function AllGamesGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
        Tous les jeux
      </h2>
      <p className="mt-1 text-sm font-semibold text-muted-foreground sm:text-base">
        Choisis un mode de jeu et commence tout de suite — gratuit, sans inscription.
      </p>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {GAME_TILES.map((tile) => (
          <li key={tile.href}>
            <Link
              href={tile.href}
              className="group flex flex-col items-center gap-3 rounded-2xl p-1 text-center transition-transform hover:-translate-y-0.5"
            >
              <span
                className={`flex aspect-square w-full items-center justify-center rounded-2xl shadow-sm transition-shadow group-hover:shadow-md ${tile.bg}`}
              >
                {tile.icon}
              </span>
              <span className="text-sm font-extrabold text-foreground sm:text-base">
                {tile.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
