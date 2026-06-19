"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PencilLine, Play, Printer, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { mobileBottomTabs } from "@/lib/navigation"

const iconMap = {
  home: Home,
  print: Printer,
  play: Play,
  create: PencilLine,
  search: Search,
} as const

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(href)
}

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur-md lg:hidden"
      aria-label="Navigation mobile"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1">
        {mobileBottomTabs.map((tab) => {
          const Icon = iconMap[tab.icon]
          const active = isActive(pathname, tab.href)
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                className={cn(
                  "flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 text-[10px] font-extrabold transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="size-5" aria-hidden />
                <span>{tab.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
