import type { Metadata } from "next"
import { PageShell } from "@/components/public/page-shell"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Banknote, Coins, ChartLine, PieChart, FileText, Bot } from "lucide-react"

export const metadata: Metadata = {
  title: "Imkoniyatlar — BALANS AI",
  description: "Daromad, xarajat, naqd oqis, tahlil, hisobotlar va AI CFO imkoniyatlari.",
}

const FEATURES = [
  { icon: <Banknote className="size-5" />, title: "Kirimlar boshqaruvi", desc: "Barcha daromad manbalarini kuzatib borish." },
  { icon: <Coins className="size-5" />, title: "Xarajatlar boshqaruvi", desc: "Xarajatlarni kategoriyalar bo'yicha ajratib ko'rish." },
  { icon: <ChartLine className="size-5" />, title: "Naqd oqis", desc: "Kirish-chiqish oqisini real vaqtda kuzatish." },
  { icon: <PieChart className="size-5" />, title: "Kategoriya tahlili", desc: "Eng qimmat kategoriyalarni aniqlash." },
  { icon: <FileText className="size-5" />, title: "Hisobotlar", desc: "Oylik, yilalik va maxsus hisobotlarni yaratish." },
  { icon: <Bot className="size-5" />, title: "AI CFO", desc: "Moliyaviy savollarga aqlli javoblar olish." },
]

export default function FeaturesPage() {
  return (
    <PageShell title={metadata.title as string} description={metadata.description as string}>
      <section className="px-4 py-20 lg:px-8 lg:pt-24 lg:pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Asosiy imkoniyatlar</h2>
            <p className="text-muted-foreground">Barchasi bir joyda — moliyaviy boshqaruvning to'liq majmuasi.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
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
              <a href="/register">Bepul sinab ko'rish</a>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
