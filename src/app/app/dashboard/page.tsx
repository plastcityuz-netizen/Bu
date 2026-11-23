import { getStorage } from "@/lib/storage"
import { getSession } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { useTranslation } from "@/i18n/providers"
import { Activity, CreditCard, TrendingUp, TrendingDown } from "lucide-react"

import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

// ui/table doesn't exist yet -> creating next
export default async function DashboardPage() {
  const session = await getSession()
  if (!session) return null
  const storage = getStorage()
  const businesses = await storage.getBusinesses(session.userId)
  const business = businesses[0]

  const totals = business ? await storage.transactionTotals(business.id) : { income: 0, expense: 0 }
  const recent = business ? await storage.getTransactions(business.id, {}) : []

  const income = totals.income
  const expense = Math.abs(totals.expense)
  const net = income - expense
  const margin = income > 0 ? ((net / income) * 100).toFixed(0) : "0"

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Boshqaruv paneli</h1>
          <p className="text-muted-foreground">Biznes moliyaviy holatining qisqacha o'rganishi.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/app/transactions">Operatsiya qo'shish</Link>
          </Button>
        </div>
      </div>

      {business && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-900 text-sm">
          DEMO MA'LUMOT — barcha ma'lumotlar fikr etilgan va faqat namoyon uchun berilgan.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Daromad" value={formatCurrency(income)} change="+12% vs oldin" positive icon={<Activity className="size-5 text-success" />} />
        <StatCard title="Xarajatlar" value={formatCurrency(expense)} change="-4% vs oldin" icon={<CreditCard className="size-5" />} />
        <StatCard title="Net foyda" value={formatCurrency(net)} change={margin + "% margin"} positive={net >= 0} icon={<TrendingUp className="size-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>So'nggi operatsiyalar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="-mx-4 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sana</TableHead>
                      <TableHead>Tavsif</TableHead>
                      <TableHead>Kategoriya</TableHead>
                      <TableHead className="text-right">Tur</TableHead>
                      <TableHead className="text-right">Summa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recent.slice(0, 8).map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>{tx.date}</TableCell>
                        <TableCell>{tx.description}</TableCell>
                        <TableCell>{tx.categoryName ?? "Mavjud emas"}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={tx.type === "income" ? "success" : "error"} className="text-xs">
                            {tx.type === "income" ? "Kirim" : "Xarajat"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {(tx.type === "income" ? "+" : "-")} {formatCurrency(Math.abs(tx.amount), { currency: tx.currency })}
                        </TableCell>
                      </TableRow>
                    ))}
                    {recent.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                          Hech qanday moliyaviy operatsiya qo'shilmagan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex justify-end">
                <Button asChild size="sm">
                  <Link href="/app/transactions">Ko'rish barcha →</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>AI insightlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Activity className="size-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Foyda o'sish kutilmoqda</p>
                  <p className="text-xs text-muted-foreground">Demo ma'lumotlar asosida: foydangiz o'tgan oya nisbata 12% yuqoridir.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingDown className="size-5 text-destructive shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Marketing xarajatlari oshdi</p>
                  <p className="text-xs text-muted-foreground">Bu oy marketing xarajatlari o'tgan oya nisbata 8% ko'p.</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground border-t pt-3">
                Insightlar demo ma'lumotlar asosida shakllanagan. Haqiqiy AI uchun API sozlang.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tezkor amallar</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline" className="text-sm"><a href="/app/income">Kirim qo'shish</a></Button>
              <Button asChild variant="outline" className="text-sm"><a href="/app/expenses">Xarajat qo'shish</a></Button>
              <Button asChild variant="outline" className="text-sm"><a href="/app/reports">Hisobot yaratish</a></Button>
              <Button asChild variant="outline" className="text-sm"><a href="/app/ai-cfo">AI-ga so'rang</a></Button>
            </CardContent>
          </Card>
        </div>
      </div>
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
