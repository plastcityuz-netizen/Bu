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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"

const schema = z.object({
  name: z.string().min(1, "Nomi majburiy"),
  type: z.enum(["income", "expense"]),
  color: z.string().default("#4338ca"),
})

type Category = { id: string; name: string; type: string; color: string }

export default function CategoriesPage() {
  const { t } = useTranslation()
  const [categories, setCategories] = React.useState<Category[]>([])
  const [loading, setLoading] = React.useState(true)
  const [open, setOpen] = React.useState(false)

  async function load() {
    setLoading(true)
    const params = localStorage.getItem("balans-business-id") ? `?businessId=${localStorage.getItem("balans-business-id")}` : ""
    const res = await fetch(`/api/categories${params}`)
    const data = await res.json()
    setCategories(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  React.useEffect(() => { load() }, [])

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema) as any,
    defaultValues: { name: "", type: "expense", color: "#4338ca" },
  })

  async function save(values: z.infer<typeof schema>) {
    const body = { ...values, businessId: localStorage.getItem("balans-business-id") ?? "" }
    await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    setOpen(false)
    form.reset({ name: "", type: "expense", color: "#4338ca" } as any)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Kategoriyalar</h1>
          <p className="text-muted-foreground">Moliyaviy operatsiyalar kategoriyalarini boshqaring.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-auto"><Plus className="size-4 mr-2" />Kategoriya qo'shish</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yangi kategoriya</DialogTitle>
              <p className="text-sm text-muted-foreground">Operatsiya kategoriyasini yarating.</p>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(save)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nomi</label>
                <Input {...form.register("name")} placeholder="Masalan: Marketing" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tur</label>
                  <Select onValueChange={(v) => form.setValue("type", v as "income" | "expense")} defaultValue="expense">
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Kirim</SelectItem>
                    <SelectItem value="expense">Xarajat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Rang</label>
                <Input type="color" {...form.register("color")} className="h-9 w-full cursor-pointer" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => { setOpen(false); form.reset() }}>Bekor qilish</Button>
                <Button type="submit" className="w-auto">Saqlash</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomi</TableHead>
                  <TableHead className="text-center">Tur</TableHead>
                  <TableHead className="text-center">Rang</TableHead>
                  <TableHead className="text-right w-[16%]">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8"><div className="h-4 w-24 rounded-full bg-muted animate-pulse mx-auto" /></TableCell></TableRow>
                ) : categories.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Kategoriyalar yo'q.</TableCell></TableRow>
                ) : (
                  categories.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">{c.type === "income" ? "Kirim" : "Xarajat"}</TableCell>
                      <TableCell className="text-center"><div className="h-5 w-5 rounded-full border" style={{ backgroundColor: c.color }} /></TableCell>
                      <TableCell className="text-right"></TableCell>
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
