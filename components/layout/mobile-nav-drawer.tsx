"use client"

import Link from "next/link"
import { ChevronDown, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  headerMegaMenus,
  headerPrimaryLinks,
  type MegaMenuPanel,
} from "@/lib/navigation"

type MobileNavDrawerProps = {
  open: boolean
  onClose: () => void
}

function AccordionPanel({ panel, onNavigate }: { panel: MegaMenuPanel; onNavigate: () => void }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border-b border-border/70">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-4 text-left font-heading text-base font-extrabold text-foreground"
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
      >
        {panel.label}
        <ChevronDown className={cn("size-5 transition-transform", expanded && "rotate-180")} />
      </button>
      {expanded && (
        <div className="space-y-4 px-4 pb-4">
          {panel.featured?.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-xl bg-primary/10 px-4 py-3 font-bold text-foreground"
              onClick={onNavigate}
            >
              {link.label}
            </Link>
          ))}
          {panel.sections.map((section) => (
            <div key={section.title}>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
                {section.title}
              </p>
              <ul className="flex flex-col gap-1">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
                      onClick={onNavigate}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu principal">
      <button
        type="button"
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        aria-label="Fermer le menu"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="font-heading text-lg font-extrabold">Menu</span>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted"
            aria-label="Fermer"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          {headerMegaMenus.map((panel) => (
            <AccordionPanel key={panel.id} panel={panel} onNavigate={onClose} />
          ))}
          <div className="flex flex-col gap-1 px-4 py-4">
            {headerPrimaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-3 font-heading font-extrabold text-foreground hover:bg-muted"
                onClick={onClose}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
