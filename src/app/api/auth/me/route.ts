import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getStorage } from "@/lib/storage"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ user: null }, { status: 401 })
  const storage = getStorage()
  const user = await storage.getUserById(session.userId)
  if (!user) return NextResponse.json({ user: null }, { status: 401 })
  return NextResponse.json({ user: { id: user.id, email: user.email, role: user.role } })
}
