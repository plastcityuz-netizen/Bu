"use client"

import * as React from "react"
import { useTranslation } from "@/i18n/providers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard } from "lucide-react"

export default function SubscriptionPage() {
  const { t } = useTranslation()
  const [sub, setSub] = React.useState<{ plan: string; status: string; price: number | null; currency: string } | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch("/api/subscription")
      .then((r) => r.json())
      .then((data: any) => { setSub(data ?? { plan: "start", status: "active", price: null, currency: "USD" }); setLoading(false) })
  }, [])

  const plans: { id: string; name: string; price: string; desc: string }[] = [
    { id: "start", name: "Start", price: "Bepul", desc: "Asosiy dashboard, kirim va xarajat boshqaruvi" },
    { id: "business", name: "Business", price: "{{price}}", desc: "Kengaytirilgan tahlil va batafsil hisobotlar" },
    { id: "premium", name: "Premium", price: "{{price}}", desc: "AI CFO, kengaytirilgan insightlar, premium imkoniyatlar" },
    { id: "enterprise", name: "Enterprise", price: "Individual", desc: "Mos konfiguratsiya, jamoalar boshqaruvi" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Obuna va to'lov</h1>
        <p className="text-muted-foreground">Tarifingizni boshqaring va to'lovlar tarixi.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Joriy tarif</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="h-8 w-48 rounded-full bg-muted animate-pulse" />
          ) : (
            <>
              <div className="flex items-center gap-4">
                <CreditCard className="size-6 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{`${(sub?.plan ?? "").charAt(0).toUpperCase()}${(sub?.plan ?? "").slice(1)}`}</p>
                  <Badge variant={sub?.status === "active" ? "success" : "secondary"}>
                    {sub?.status === "active" ? "Faol" : sub?.status === "canceled" ? "Bekor qilingan" : "Kutilmoqda"}
                  </Badge>
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{sub?.price ?? 0}</span>
                <span className="text-muted-foreground">/ {sub?.currency ?? "USD"}</span>
              </div>
              <p className="text-sm text-muted-foreground">To'lovlar faqat haqiqy backend ulangan so'ng faollashtiriladi.</p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Mavjud tariflar</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plans.map((p) => (
            <Card key={p.id} className="p-4">
              <CardTitle className="text-sm">{p.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{p.price}</p>
              <p className="text-xs text-muted-foreground">{p.desc}</p>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
