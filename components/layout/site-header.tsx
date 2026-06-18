"use client"

import { useState } from "react"
import Image from "next/image"
import { Menu, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const links = [
  { label: "Catégories", href: "#categories" },
  { label: "Puzzles", href: "#puzzles" },
  { label: "Niveaux", href: "#niveaux" },
  { label: "PDF à imprimer", href: "#pdf" },
  { label: "Générateur", href: "#generateur" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-accent ring-2 ring-card">
            <Image
              src="/mascot-wave.png"
              alt="Hibou, la mascotte"
              width={40}
              height={40}
              className="h-10 w-10 object-cover"
            />
          </span>
          <span className="font-heading text-xl font-extrabold tracking-tight text-foreground">
            Hibou<span className="text-primary">&Mots</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" className="rounded-full font-bold">
            Se connecter
          </Button>
          <Button className="rounded-full bg-primary font-bold text-primary-foreground hover:bg-primary/90">
            <Sparkles className="size-4" />
            Jouer gratuitement
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground lg:hidden"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border/70 bg-background lg:hidden",
          open ? "max-h-96" : "max-h-0",
          "transition-[max-height] duration-300 ease-in-out",
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-bold text-foreground transition-colors hover:bg-muted"
            >
              {link.label}
            </a>
          ))}
          <Button className="mt-2 rounded-full bg-primary font-bold text-primary-foreground hover:bg-primary/90">
            <Sparkles className="size-4" />
            Jouer gratuitement
          </Button>
        </nav>
      </div>
    </header>
  )
}
