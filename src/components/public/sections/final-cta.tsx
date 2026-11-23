"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/i18n/providers"

export function FinalCTA() {
  const { t } = useTranslation()
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        <Card className="p-10 lg:p-16 rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">{t("home.finalCtaTitle")}</h2>
            <p className="text-lg text-muted-foreground mb-8">{t("home.finalCtaSubtitle")}</p>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href="/register">{t("home.finalCtaButton")}</a>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
