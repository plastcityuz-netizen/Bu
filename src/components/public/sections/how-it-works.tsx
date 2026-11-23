"use client"

import { Card } from "@/components/ui/card"
import { useTranslation } from "@/i18n/providers"

const STEPS = [
  { num: "1", key: "home.step1" },
  { num: "2", key: "home.step2" },
  { num: "3", key: "home.step3" },
]

export function HowItWorks() {
  const { t } = useTranslation()
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">{t("home.howItWorksTitle")}</h2>
          <p className="text-muted-foreground">{t("home.howItWorksSubtitle")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <Card key={i} className="p-8 text-center hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mx-auto mb-6 font-bold">
                {step.num}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">{t(step.key)}</h3>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
