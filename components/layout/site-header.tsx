"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MegaMenu } from "@/components/layout/mega-menu"
import { MobileNavDrawer } from "@/components/layout/mobile-nav-drawer"
import { headerMegaMenus, headerPrimaryLinks } from "@/lib/navigation"
import { ROUTES } from "@/lib/seo"

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href={ROUTES.home} className="flex shrink-0 items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-accent ring-2 ring-card">
              <Image
                src="/mascot-wave.png"
                alt="Hibou, la mascotte de Hibou&Mots"
                width={40}
                height={40}
                className="h-10 w-10 object-cover"
                priority
              />
            </span>
            <span className="font-heading text-xl font-extrabold tracking-tight text-foreground">
              Hibou<span className="text-primary">&Mots</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Navigation principale">
            {headerMegaMenus.map((panel) => (
              <MegaMenu
                key={panel.id}
                panel={panel}
                isOpen={openMenuId === panel.id}
                onOpen={() => setOpenMenuId(panel.id)}
                onClose={() => setOpenMenuId(null)}
              />
            ))}
            {headerPrimaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href={ROUTES.recherche}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Rechercher des mots mêlés"
            >
              <Search className="size-5" />
            </Link>

            <Button
              nativeButton={false}
              className="hidden rounded-full bg-primary font-extrabold text-primary-foreground hover:bg-primary/90 sm:inline-flex"
              render={<Link href={ROUTES.jouer} />}
            >
              <Sparkles className="size-4" />
              Jouer gratuitement
            </Button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-foreground lg:hidden"
              aria-label="Ouvrir le menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileNavDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
