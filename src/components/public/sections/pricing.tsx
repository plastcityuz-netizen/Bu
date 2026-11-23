"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/i18n/providers"

const PLANS = [
  { name: "pricing.planStart", price: "pricing.priceFree", descKey: "pricing.descStart", featuresKey: "pricing.featuresStart" },
  { name: "pricing.planBusiness", price: "{{price}}", popular: true, descKey: "pricing.descBusiness", featuresKey: "pricing.featuresBusiness" },
  { name: "pricing.planPremium", price: "{{price}}", descKey: "pricing.descPremium", featuresKey: "pricing.featuresPremium" },
]

export function PricingSection() {
  const { t } = useTranslation()
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">{t("home.pricingTitle")}</h2>
          <p className="text-muted-foreground">{t("home.pricingSubtitle")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLANS.map((plan, i) => (
            <Card key={i} className={`relative p-8 flex flex-col ${plan.popular ? "ring-1 ring-primary" : ""}`}>
              {plan.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">{t("pricing.popular")}</Badge>}
              <h3 className="text-lg font-semibold text-foreground">{t(plan.name)}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t(plan.descKey)}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-2xl font-bold text-foreground">{t(plan.price)}</span>
                <span className="text-sm text-muted-foreground">/ {t("pricing.perMonth")}</span>
              </div>
              <ul className="space-y-2 mb-8 flex-1">
                {t(plan.featuresKey).split("•").map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="size-4 shrink-0 text-success">✓</span> {f.trim()}
                  </li>
                ))}
              </ul>
              <Button className="w-full">{plan.popular ? t("pricing.choose") : t("pricing.learnMore")}</Button>
            </Card>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-8">
          {t("home.pricingFooter")} <Link href="/pricing" className="text-primary hover:underline">{t("home.pricingFooterLink")}</Link>.
        </p>
      </div>
    </section>
  )
}
