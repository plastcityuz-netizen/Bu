import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/auth"
import { getStorage, type TransactionFilter } from "@/lib/storage"

const createSchema = z.object({
  type: z.enum(["income", "expense"]),
  description: z.string().min(1, "Tavsif majburiy"),
  amount: z.number().positive("Summa musbat bo'lishi kerak"),
  currency: z.string().min(1, "Valyuta majburiy"),
  date: z.string().min(1, "Sana majburiy"),
  categoryId: z.string().nullable().optional(),
  categoryName: z.string().nullable().optional(),
  paymentMethod: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
})

export async function GET(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const storage = getStorage()
  const businesses = await storage.getBusinesses(session.userId)
  if (businesses.length === 0) return NextResponse.json([])

  const { searchParams } = new URL(req.url)
  const businessId = searchParams.get("businessId") || businesses[0].id
  const filter: TransactionFilter = {
    type: searchParams.get("type") as any,
    categoryId: searchParams.get("categoryId") || undefined,
    from: searchParams.get("from") || undefined,
    to: searchParams.get("to") || undefined,
    search: searchParams.get("search") || undefined,
  }
  const txs = await storage.getTransactions(businessId, filter)
  return NextResponse.json(txs)
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const storage = getStorage()
  const businesses = await storage.getBusinesses(session.userId)
  if (businesses.length === 0) return NextResponse.json({ error: "Biznes topilmadi" }, { status: 400 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })

  const tx = await storage.createTransaction(businesses[0].id, {
    ...parsed.data,
    businessId: businesses[0].id,
    categoryId: parsed.data.categoryId ?? null,
    categoryName: parsed.data.categoryName ?? null,
    paymentMethod: parsed.data.paymentMethod ?? null,
    notes: parsed.data.notes ?? null,
  })
  return NextResponse.json(tx, { status: 201 })
}
