import type { Metadata } from "next"
import { getStaticTranslations, DEFAULT_LANGUAGE } from "@/i18n/server"
import { PublicHeader } from "@/components/public/header"
import { PublicFooter } from "@/components/public/footer"
import { Hero } from "@/components/public/sections/hero"
import { ValueSection } from "@/components/public/sections/value"
import { FinancialOverview } from "@/components/public/sections/financial-overview"
import { AICFOSection } from "@/components/public/sections/ai-cfo"
import { ModulesSection } from "@/components/public/sections/modules"
import { AnalyticsSection } from "@/components/public/sections/analytics"
import { HowItWorks } from "@/components/public/sections/how-it-works"
import { DashboardPreviewSection } from "@/components/public/sections/dashboard-preview-section"
import { PricingSection } from "@/components/public/sections/pricing"
import { FAQSection } from "@/components/public/sections/faq"
import { FinalCTA } from "@/components/public/sections/final-cta"

export const metadata: Metadata = {
  title: "BALANS AI — Biznes moliyangiz, hamma da nazoratda",
  description: "Daromad, xarajatlar, naqd oqis va biznes samaradorligi — bitta aqlli ish joyida. BALANS AI bilan qulay qarorlar qabul qiling.",
}

export default function Home() {
  const dict = getStaticTranslations(DEFAULT_LANGUAGE)
  const t = (key: string, params?: Record<string, string | number>) => {
    const parts = key.split(".")
    let current: unknown = dict
    for (const part of parts) {
      if (!current || typeof current !== "object" || !(part in current)) return key
      current = (current as Record<string, unknown>)[part]
    }
    if (typeof current !== "string") return key
    return current.replace(/\{\{(\w+)\}}/g, (_m, name) => String(params?.[name] ?? `{{${name}}}`))
  }

  return (
    <div className="relative overflow-hidden bg-background">
      <PublicHeader />
      <Hero />
      <ValueSection />
      <FinancialOverview />
      <AICFOSection />
      <ModulesSection />
      <AnalyticsSection />
      <HowItWorks />
      <DashboardPreviewSection />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
      <PublicFooter />
    </div>
  )
}
