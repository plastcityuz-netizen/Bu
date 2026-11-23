"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslation } from "@/i18n/providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

const schema = z.object({
  type: z.enum(["income", "expense"]),
  description: z.string().min(1, "Tavsif majburiy"),
  amount: z.coerce.number().positive("Summa musbat bo'lishi kerak"),
  currency: z.string().min(1, "Valyuta tanlang"),
  date: z.string().min(1, "Sana majburiy"),
  categoryName: z.string().optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
})

type Transaction = {
  id: string;
  date: string;
  description: string;
  categoryName: string | null;
  type: "income" | "expense";
  amount: number;
  currency: string;
}

export default function TransactionsPage() {
  const { t } = useTranslation()
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [categories, setCategories] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(true)
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState("all")

  async function load() {
    setLoading(true)
    const businessId = localStorage.getItem("balans-business-id")
    const params = businessId ? `?businessId=${businessId}` : ""
    const res = await fetch(`/api/transactions${params}`)
    const data = await res.json()
    setTransactions(Array.isArray(data) ? data : [])
    const catRes = await fetch(`/api/categories${params}`)
    const cats = await catRes.json()
    setCategories(Array.isArray(cats) ? cats.map((c: any) => c.name) : [])
    setLoading(false)
  }

  React.useEffect(() => { load() }, [])

  const filtered = transactions.filter((tx) => {
    const q = search.toLowerCase()
    const matchSearch = tx.description.toLowerCase().includes(q) || tx.date.includes(q)
    const matchType = typeFilter === "all" || tx.type === typeFilter
    return matchSearch && matchType
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      type: "expense",
      description: "",
      amount: 0,
      currency: "USD",
      date: new Date().toISOString().slice(0, 10),
      categoryName: "",
      paymentMethod: "",
      notes: "",
    },
  })

  async function save(values: z.infer<typeof schema>) {
    const body: any = {
      ...values,
      amount: Number(values.amount),
      businessId: localStorage.getItem("balans-business-id") ?? "",
    }
    await fetch("/api/transactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    setOpen(false)
    form.reset()
    load()
  }

  async function remove(id: string) {
    if (!window.confirm("Operatsiyani o'chirishni istaysizmi?")) return
    await fetch(`/api/transactions/${id}`, { method: "DELETE" })
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Operatsiyalar</h1>
          <p className="text-muted-foreground">Barcha moliyaviy operatsiyalarni kuzatib borish va boshqarish.</p>
        </div>
        <div className="flex items-center gap-3">
          <Input placeholder="Qidirish..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-[220px]" />
          <Select value={typeFilter} onValueChange={setTypeFilter} defaultValue="all">
            <SelectTrigger className="w-[90px]"><SelectValue placeholder="Barchasi" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barchasi</SelectItem>
              <SelectItem value="income">Kirimlar</SelectItem>
              <SelectItem value="expense">Xarajatlar</SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-auto"><Plus className="size-4 mr-2" />Yangi operatsiya</Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Yangi operatsiya</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yangi operatsiya</DialogTitle>
            <DialogDescription>Kirim yoki xarajat operatsiyasini kiriting.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(save)} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tur</label>
                  <Select onValueChange={(v) => form.setValue("type", v as "income" | "expense")} defaultValue="expense">
                  <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Kirim</SelectItem>
                    <SelectItem value="expense">Xarajat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Valyuta</label>
                  <Select onValueChange={(v) => form.setValue("currency", v)} defaultValue="USD">
                  <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="UZS">UZS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tavsif</label>
              <Input {...form.register("description")} placeholder="Masalan: Do'kon savdo" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Summa</label>
                <Input type="number" {...form.register("amount")} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Sana</label>
                <Input type="date" {...form.register("date")} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Kategoriya</label>
              <Select onValueChange={(v) => form.setValue("categoryName", v ?? "")}>
                <SelectTrigger><SelectValue placeholder="Kategoriya tanlang" /></SelectTrigger>
                <SelectContent>{categories.map((c) => (c ? <SelectItem key={c} value={c}>{c}</SelectItem> : null))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">To'lov usuli</label>
              <Input {...form.register("paymentMethod")} placeholder="Naqd / Karta" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Eslatma</label>
              <Input {...form.register("notes")} placeholder="Qo'shimcha izoh" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => { setOpen(false); form.reset() }}>Bekor qilish</Button>
              <Button type="submit" className="w-auto">Saqlash</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20%]">Sana</TableHead>
                  <TableHead className="w-[32%]">Tavsif</TableHead>
                  <TableHead>Kategoriya</TableHead>
                  <TableHead className="text-right">Tur</TableHead>
                  <TableHead className="text-right w-[20%]">Summa</TableHead>
                  <TableHead className="text-right w-[16%]">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="h-4 w-24 rounded-full bg-muted animate-pulse mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">Operatsiyalar topilmadi.</TableCell>
                  </TableRow>
                ) : (
                  filtered.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-sm text-muted-foreground">{tx.date}</TableCell>
                      <TableCell className="font-medium">{tx.description}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{tx.categoryName ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={tx.type === "income" ? "success" : "destructive"} className="text-xs">
                          {tx.type === "income" ? "Kirim" : "Xarajat"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {(tx.type === "income" ? "+" : "-")} {formatCurrency(Math.abs(tx.amount), { currency: tx.currency })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => remove(tx.id)}>O'chirish</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="border-t px-4 py-3 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">{filtered.length} ta operatsiya ko'rsatilmoqda</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
