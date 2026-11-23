"use client"

import * as React from "react"
import { useTranslation } from "@/i18n/providers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Activity, TrendingUp, TrendingDown } from "lucide-react"

const COLORS = ["#4338ca", "#06b6d4", "#818cf8", "#a78bfa", "#059669"]

export default function AnalyticsPage() {
  const { t } = useTranslation()
  const [range, setRange] = React.useState("30d")
  const [data, setData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch(`/api/analytics?range=${range}&businessId=${localStorage.getItem("balans-business-id") ?? ""}`)
      .then((r) => r.json())
      .then((json: any) => { setData(json); setLoading(false) })
  }, [range])

  if (loading) return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight text-foreground">Moliyaviy tahlil</h1></div>
      <div className="grid md:grid-cols-3 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}><CardContent className="h-24"><div className="h-full w-full rounded-lg bg-muted animate-pulse" /></CardContent></Card>
        ))}
      </div>
    </div>
  )

  const monthly: { name: string; revenue: number; expense: number }[] = [
    { name: "Yan", revenue: 4200, expense: 3100 },
    { name: "Fev", revenue: 3800, expense: 2900 },
    { name: "Mar", revenue: 4500, expense: 3400 },
    { name: "Aprel", revenue: 4900, expense: 3600 },
    { name: "May", revenue: 5200, expense: 4100 },
    { name: "Iyun", revenue: 5800, expense: 4400 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Moliyaviy tahlil</h1>
          <p className="text-muted-foreground">Biznes samaradorligini chuqur tahlil qiling.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-[110px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 kun</SelectItem>
              <SelectItem value="30d">30 kun</SelectItem>
              <SelectItem value="90d">90 kun</SelectItem>
              <SelectItem value="12m">12 oy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Daromad" value={formatCurrency(data?.revenue ?? 0, { currency: "USD" })} change="+12%" positive icon={<TrendingUp className="size-5 text-success" />} />
        <StatCard title="Xarajatlar" value={formatCurrency(data?.expenses ?? 0, { currency: "USD" })} change="-4%" icon={<Activity className="size-5" />} />
        <StatCard title="Net foyda" value={formatCurrency((data?.revenue ?? 0) - (data?.expenses ?? 0), { currency: "USD" })} change={((data?.revenue ?? 0) >= (data?.expenses ?? 0) ? "+" : "") + "8%"} positive icon={<TrendingUp className="size-5 text-success" />} />
        <StatCard title="Foyda margin" value={((data?.revenue ?? 0) > 0 ? Math.round(((data?.revenue ?? 0) - (data?.expenses ?? 0)) / (data?.revenue ?? 1) * 100) : 0) + "%"} change="Yoq" icon={<Activity className="size-5" />} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Daromad va xarajatlar dinamikasi</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
                <CartesianGrid vertical={false} className="stroke-[var(--border)]" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis hide tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#4338ca" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="expense" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Xarajat bo'linishi</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.categoryBreakdown ?? monthly.map((m, i) => ({ name: `Kategoriya ${i + 1}`, value: Math.round(m.expense / 5) }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  fill="#8884d8"
                  label
                >
                  {data?.categoryBreakdown?.slice(0, 5).map((entry: any, i: number) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Eng katta xarajatlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left text-muted-foreground font-medium pb-3">Kategoriya</th>
                  <th className="text-right text-muted-foreground font-medium pb-3">Summa</th>
                </tr>
              </thead>
              <tbody>
                {(data?.categoryBreakdown ?? []).slice(0, 6).map((entry: any, i: number) => (
                  <tr key={i} className="border-b border-input/50 last:border-0">
                    <td className="py-3 text-foreground">{entry.name}</td>
                    <td className="py-3 text-right text-foreground">{formatCurrency(entry.value, { currency: "USD" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ title, value, change, positive, icon }: { title: string; value: string; change: string; positive?: boolean; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">{value}</span>
            </div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">{icon}</div>
        </div>
        <div className="flex items-baseline mt-2">
          <span className={`text-xs font-semibold ${positive ? "text-success" : "text-muted-foreground"}`}>{change}</span>
        </div>
      </CardContent>
    </Card>
  )
}
