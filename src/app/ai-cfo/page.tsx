import type { Metadata } from "next"
import { PageShell } from "@/components/public/page-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"

export const metadata: Metadata = {
  title: "AI CFO — BALANS AI",
  description: "Intellektual moliyaviy yordamchi, biznes savollaringizga javob beradi.",
}

const QUESTIONS = [
  "Ushbu oy necha pul yechildi?",
  "Qaysi xarajatlar ko'chayib ketgan?",
  "Net foydam necha?",
  "Naqd oqisim qanday?",
  "Eng qimmat kategoriyalar qaysilar?",
  "Ushbu oynani o'tgan oynaga solishtir",
]

export default function AICFOPage() {
  return (
    <PageShell title={metadata.title as string} description={metadata.description as string}>
      <section className="px-4 py-20 lg:px-8 lg:pt-24 lg:pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="text-xs uppercase tracking-wider mb-3">
              Demo rejimida ishlaydi
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">AI moliyaviy rahbaringiz</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Biznes ma'lumotlaringiz bilan suhbatlashing va qulay moliyaviy qarorlar qabul qiling.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {QUESTIONS.map((q, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                    <span className="text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-sm text-foreground">{q}</p>
                </div>
              ))}
            </div>
            <Card className="h-[340px]">
              <CardContent className="p-8 flex flex-col items-center justify-center gap-4 text-center">
                <Bot className="size-24 text-primary" />
                <p className="text-muted-foreground">Savolingizni yozing — AI CFO javob tayyorlaydi</p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-12 flex justify-center">
            <Button asChild>
              <a href="/app/ai-cfo">AI CFO ga kirish</a>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
