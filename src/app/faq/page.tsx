import type { Metadata } from "next"
import { PageShell } from "@/components/public/page-shell"
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from "@/components/ui/accordion"
import uz from "@/i18n/locales/uz"
import ru from "@/i18n/locales/ru"
import { getStaticTranslations, DEFAULT_LANGUAGE } from "@/i18n/server"

export const metadata: Metadata = {
  title: "Savollar va javoblar — BALANS AI",
  description: "BALANS AI haqida tez-tez so'raladigan savollar.",
}

type FaqItem = { q: string; a: string }

const FAQ_LOCALES: Record<string, FaqItem[]> = {
  uz: uz.faq.items as unknown as FaqItem[],
  ru: ru.faq.items as unknown as FaqItem[],
}

export default function FAQPage() {
  const dict = getStaticTranslations(DEFAULT_LANGUAGE)
  const t = (key: string): string => {
    const parts = key.split(".")
    let current: unknown = dict
    for (const part of parts) {
      if (!current || typeof current !== "object" || !(part in current)) return key
      current = (current as Record<string, unknown>)[part]
    }
    return typeof current === "string" ? current : key
  }

  const items = FAQ_LOCALES[DEFAULT_LANGUAGE]

  return (
    <PageShell title={metadata.title as string} description={metadata.description as string}>
      <section className="px-4 py-20 lg:px-8 lg:pt-24 lg:pb-32">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">{t("faq.title")}</h2>
            <p className="text-muted-foreground">{t("faq.subtitle")}</p>
          </div>
          <Accordion type="multiple" className="space-y-2">
            {items.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm font-medium">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </PageShell>
  )
}
