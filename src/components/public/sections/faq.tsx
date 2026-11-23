"use client"

import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from "@/components/ui/accordion"
import { useTranslation } from "@/i18n/providers"

const FAQS = [
  { qKey: "faq.q1", aKey: "faq.a1" },
  { qKey: "faq.q2", aKey: "faq.a2" },
  { qKey: "faq.q3", aKey: "faq.a3" },
  { qKey: "faq.q4", aKey: "faq.a4" },
  { qKey: "faq.q5", aKey: "faq.a5" },
  { qKey: "faq.q6", aKey: "faq.a6" },
]

export function FAQSection() {
  const { t } = useTranslation()
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">{t("home.faqTitle")}</h2>
          <p className="text-muted-foreground">{t("home.faqSubtitle")}</p>
        </div>
        <Accordion type="single" collapsible className="space-y-2">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-sm font-medium">{t(faq.qKey)}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{t(faq.aKey)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
