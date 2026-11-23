"use client"

import * as React from "react"
import { useTranslation } from "@/i18n/providers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { FileText, Download } from "lucide-react"

export default function ReportsPage() {
  const { t } = useTranslation()
  const [range, setRange] = React.useState("30d")
  const [reports, setReports] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then((data: any) => { setReports(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  const REPORT_TYPES = [
    { id: "monthly-summary", name: "Oylik xulosa", icon: <FileText className="size-4" /> },
    { id: "income", name: "Kirim hisoboti", icon: <ActivityIcon className="size-4" /> },
    { id: "expense", name: "Xarajat hisoboti", icon: <CoinsIcon className="size-4" /> },
    { id: "cash-flow", name: "Naqd oqis hisoboti", icon: <ActivityIcon className="size-4" /> },
    { id: "profit-loss", name: "Foyda va zarar hisoboti", icon: <FileText className="size-4" /> },
  ]

  async function generate(type: string) {
    const body: any = { type, title: type, rangeStart: "", rangeEnd: "", data: "{}" }
    const res = await fetch("/api/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    const json = await res.json()
    setReports([json, ...reports])
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Hisobotlar</h1>
          <p className="text-muted-foreground">Moliyaviy hisobotlarni yarating, ko'ring va yuklab oling.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input value={range} onChange={(e) => setRange(e.target.value)} className="w-[130px]" />
          <Button onClick={() => generate(range)}>Hisobot yaratish</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {REPORT_TYPES.map((rt) => (
          <Card key={rt.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => generate(rt.id)}>
            <CardContent className="p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground mb-3">{rt.icon}</div>
              <CardTitle className="text-base">{rt.name}</CardTitle>
              <p className="text-xs text-muted-foreground mt-2">{range === "30d" ? "Oxirgi 30 kun" : range}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-4" />
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Yaratilgan hisobotlar</h2>
        <Button variant="outline" size="sm" onClick={() => setReports([])}>Tozalash</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="text-left pb-3 font-medium">Hisobot turi</th>
                  <th className="text-center pb-3 font-medium">Sana</th>
                  <th className="text-right pb-3 font-medium">Holat</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="text-center py-8"><div className="h-4 w-24 rounded-full bg-muted animate-pulse mx-auto" /></td></tr>
                ) : reports.length === 0 ? (
                  <tr><td colSpan={3} className="text-center text-muted-foreground py-8">Hisobotlar mavjud emas.</td></tr>
                ) : (
                  reports.map((r, i) => (
                    <tr key={i} className="border-b border-input/50 last:border-0">
                      <td className="py-3 text-foreground">{r.title}</td>
                      <td className="py-3 text-center text-sm text-muted-foreground">{new Date().toLocaleDateString()}</td>
                      <td className="py-3 text-right"><Badge variant="success" className="text-xs">Tayyor</Badge></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t px-4 py-3">
            <p className="text-xs text-muted-foreground">CSV yuklab olish faqat haqiqy backend ulangan so'ng mavjud bo'ladi.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ActivityIcon({ className }: { className?: string }) { return <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l3-3L9 13l2 2 6-6"/></svg> }
function CoinsIcon({ className }: { className?: string }) { return <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/></svg> }
