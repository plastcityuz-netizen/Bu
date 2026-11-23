"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Activity,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  FileText,
  FolderKanban,
  Building2,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  CreditCard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/i18n/providers"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

interface NavItemProps {
  href: string
  label: string
  icon: React.ReactNode
}

function NavItem({ href, label, icon }: NavItemProps) {
  const pathname = usePathname()
  const active = pathname === href
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

const NAV_ITEMS: { href: string; labelKey: string; icon: React.ReactNode }[] = [
  { href: "/app/dashboard", labelKey: "nav.dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/app/transactions", labelKey: "nav.transactions", icon: <Activity size={18} /> },
  { href: "/app/income", labelKey: "nav.income", icon: <TrendingUp size={18} /> },
  { href: "/app/expenses", labelKey: "nav.expenses", icon: <TrendingDown size={18} /> },
  { href: "/app/cash-flow", labelKey: "nav.cashFlow", icon: <PieChart size={18} /> },
  { href: "/app/analytics", labelKey: "nav.analytics", icon: <BarChart3 size={18} /> },
  { href: "/app/reports", labelKey: "nav.reports", icon: <FileText size={18} /> },
  { href: "/app/categories", labelKey: "nav.categories", icon: <FolderKanban size={18} /> },
]

const PROFILE_ITEMS: { href: string; labelKey: string; icon: React.ReactNode }[] = [
  { href: "/app/business-profile", labelKey: "nav.businessProfile", icon: <Building2 size={18} /> },
  { href: "/app/notifications", labelKey: "nav.notifications", icon: <Bell size={18} /> },
  { href: "/app/subscription", labelKey: "nav.subscription", icon: <CreditCard size={18} /> },
  { href: "/app/settings", labelKey: "nav.settings", icon: <Settings size={18} /> },
  { href: "/app/profile", labelKey: "nav.profile", icon: <User size={18} /> },
]

export function Sidebar() {
  const { t, setLanguage } = useTranslation()
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden ml-2">
            <Menu className="size-5" aria-label="Menu" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[280px] lg:hidden p-0">
          <SheetHeader className="px-6 pb-6">
            <SheetTitle className="text-xl font-semibold tracking-tight">BALANS AI</SheetTitle>
          </SheetHeader>
          <Separator className="mx-6 my-4" />
          <nav className="space-y-1 px-3">
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.href} href={item.href} label={t(item.labelKey)} icon={item.icon} />
            ))}
            <Separator className="mx-4 my-3" />
            {PROFILE_ITEMS.map((item) => (
              <NavItem key={item.href} href={item.href} label={t(item.labelKey)} icon={item.icon} />
            ))}
          </nav>
          <div className="p-6 border-t border-input">
            <div className="flex items-center gap-3 mb-4">
              <label className="text-xs font-medium text-muted-foreground">Til</label>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setLanguage("uz")}>
                  UZ
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setLanguage("ru")}>
                  RU
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <nav className="hidden lg:flex flex-col w-64 border-r border-input shrink-0">
        <div className="flex h-16 items-center gap-2 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">B</span>
          </div>
          <span className="font-bold text-xl tracking-tight">BALANS<span className="text-primary"> AI</span></span>
        </div>
        <div className="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.href} href={item.href} label={t(item.labelKey)} icon={item.icon} />
          ))}
        </div>
        <Separator className="mx-4 my-3" />
        <div className="space-y-1 px-3">
          {PROFILE_ITEMS.map((item) => (
            <NavItem key={item.href} href={item.href} label={t(item.labelKey)} icon={item.icon} />
          ))}
        </div>
      </nav>
      <div className="hidden lg:flex flex-col w-64 shrink-0">
        <div className="pt-6 px-6 border-t border-input">
          <div className="flex items-center gap-2 mb-4">
            <span className="relative h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-foreground">Online</span>
          </div>
          <div className="flex items-center gap-2">
            <img className="h-8 w-8 rounded-full border border-input" src="/placeholder-avatar.svg" alt="" />
            <div>
              <div className="text-sm font-medium text-foreground">Demo User</div>
              <div className="text-xs text-muted-foreground">demo@balans.ai</div>
            </div>
          </div>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {PROFILE_ITEMS.map((item) => (
            <NavItem key={item.href} href={item.href} label={t(item.labelKey)} icon={item.icon} />
          ))}
        </nav>
        <div className="mt-auto px-6 pb-8">
          <Button variant="ghost" className="w-full text-destructive" onClick={() => {}}>
            Chiqish
          </Button>
        </div>
      </div>
    </>
  )
}
