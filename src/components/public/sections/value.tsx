"use client"

import { Banknote, Coins, ChartLine, ShieldCheck } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useTranslation } from "@/i18n/providers"

const FEATURES = [
  { icon: <Banknote className="size-5" />, titleKey: "home.value1", descKey: "home.value1Desc" },
  { icon: <Coins className="size-5" />, titleKey: "home.value2", descKey: "home.value2Desc" },
  { icon: <ChartLine className="size-5" />, titleKey: "home.value3", descKey: "home.value3Desc" },
  { icon: <ShieldCheck className="size-5" />, titleKey: "home.value4", descKey: "home.value4Desc" },
]

export function ValueSection() {
  const { t } = useTranslation()
  return (
    <section className="border-y border-input py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">{t("home.valueTitle")}</h2>
          <p className="text-muted-foreground">{t("home.valueSubtitle")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground mb-3">
                  {feature.icon}
                </div>
                <CardTitle className="text-base">{t(feature.titleKey)}</CardTitle>
              </CardHeader>
              <CardDescription>{t(feature.descKey)}</CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
