"use client"

import * as React from "react"
import Link from "next/link"
import { Search, Bell, User as UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/i18n/providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export function TopNav() {
  const { t, setLanguage } = useTranslation()

  return (
    <div className="flex h-16 items-center justify-between gap-4 px-4 shrink-0">
      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder={t("common.search")}
            className="pl-10 pr-4 h-9 w-full rounded-lg border border-input bg-background text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 px-2">
              <Bell size={18} />
              <span>{t("nav.notifications")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>{t("common.addTransaction") ?? "Yangi operatsiya qo'shildi"}</DropdownMenuItem>
            <DropdownMenuItem>{t("common.created") ?? "Hisobot tayyorlandi"}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t("common.markAllRead") ?? "Barchasini o'qilgan deb belgilash"}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="relative p-2.5 size-9">
              <UserIcon size={18} className="text-muted-foreground" />
              <span className="absolute -right-1 -top-1 flex h-2 w-2 items-center justify-center">
                <span className="h-full w-full rounded-full bg-primary text-[10px] font-bold leading-none px-1.5">
                  3
                </span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex flex-col gap-2 p-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-secondary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">Demo User</p>
                  <p className="text-xs text-muted-foreground truncate">demo@balans.ai</p>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t("nav.profile")}</DropdownMenuItem>
            <DropdownMenuItem>{t("nav.settings")}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="flex items-center gap-2 px-2 py-2">
              <label className="text-xs font-medium text-muted-foreground">{t("settings.language")}</label>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => setLanguage("uz")}>
                  O'zbek
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setLanguage("ru")}>
                  Русский
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
