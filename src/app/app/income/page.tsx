"use client"

import * as React from "react"
import { useTranslation } from "@/i18n/providers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

type Transaction = { id: string; date: string; description: string; categoryName: string | null; amount: number; currency: string }

export default function IncomePage() {
  const { t } = useTranslation()
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [loading, setLoading] = React.useState(true)
  const total = React.useMemo(() => transactions.reduce((s, t) => s + t.amount, 0), [transactions])

  React.useEffect(() => {
    fetch(`/api/transactions?type=income&businessId=${localStorage.getItem("balans-business-id") ?? ""}`)
      .then((r) => r.json())
      .then((data: any) => { setTransactions(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Kirimlar</h1>
          <p className="text-muted-foreground">Barcha kirim manbalarining ro'yxati.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground">Jami kirim</p>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(total, { currency: "USD" })}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground">Operatsiya soni</p>
            <div className="text-2xl font-bold text-foreground">{transactions.length}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Kirim operatsiyalari</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sana</TableHead>
                  <TableHead>Tavsif</TableHead>
                  <TableHead>Kategoriya</TableHead>
                  <TableHead className="text-right">Summa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8"><div className="h-4 w-24 rounded-full bg-muted animate-pulse mx-auto" /></TableCell></TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Kirim operatsiyalari yo'q.</TableCell></TableRow>
                ) : (
                  transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-sm text-muted-foreground">{tx.date}</TableCell>
                      <TableCell className="font-medium">{tx.description}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{tx.categoryName ?? "—"}</TableCell>
                      <TableCell className="text-right font-medium">+{formatCurrency(Math.abs(tx.amount), { currency: tx.currency })}</TableCell>
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
