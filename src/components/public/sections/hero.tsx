"use client"

import Link from "next/link"
import { DashboardPreview } from "@/components/public/dashboard-preview"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/i18n/providers"

export function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative px-4 pt-20 pb-24 lg:px-8 lg:pt-32 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_120%_at_top_left,rgba(67,56,202,0.06),transparent_60%)] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          <div className="space-y-6">
            <Badge variant="outline" className="text-xs uppercase tracking-wider">
              Demo ma'lumotlar bilan platforma namoyoni
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance text-foreground">
              {t("home.heroTitle")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
              {t("home.heroSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a href="/register">{t("home.startFree")}</a>
              </Button>
              <Button variant="outline" asChild size="lg" className="w-full sm:w-auto">
                <a href="/product">{t("home.explorePlatform")}</a>
              </Button>
            </div>
          </div>
          <div className="mt-12 lg:mt-0">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  )
}
