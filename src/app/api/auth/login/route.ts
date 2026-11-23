import { NextResponse } from "next/server"
import { z } from "zod"
import { getStorage } from "@/lib/storage"
import { hashPassword, verifyPassword, signSession, setSessionCookie } from "@/lib/auth"

const schema = z.object({
  email: z.string().email("Noto'g'ri elektron poчta manzili"),
  password: z.string().min(1, "Parol majburiy"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const storage = getStorage()
    const user = await storage.getUserByEmail(parsed.data.email)
    if (!user) {
      return NextResponse.json({ error: "Foydalanuvchi topilmadi" }, { status: 401 })
    }

    const ok = await verifyPassword(parsed.data.password, user.passwordHash)
    if (!ok) {
      return NextResponse.json({ error: "Parol xato" }, { status: 401 })
    }

    const token = await signSession({ userId: user.id, email: user.email })
    await setSessionCookie(token)

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } })
  } catch (err) {
    console.error("login error", err)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
