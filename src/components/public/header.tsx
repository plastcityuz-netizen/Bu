"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/i18n/providers"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"

const NAV_LINKS = [
  { href: "/product", key: "nav.product" },
  { href: "/features", key: "nav.features" },
  { href: "/ai-cfo", key: "nav.aiCfo" },
  { href: "/analytics", key: "nav.analytics" },
  { href: "/pricing", key: "nav.pricing" },
]

export function PublicHeader() {
  const { t, setLanguage } = useTranslation()
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <X className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[260px] p-6 lg:hidden">
          <nav className="space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex gap-2">
            <Button asChild size="sm">
              <a href="/login">{t("nav.login")}</a>
            </Button>
            <Button size="sm" asChild>
              <a href="/register">{t("nav.getStarted")}</a>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <header className="sticky top-0 z-40 border-b border-input bg-background/80 backdrop-blur-lg">
        <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">B</span>
            </div>
            <span className="font-bold text-xl tracking-tight">BALANS<span className="text-primary"> AI</span></span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden lg:flex" onClick={() => setLanguage("uz")}>
              O'zbek
            </Button>
            <Button variant="ghost" size="sm" className="hidden lg:flex" onClick={() => setLanguage("ru")}>
              Русский
            </Button>
            <Button asChild>
              <a href="/login">{t("nav.login")}</a>
            </Button>
            <Button asChild>
              <a href="/register">{t("nav.getStarted")}</a>
            </Button>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}>
              <Menu className="size-5" />
            </Button>
          </div>
        </div>
      </header>
    </>
  )
}
