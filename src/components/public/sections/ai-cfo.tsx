"use client"

import { Bot } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/i18n/providers"

export function AICFOSection() {
  const { t } = useTranslation()
  const questions = (t("home.aiQuestions") || "").split("•").filter(Boolean)

  return (
    <section className="border-y border-input py-20 lg:py-28 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">{t("home.aiCfoTitle")}</h2>
          <p className="text-muted-foreground">{t("home.aiCfoSubtitle")}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {questions.map((q, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                  <span className="text-xs font-bold">{i + 1}</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{q.trim()}</p>
              </div>
            ))}
          </div>
          <div className="hidden lg:block">
            <Card className="h-[300px]">
              <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
                <Bot className="size-16 text-primary" />
                <p className="text-center text-muted-foreground">Savolingizni yozing — AI CFO javob beradi</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
