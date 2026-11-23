import type { Metadata } from "next"
import { PageShell } from "@/components/public/page-shell"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartLine, TrendingUp, TrendingDown, PieChart } from "lucide-react"

export const metadata: Metadata = {
  title: "Tahlil — BALANS AI",
  description: "Daromad, xarajat, foyda va kategoriyalar bo'yicha chuqur moliyaviy tahlil.",
}

const ITEMS = [
  { icon: <ChartLine className="size-5" />, title: "Daromad tendentsiyasi", desc: "Oyiga daromad o'sishni kuzating." },
  { icon: <PieChart className="size-5" />, title: "Xarajat bo'linishi", desc: "Qaysi kategoriyalarda pul ketadi." },
  { icon: <TrendingUp className="size-5" />, title: "Foyda margin", desc: "Foida darajasini aniqlang." },
  { icon: <TrendingDown className="size-5" />, title: "Naqd oqis", desc: "Kirish-chiqish oqisining holati." },
]

export default function AnalyticsPage() {
  return (
    <PageShell title={metadata.title as string} description={metadata.description as string}>
      <section className="px-4 py-20 lg:px-8 lg:pt-24 lg:pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Aqlli moliyaviy tahlil</h2>
            <p className="text-muted-foreground">Biznes samaradorligingizni chuqur tahlil qiling.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ITEMS.map((f, i) => (
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
              <a href="/register">Tahlilga kirish</a>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
