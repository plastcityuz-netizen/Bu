"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslation } from "@/i18n/providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const schema = z.object({
  name: z.string().min(1, "Biznes nomi majburiy"),
  type: z.string().optional(),
  taxId: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  currency: z.string().min(1),
  website: z.string().optional().or(z.literal("")),
})

type Business = { id: string; name: string; type: string | null; taxId: string | null; address: string | null; phone: string | null; email: string | null; currency: string; website: string | null }

export default function BusinessProfilePage() {
  const { t } = useTranslation()
  const [business, setBusiness] = React.useState<Business | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [saved, setSaved] = React.useState(false)

  async function load() {
    setLoading(true)
    const res = await fetch("/api/business")
    const data = await res.json()
    setBusiness(data)
    setLoading(false)
  }

  React.useEffect(() => { load() }, [])

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: { name: "", type: "", taxId: "", address: "", phone: "", email: "", currency: "USD", website: "" },
  })

  React.useEffect(() => {
    if (business) {
      form.reset({ name: business.name, type: business.type ?? "", taxId: business.taxId ?? "", address: business.address ?? "", phone: business.phone ?? "", email: business.email ?? "", currency: business.currency, website: business.website ?? "" })
    }
  }, [business, form])

  async function save(values: z.infer<typeof schema>) {
    await fetch("/api/business", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Biznes profili</h1>
        <p className="text-muted-foreground">Biznesingiz haqidagi ma'lumotlarni boshqaring.</p>
      </div>
      {saved && <div className="rounded-lg bg-green-50 border border-green-100 p-4 text-green-800 text-sm">Biznes profili saqlandi.</div>}
      <Card>
        <CardHeader>
          <CardTitle>Biznes ma'lumotlari</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(save)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Biznes nomi</label>
                <Input {...form.register("name")} placeholder="Biznes nomi" disabled={loading} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Biznes turi</label>
                <Input {...form.register("type")} placeholder="Masalan: Do'kon savdo" disabled={loading} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Soliq raqami (INN)</label>
                <Input {...form.register("taxId")} placeholder="123456789" disabled={loading} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Asosiy valyuta</label>
                <Input {...form.register("currency")} placeholder="USD" disabled={loading} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Manzil</label>
                <Input {...form.register("address")} placeholder="Shahar, ko'cha, uy" disabled={loading} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Telefon raqami</label>
                <Input {...form.register("phone")} placeholder="+998 90 123 45 67" disabled={loading} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Elektron poчta</label>
                <Input {...form.register("email")} type="email" placeholder="biznes@example.com" disabled={loading} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Veb-sayt</label>
                <Input {...form.register("website")} placeholder="https://example.com" disabled={loading} />
              </div>
            </div>
            <Separator />
            <Button type="submit" disabled={loading}>{loading ? "Saqlanmoqda..." : "Saqlash"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
