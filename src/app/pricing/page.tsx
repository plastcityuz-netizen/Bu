import type { Metadata } from "next"
import { PageShell } from "@/components/public/page-shell"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import uz from "@/i18n/locales/uz"
import ru from "@/i18n/locales/ru"
import { getStaticTranslations, DEFAULT_LANGUAGE } from "@/i18n/server"

export const metadata: Metadata = {
  title: "Tariflar — BALANS AI",
  description: "Shaffof va moslashuvchan tariflar. To'lovlar faqat haqiqy backend bilan faollashtiriladi.",
}

type Plan = {
  name: string
  description: string
  price: string
  period: string
  popular?: boolean
  features: string[]
  limits: string[]
}

const PLAN_LOCALES: Record<string, Plan[]> = {
  uz: uz.pricing.plans as unknown as Plan[],
  ru: ru.pricing.plans as unknown as Plan[],
}

export default function PricingPage() {
  const dict = getStaticTranslations(DEFAULT_LANGUAGE)
  const t = (key: string, params?: Record<string, string | number>): string => {
    const parts = key.split(".")
    let current: unknown = dict
    for (const part of parts) {
      if (!current || typeof current !== "object" || !(part in current)) return key
      current = (current as Record<string, unknown>)[part]
    }
    if (typeof current !== "string") return key
    return current.replace(/\{\{(\w+)\}\}/g, (_m, name) => String(params?.[name] ?? `{{${name}}}`))
  }

  const plans = PLAN_LOCALES[DEFAULT_LANGUAGE]

  return (
    <PageShell title={metadata.title as string} description={metadata.description as string}>
      <section className="px-4 py-20 lg:px-8 lg:pt-24 lg:pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">{t("pricing.title")}</h2>
            <p className="text-muted-foreground">{t("pricing.subtitle")}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {t("pricing.disclaimer")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <Card key={i} className={`p-8 flex flex-col ${plan.popular ? "ring-1 ring-primary" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    {t("pricing.popular")}
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="size-4 shrink-0 text-success">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    {plan.limits.map((l, j) => (
                      <div key={j}>{l}</div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    {plan.popular ? t("pricing.choose") : t("pricing.learnMore")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center text-xs text-muted-foreground">
            {t("pricing.register")} <a href="/register" className="text-primary hover:underline">
              {t("pricing.registerLink")}
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
