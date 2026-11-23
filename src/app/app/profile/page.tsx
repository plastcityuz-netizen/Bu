"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslation } from "@/i18n/providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const schema = z.object({
  fullName: z.string().min(2, "Ism kamida 2 belgi bo'lishi kerak"),
  email: z.string().email("Noto'g'ri elektron poчta manzili"),
})

export default function ProfilePage() {
  const { t } = useTranslation()
  const [saved, setSaved] = React.useState(false)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "Demo Foydalanuvchi", email: "demo@balans.ai" },
  })

  async function save(values: z.infer<typeof schema>) {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Foydalanuvchi profili</h1>
        <p className="text-muted-foreground">Shaxsiy ma'lumotlaringizni boshqaring.</p>
      </div>
      {saved && <div className="rounded-lg bg-green-50 border border-green-100 p-4 text-green-800 text-sm">Profil saqlandi.</div>}
      <Card className="w-full w-[460px]">
        <CardHeader>
          <CardTitle>Profil ma'lumotlari</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(save)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Ism familiya</label>
              <Input {...form.register("fullName")} placeholder="Ismingizni kiriting" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Elektron poчta</label>
              <Input {...form.register("email")} type="email" placeholder="name@company.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Rasm (avatar)</label>
              <Input type="file" accept="image/*" className="block w-full text-sm text-muted-foreground" />
            </div>
            <Button type="submit">Saqlash</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
