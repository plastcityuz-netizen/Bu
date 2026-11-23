import { NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({ email: z.string().email() })

export async function POST(req: Request) {
  const body = await req.json()
  if (!schema.safeParse(body).success) {
    return NextResponse.json({ error: "Noto'g'ri poчta" }, { status: 400 })
  }
  // No real email backend is configured. Always return success to avoid
  // user enumeration, and document that an email provider must be wired up.
  return NextResponse.json({
    ok: true,
    message: "Agar poчta ro'yxatdan o'tgan bo'lsa, tiklash havolasi yuborildi.",
    note: "Email provider sozlanmaganda xabar yuborilmaydi (xavfsizlik uchun javob hammada bir xil).",
  })
}
