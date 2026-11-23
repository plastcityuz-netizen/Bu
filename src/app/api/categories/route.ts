import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/auth"
import { getStorage } from "@/lib/storage"

const createSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["income", "expense"]),
  color: z.string().default("#4338ca"),
})

export async function GET(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const storage = getStorage()
  const businesses = await storage.getBusinesses(session.userId)
  const business = businesses[0]
  if (!business) return NextResponse.json({ error: "Biznes topilmadi" }, { status: 400 })
  const cats = await storage.getCategories(business.id)
  return NextResponse.json(cats)
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const storage = getStorage()
  const businesses = await storage.getBusinesses(session.userId)
  const business = businesses[0]
  if (!business) return NextResponse.json({ error: "Biznes topilmadi" }, { status: 400 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })

  const cat = await storage.createCategory(business.id, { ...parsed.data, businessId: business.id })
  return NextResponse.json(cat, { status: 201 })
}
