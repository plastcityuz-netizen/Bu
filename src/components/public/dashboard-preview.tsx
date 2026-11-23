"use client"

import * as React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/i18n/providers"
import { TrendingUp, Activity, CreditCard } from "lucide-react"

const revenueData = [
  { month: "Yan", revenue: 4200, expenses: 3100 },
  { month: "Fev", revenue: 3800, expenses: 2900 },
  { month: "Mar", revenue: 4500, expenses: 3400 },
  { month: "Aprel", revenue: 4900, expenses: 3600 },
  { month: "May", revenue: 5200, expenses: 4100 },
  { month: "Iyun", revenue: 5800, expenses: 4400 },
]

const expenseData = [
  { name: "Ijara", value: 1200 },
  { name: "Ish haqi", value: 2100 },
  { name: "Marketing", value: 900 },
  { name: "Xizmatlar", value: 600 },
  { name: "Boshqa", value: 400 },
]

const COLORS = ["#4338ca", "#06b6d4", "#818cf8", "#a78bfa"]

export function DashboardPreview() {
  const { t } = useTranslation()
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0)
  const totalExpenses = expenseData.reduce((sum, d) => sum + d.value, 0)
  const netProfit = totalRevenue - totalExpenses

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_120%_at_top_left,rgba(67,56,202,0.06),transparent_60%)] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-end">
          <div className="flex-1">
            <Badge variant="outline" className="text-xs uppercase tracking-wider mb-2">
              {t("common.demoData")}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
              Ilova interfeysining namoyoni
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Daromad, xarajatlar, foyda va naqd oqis — barcha ko'rsatkichlar bir joyda, real vaqtda.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <KpiCard
                title={t("dashboard.revenue")}
                value={formatCurrency(totalRevenue)}
                change="+12%"
                icon={<Activity className="size-5" />}
                positive
              />
              <KpiCard
                title={t("dashboard.expenses")}
                value={formatCurrency(totalExpenses)}
                change="-4%"
                icon={<CreditCard className="size-5" />}
              />
              <KpiCard
                title={t("dashboard.netProfit")}
                value={formatCurrency(netProfit)}
                change="+18%"
                icon={<TrendingUp className="size-5" />}
                positive
              />
            </div>
          </div>
          <div className="flex-1 h-[420px]">
            <Card className="overflow-hidden h-full">
              <CardHeader>
                <CardTitle className="text-sm">Oyiga xarajat bo'linishi</CardTitle>
                <CardDescription>Namoyon ma'lumotlar</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expenseData}>
                    <CartesianGrid vertical={false} className="stroke-[var(--border)]" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                    <YAxis hide tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4338ca" radius={[4, 4, 0, 0]}>
                      {expenseData.map((entry, idx) => (
                        <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <div className="mt-6 h-[260px]">
              <Card className="overflow-hidden h-full">
                <CardHeader>
                  <CardTitle className="text-sm">Daromad va xarajatlar dinamikasi</CardTitle>
                  <CardDescription>Oxirgi 6 oy — demo ma'lumotlar</CardDescription>
                </CardHeader>
                <CardContent className="h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid vertical={false} className="stroke-[var(--border)]" />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                      <YAxis hide tickLine={false} axisLine={false} />
                      <Tooltip cursor={{ fill: "transparent" }} />
                      <Line type="monotone" dataKey="revenue" stroke="#4338ca" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="expenses" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function KpiCard({ title, value, change, icon, positive }: { title: string; value: string; change: string; icon: React.ReactNode; positive?: boolean }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">{value}</span>
            </div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            {icon}
          </div>
        </div>
        <div className="flex items-baseline mt-2">
          <span className={`text-xs font-semibold ${positive ? "text-success" : "text-muted-foreground"}`}>{change}</span>
          <span className="text-xs text-muted-foreground"> bu oy</span>
        </div>
      </CardContent>
    </Card>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
}
