import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"

type MainShellProps = {
  children: React.ReactNode
}

export function MainShell({ children }: MainShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
        {children}
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </div>
  )
}
