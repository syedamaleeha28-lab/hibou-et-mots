"use client"

import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MegaMenuPanel } from "@/lib/navigation"

type MegaMenuProps = {
  panel: MegaMenuPanel
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export function MegaMenu({ panel, isOpen, onOpen, onClose }: MegaMenuProps) {
  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onFocus={onOpen}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) onClose()
      }}
    >
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-bold transition-colors",
          isOpen
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => (isOpen ? onClose() : onOpen())}
      >
        {panel.label}
        <ChevronDown
          className={cn("size-4 transition-transform", isOpen && "rotate-180")}
          aria-hidden
        />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-full z-50 mt-2 min-w-[min(100vw-2rem,720px)] rounded-2xl border border-border bg-card p-5 shadow-xl"
          role="menu"
        >
          {panel.featured && panel.featured.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2 border-b border-border pb-4">
              {panel.featured.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl bg-primary/10 px-4 py-2 transition-colors hover:bg-primary/15"
                  role="menuitem"
                  onClick={onClose}
                >
                  <span className="block font-heading text-sm font-extrabold text-foreground">
                    {link.label}
                  </span>
                  {link.description && (
                    <span className="text-xs font-semibold text-muted-foreground">
                      {link.description}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {panel.sections.map((section) => (
              <div key={section.title}>
                <p className="mb-2 font-heading text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
                  {section.title}
                </p>
                <ul className="flex flex-col gap-1">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block rounded-lg px-2 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                        role="menuitem"
                        onClick={onClose}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
