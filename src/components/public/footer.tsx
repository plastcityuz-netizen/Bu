"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/i18n/providers"
import { Button } from "@/components/ui/button"

export function PublicFooter() {
  const { t } = useTranslation()
  const currentYear = 2026

  return (
    <footer className="border-t border-input bg-secondary/30">
      <div className="px-4 py-12 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-xs font-bold">B</span>
              </div>
              <span className="font-bold text-lg tracking-tight">BALANS<span className="text-primary"> AI</span></span>
            </div>
            <p className="text-sm text-muted-foreground max-w-[300px]">
              {t("app.tagline")}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">{t("footer.product")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/product">{t("nav.product")}</Link></li>
              <li><Link href="/features">{t("nav.features")}</Link></li>
              <li><Link href="/ai-cfo">{t("nav.aiCfo")}</Link></li>
              <li><Link href="/analytics">{t("nav.analytics")}</Link></li>
              <li><Link href="/pricing">{t("nav.pricing")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">{t("footer.company")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/contact">Biz haqimizda</Link></li>
              <li><Link href="/contact">Blog</Link></li>
              <li><Link href="/contact">Karyera</Link></li>
              <li><Link href="/contact">Bog'lanish</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">{t("footer.legal")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy">{t("footer.privacy")}</Link></li>
              <li><Link href="/terms">{t("footer.terms")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t pt-8">
          <p className="text-sm text-muted-foreground">
            BALANS AI. {currentYear} yil. Barcha huquqlar himoyalangan.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/privacy">{t("footer.privacy")}</Link>
            <Link href="/terms">{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
