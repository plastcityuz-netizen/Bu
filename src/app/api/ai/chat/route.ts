import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/auth"
import { getStorage } from "@/lib/storage"
import { createAIService } from "@/lib/ai"
import type { AIMessage } from "@/lib/storage"

const schema = z.object({
  conversationId: z.string().optional(),
  title: z.string().optional(),
  message: z.string().min(1),
})

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })

  const storage = getStorage()
  const ai = createAIService()
  const demo = !ai.isConfigured()

  let conversationId = parsed.data.conversationId
  if (!conversationId) {
    const c = await storage.createAIConversation(session.userId, parsed.data.message.slice(0, 60))
    conversationId = c.id
  } else {
    const c = await storage.getAIConversation(conversationId, session.userId)
    if (!c) return NextResponse.json({ error: "Suhbat topilmadi" }, { status: 404 })
  }

  await storage.addAIMessage(conversationId as string, "user", parsed.data.message, demo)

  const messages = (await storage.getAIMessages(conversationId as string)).map((m: AIMessage) => ({
    role: m.role,
    content: m.content,
  }))

  const { content } = await ai.generateResponse({
    conversationId,
    userId: session.userId,
    messages,
  })

  await storage.addAIMessage(conversationId, "assistant", content, demo)

  return NextResponse.json({ conversationId, content, demo })
}
