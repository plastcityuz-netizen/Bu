"use client"

import * as React from "react"
import { useTranslation } from "@/i18n/providers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"

type Transaction = { id: string; date: string; description: string; type: "income" | "expense"; amount: number; currency: string }

export default function CashFlowPage() {
  const { t } = useTranslation()
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch(`/api/transactions?businessId=${localStorage.getItem("balans-business-id") ?? ""}`)
      .then((r) => r.json())
      .then((data: any) => { setTransactions(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  const inflows = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const outflows = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0)
  const net = inflows - outflows

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Naqd oqis</h1>
        <p className="text-muted-foreground">Kirish-chiqish oqisi va tendentsiya.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Kirish</p>
                <div className="text-2xl font-bold text-success">{formatCurrency(inflows, { currency: "USD" })}</div>
              </div>
              <Activity className="size-5 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Chiqish</p>
                <div className="text-2xl font-bold text-destructive">{formatCurrency(outflows, { currency: "USD" })}</div>
              </div>
              <Activity className="size-5 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Net naqd oqis</p>
                <div className="text-2xl font-bold text-foreground">{formatCurrency(net, { currency: "USD" })}</div>
              </div>
              <div className={`flex h-6 w-6 items-center justify-center rounded-full ${net >= 0 ? "bg-success text-white" : "bg-destructive text-white"}`}>
                {net >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Naqd oqis operatsiyalari</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sana</TableHead>
                  <TableHead>Tavsif</TableHead>
                  <TableHead className="text-center">Tur</TableHead>
                  <TableHead className="text-right">Summa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8"><div className="h-4 w-24 rounded-full bg-muted animate-pulse mx-auto" /></TableCell></TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Ma'lumotlar yo'q.</TableCell></TableRow>
                ) : (
                  transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-sm text-muted-foreground">{tx.date}</TableCell>
                      <TableCell className="font-medium">{tx.description}</TableCell>
                      <TableCell className="text-center text-sm">
                        <span className={`text-xs font-medium ${tx.type === "income" ? "text-success" : "text-destructive"}`}>
                          {tx.type === "income" ? "+" : "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {(tx.type === "income" ? "+" : "-")} {formatCurrency(Math.abs(tx.amount), { currency: tx.currency })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
