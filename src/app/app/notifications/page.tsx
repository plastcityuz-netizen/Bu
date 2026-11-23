"use client"

import * as React from "react"
import { useTranslation } from "@/i18n/providers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function NotificationsPage() {
  const { t } = useTranslation()
  const [notifications, setNotifications] = React.useState<{ id: string; title: string; body: string | null; read: boolean; createdAt: string }[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data: any) => { setNotifications(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  async function markRead(id: string) {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    setNotifications((list) => list.map((n) => n.id === id ? { ...n, read: true } : n))
  }

  async function markAllRead() {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) })
    setNotifications((list) => list.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Bildirishnomalar</h1>
          <p className="text-muted-foreground">Bildirishnomalarni boshqaring va sozlang.</p>
        </div>
        <Button onClick={markAllRead} size="sm" disabled={notifications.every((n) => n.read)}>Barchasini o'qilgan deb belgilash</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Yangiliklar</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-8 w-48 rounded-full bg-muted animate-pulse" />
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Yangilanishlar yo'q.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="flex items-start gap-3 p-3 border-b hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => markRead(n.id)}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-medium">{n.read ? "✓" : "•"}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.body ?? ""}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
