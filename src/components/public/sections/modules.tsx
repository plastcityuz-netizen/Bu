"use client"

import { Layers, Banknote, Bot, ChartLine, FileText, CreditCard } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useTranslation } from "@/i18n/providers"

const MODULES = [
  { icon: <Layers className="size-5" />, titleKey: "home.moduleDashboard", descKey: "home.moduleDashboardDesc" },
  { icon: <Banknote className="size-5" />, titleKey: "home.moduleTransactions", descKey: "home.moduleTransactionsDesc" },
  { icon: <Bot className="size-5" />, titleKey: "home.moduleAICFO", descKey: "home.moduleAICFODesc" },
  { icon: <ChartLine className="size-5" />, titleKey: "home.moduleAnalytics", descKey: "home.moduleAnalyticsDesc" },
  { icon: <FileText className="size-5" />, titleKey: "home.moduleReports", descKey: "home.moduleReportsDesc" },
  { icon: <CreditCard className="size-5" />, titleKey: "home.moduleBilling", descKey: "home.moduleBillingDesc" },
]

export function ModulesSection() {
  const { t } = useTranslation()
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">{t("home.modulesTitle")}</h2>
          <p className="text-muted-foreground">{t("home.modulesSubtitle")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {MODULES.map((module, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow group">
              <CardHeader className="pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-foreground mb-3 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  {module.icon}
                </div>
                <CardTitle className="text-base">{t(module.titleKey)}</CardTitle>
              </CardHeader>
              <CardDescription>{t(module.descKey)}</CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
