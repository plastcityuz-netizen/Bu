import type { Metadata } from "next"
import { PageShell } from "@/components/public/page-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getStaticTranslations, DEFAULT_LANGUAGE } from "@/i18n/server"

export const metadata: Metadata = {
  title: "Bog'lanish — BALANS AI",
  description: "BALANS AI jamoasi bilan bog'laning.",
}

export default function ContactPage() {
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

  return (
    <PageShell title={metadata.title as string} description={metadata.description as string}>
      <section className="px-4 py-20 lg:px-8 lg:pt-24 lg:pb-32">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">{t("contact.title")}</h2>
            <p className="text-muted-foreground">{t("contact.subtitle")}</p>
          </div>
          <Card>
            <CardContent className="p-8">
              <p className="text-sm text-muted-foreground">{t("contact.note")}</p>
              <div className="mt-6 flex justify-center">
                <Button asChild>
                  <a href="/">{t("contact.back")}</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageShell>
  )
}
