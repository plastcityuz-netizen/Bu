import { NextResponse } from "next/server"
import { z } from "zod"
import { getStorage } from "@/lib/storage"
import { hashPassword, signSession, setSessionCookie } from "@/lib/auth"

const schema = z.object({
  email: z.string().email("Noto'g'ri elektron poчta manzili"),
  password: z.string().min(8, "Parol kamida 8 ta belgi bo'lishi kerak"),
  fullName: z.string().min(1, "Ism majburiy"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const storage = getStorage()
    const exists = await storage.getUserByEmail(parsed.data.email)
    if (exists) {
      return NextResponse.json({ error: "Bu poчtadan allaqachon ro'yxatdan o'tilgan" }, { status: 409 })
    }

    const passwordHash = await hashPassword(parsed.data.password)
    const user = await storage.createUser(parsed.data.email, passwordHash)
    await storage.upsertProfile(user.id, { fullName: parsed.data.fullName })
    await storage.createBusiness(user.id, { name: `${parsed.data.fullName} biznesi`, currency: "USD" })

    const token = await signSession({ userId: user.id, email: user.email })
    await setSessionCookie(token)

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } })
  } catch (err) {
    console.error("register error", err)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
