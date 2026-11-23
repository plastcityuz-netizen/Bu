import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getStorage } from "@/lib/storage"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const storage = getStorage()
  const businesses = await storage.getBusinesses(session.userId)
  const business = businesses[0]
  if (!business) return NextResponse.json({ error: "Biznes topilmadi" }, { status: 400 })
  const sub = await storage.getSubscription(business.id)
  return NextResponse.json(sub ?? { plan: "start", status: "active" })
}
