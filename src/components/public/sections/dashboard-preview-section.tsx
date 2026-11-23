"use client"

import { DashboardPreview } from "@/components/public/dashboard-preview"
import { useTranslation } from "@/i18n/providers"

export function DashboardPreviewSection() {
  const { t } = useTranslation()
  return (
    <section className="border-y border-input py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">{t("home.dashboardPreviewTitle")}</h2>
          <p className="text-muted-foreground">{t("home.dashboardPreviewSubtitle")}</p>
        </div>
        <DashboardPreview />
      </div>
    </section>
  )
}
