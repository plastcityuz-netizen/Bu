"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/i18n/providers"

const ROWS = [
  { labelKey: "analytics.revenueTrend", descKey: "analytics.revenueTrendDesc" },
  { labelKey: "analytics.expenseTrend", descKey: "analytics.expenseTrendDesc" },
  { labelKey: "analytics.categoryBreakdown", descKey: "analytics.categoryBreakdownDesc" },
  { labelKey: "analytics.monthlyComparison", descKey: "analytics.monthlyComparisonDesc" },
]

export function AnalyticsSection() {
  const { t } = useTranslation()
  return (
    <section className="border-y border-input py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="h-[340px] lg:h-auto">
            <Card className="overflow-hidden h-full">
              <CardContent className="p-0">
                <div className="h-full w-full bg-muted rounded-xl flex items-center justify-center p-8">
                  <svg className="w-full h-full" viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M40 260 Q200 80 420 220 T760 60" stroke="var(--primary)" strokeWidth="2" fill="none" />
                    <circle cx="40" cy="260" r="3" fill="var(--primary)" />
                    <circle cx="420" cy="220" r="3" fill="var(--primary)" />
                    <circle cx="760" cy="60" r="3" fill="var(--primary)" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">{t("home.analyticsTitle")}</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{t("home.analyticsSubtitle")}</p>
            <div className="space-y-4">
              {ROWS.map((row, i) => (
                <div key={i} className="flex items-center gap-4 py-2 border-b border-input/50 last:border-0">
                  <span className="text-sm text-muted-foreground w-48">{t(row.labelKey)}</span>
                  <span className="text-sm text-foreground">{t(row.descKey)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
