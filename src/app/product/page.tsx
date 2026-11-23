import type { Metadata } from "next"
import { PageShell } from "@/components/public/page-shell"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getStaticTranslations, DEFAULT_LANGUAGE } from "@/i18n/server"
import { Layers, Zap, ShieldCheck, TrendingUp } from "lucide-react"

export const metadata: Metadata = {
  title: "Mahsulot — BALANS AI",
  description: "BALANS AI asosiy imkoniyatlari: dashboard, xarajat kuzatishi, AI CFO va tahlil.",
}

const FEATURES = [
  { icon: <Layers className="size-5" />, title: "Moliyaviy dashboard", desc: "Barcha ko'rsatkichlar bir joyda." },
  { icon: <Zap className="size-5" />, title: "Tez operatsiyalar", desc: "Kirim va xarajatlarni bir necha bosqichda qo'shing." },
  { icon: <ShieldCheck className="size-5" />, title: "Xavfsizlik", desc: "Ma'lumotlaringiz shifrlanadi va himoyalangan." },
  { icon: <TrendingUp className="size-5" />, title: "O'sish tahlili", desc: "Daromad va foida dinamikasini kuzating." },
]

export default function ProductPage() {
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Mahsulot</h2>
            <p className="text-muted-foreground">BALANS AI — biznesingiz uchun aqlli moliyaviy operatsion tizim.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground mb-3">
                    {f.icon}
                  </div>
                  <CardTitle className="text-base">{f.title}</CardTitle>
                </CardHeader>
                <CardDescription>{f.desc}</CardDescription>
              </Card>
            ))}
          </div>
          <div className="mt-16 flex justify-center">
            <Button asChild>
              <a href="/pricing">Tariflarni ko'rish</a>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
