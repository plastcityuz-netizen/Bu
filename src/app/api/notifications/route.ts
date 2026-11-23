import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getStorage } from "@/lib/storage"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const storage = getStorage()
  const notes = await storage.getNotifications(session.userId)
  return NextResponse.json(notes)
}

export async function PATCH(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await req.json()
  const storage = getStorage()
  const ok = await storage.markNotificationRead(id, session.userId)
  return NextResponse.json({ ok })
}
