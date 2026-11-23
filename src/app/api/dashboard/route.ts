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
  const from = searchParams.get("from") || undefined
  const to = searchParams.get("to") || undefined
  const totals = await storage.transactionTotals(business.id, from, to)
  const recent = await storage.getTransactions(business.id, { from, to })

  const income = totals.income
  const expense = Math.abs(totals.expense)
  const net = income - expense
  const margin = income > 0 ? (net / income) * 100 : 0

  return NextResponse.json({
    business,
    revenue: income,
    expenses: expense,
    netProfit: net,
    cashBalance: net,
    profitMargin: margin,
    recentTransactions: recent.slice(0, 10),
  })
}
