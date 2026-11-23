import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/auth"
import { getStorage } from "@/lib/storage"

const updateSchema = z.object({
  type: z.enum(["income", "expense"]).optional(),
  description: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  currency: z.string().min(1).optional(),
  date: z.string().min(1).optional(),
  categoryId: z.string().nullable().optional(),
  categoryName: z.string().nullable().optional(),
  paymentMethod: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
})

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const storage = getStorage()
  const businesses = await storage.getBusinesses(session.userId)
  const business = businesses[0]
  if (!business) return NextResponse.json({ error: "Biznes topilmadi" }, { status: 400 })
  const { id } = await params
  const tx = await storage.getTransaction(id, business.id)
  if (!tx) return NextResponse.json({ error: "Topilmadi" }, { status: 404 })
  return NextResponse.json(tx)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const storage = getStorage()
  const businesses = await storage.getBusinesses(session.userId)
  const business = businesses[0]
  if (!business) return NextResponse.json({ error: "Biznes topilmadi" }, { status: 400 })

  const { id } = await params
  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })

  const tx = await storage.updateTransaction(id, business.id, parsed.data)
  if (!tx) return NextResponse.json({ error: "Topilmadi" }, { status: 404 })
  return NextResponse.json(tx)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const storage = getStorage()
  const businesses = await storage.getBusinesses(session.userId)
  const business = businesses[0]
  if (!business) return NextResponse.json({ error: "Biznes topilmadi" }, { status: 400 })

  const { id } = await params
  const ok = await storage.deleteTransaction(id, business.id)
  if (!ok) return NextResponse.json({ error: "Topilmadi" }, { status: 404 })
  return NextResponse.json({ ok: true })
}
