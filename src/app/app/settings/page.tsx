"use client"

import * as React from "react"
import { useTranslation } from "@/i18n/providers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const { t, language, setLanguage } = useTranslation()
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">("system")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Sozlamalar</h1>
        <p className="text-muted-foreground">Hisob sozlamalarini boshqaring.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Umumiy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Til</p>
              <p className="text-xs text-muted-foreground">Interfeys tilini tanlang</p>
            </div>
            <div className="flex gap-1">
              <Button variant={language === "uz" ? "default" : "outline"} size="sm" onClick={() => setLanguage("uz")}>O'zbekcha</Button>
              <Button variant={language === "ru" ? "default" : "outline"} size="sm" onClick={() => setLanguage("ru")}>Русский</Button>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Mavzu (kiranchi)</p>
              <p className="text-xs text-muted-foreground">Yorug', qorong'u yoki tizim sozlamalari</p>
            </div>
            <div className="flex gap-2">
              <Button variant={theme === "light" ? "default" : "outline"} size="sm" onClick={() => setTheme("light")}>Yorug'</Button>
              <Button variant={theme === "dark" ? "default" : "outline"} size="sm" onClick={() => setTheme("dark")}>Qorong'u</Button>
              <Button variant={theme === "system" ? "default" : "outline"} size="sm" onClick={() => setTheme("system")}>Tizim</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bildirishnomalar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Elektron poчta bildirishnomaları</p>
              <p className="text-xs text-muted-foreground">Hisobingizdagi o'zgarishlar haqida xabarlar</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Push bildirishnomaları</p>
              <p className="text-xs text-muted-foreground">Mobil qurilmalarda bildirishnomalar</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Xavfsizlik</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Ikki bosqichli tasdiqlash</p>
              <p className="text-xs text-muted-foreground">Qo'shimcha xavfsiyot qatlami</p>
            </div>
            <Switch defaultChecked={false} />
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground">
        Parolni o'zgartirish va akkauntni o'chirish sozlamalari keyingi versiya qo'shiladi.
      </div>
    </div>
  )
}
