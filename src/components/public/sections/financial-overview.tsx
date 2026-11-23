"use client"

import { TrendingUp, Banknote, Coins, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/i18n/providers"

const ROWS = [
  { icon: <TrendingUp className="size-5 text-success" />, labelKey: "home.overviewRevenue", descKey: "home.overviewRevenueDesc" },
  { icon: <Banknote className="size-5 text-muted-foreground" />, labelKey: "home.overviewExpenses", descKey: "home.overviewExpensesDesc" },
  { icon: <Coins className="size-5 text-success" />, labelKey: "home.overviewProfit", descKey: "home.overviewProfitDesc" },
  { icon: <Zap className="size-5 text-muted-foreground" />, labelKey: "home.overviewCashflow", descKey: "home.overviewCashflowDesc" },
]

export function FinancialOverview() {
  const { t } = useTranslation()
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">{t("home.overviewTitle")}</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{t("home.overviewSubtitle")}</p>
            <div className="space-y-4">
              {ROWS.map((row, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground">
                    {row.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t(row.labelKey)}</p>
                    <p className="text-xs text-muted-foreground">{t(row.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[320px]">
            <Card className="overflow-hidden h-full">
              <CardContent className="p-0">
                <div className="h-full w-full bg-accent rounded-xl flex items-center justify-center p-8">
                  <svg className="size-32 text-accent-foreground opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.473" />
                    <path d="M16 3.13a4 4 0 010 7.75" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
