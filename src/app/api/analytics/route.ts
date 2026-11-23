import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getStorage } from "@/lib/storage"

export async function GET(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const storage = getStorage()
  const businesses = await storage.getBusinesses(session.userId)
  const business = businesses[0]
  if (!business) return NextResponse.json({ error: "Biznes topilmadi" }, { status: 400 })

  const { searchParams } = new URL(req.url)
  const range = searchParams.get("range") || "30d"
  const days = range === "7d" ? 7 : range === "90d" ? 90 : range === "12m" ? 365 : 30
  const now = new Date()
  const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const to = now.toISOString().slice(0, 10)

  const totals = await storage.transactionTotals(business.id, from, to)
  const cats = await storage.getCategories(business.id)
  const txs = await storage.getTransactions(business.id, { from, to })

  const expenseByCategory: Record<string, number> = {}
  for (const tx of txs) {
    if (tx.type === "expense") {
      const name = tx.categoryName ?? "Boshqa"
      expenseByCategory[name] = (expenseByCategory[name] ?? 0) + Math.abs(tx.amount)
    }
  }

  return NextResponse.json({
    revenue: totals.income,
    expenses: Math.abs(totals.expense),
    netProfit: totals.income + totals.expense,
    categoryBreakdown: Object.entries(expenseByCategory).map(([name, value]) => ({ name, value })),
    categories: cats,
  })
}
