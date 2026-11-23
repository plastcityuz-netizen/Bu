"use client"

import * as React from "react"
import { useTranslation } from "@/i18n/providers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, Activity, TrendingUp, TrendingDown } from "lucide-react"
import { createAIService } from "@/lib/ai"

const SUGGESTED = [
  "Ushbu oy necha pul yechildi?",
  "Qaysi xarajatlar ko'chayib ketgan?",
  "Net foydam necha?",
  "Naqd oqisim qanday ishlayapti?",
  "Qaysi kategoriyalar eng qimmat?",
  "Ushbu oynani o'tgan oynaga solishtir",
]

type Message = { role: "user" | "assistant"; content: string; demo: boolean }

export default function AICFOPage() {
  const { t } = useTranslation()
  const ai = React.useMemo(() => createAIService(), [])
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [sending, setSending] = React.useState(false)
  const [conversationId, setConversationId] = React.useState<string | null>(null)

  React.useEffect(() => {
    setMessages([
      { role: "assistant", content: "Salom! Men BALANS AI CFO yordamchim. Savolingizni yozing.", demo: false },
    ])
  }, [])

  async function send() {
    if (!input.trim() || sending) return
    const userMsg = input.trim()
    setInput("")
    setSending(true)
    setMessages((prev) => [...prev, { role: "user", content: userMsg, demo: true }])

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message: userMsg }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Xatolik")
      setConversationId(json.conversationId)
      setMessages((prev) => [...prev, { role: "assistant", content: json.content, demo: !!json.demo }])
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Kechirasiz, hozircha javob bera olmadi. Keyinroq urinib ko'ring.", demo: true }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-input">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
          <Bot className="size-4" />
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">AI CFO</div>
          <div className="text-xs text-muted-foreground">{ai.isConfigured() ? "Faol AI xizmati" : "Demo rejim — fikr etilgan ma'lumotlar asosida"}</div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={cn$(`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`)}>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: m.role === "user" ? "#4338ca" : "#f1f5f9" }} color={m.role === "user" ? "white" : "#0f172a"}>
                {m.role === "user" ? "S" : "A"}
              </div>
              <div className={cn$("rounded-lg p-3 max-w-[80%] text-sm", m.role === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted text-foreground")}>
                {m.content}
                {m.demo && (
                  <span className="mt-1 block text-[10px] text-muted-foreground">Demo ma'lumotlar asosida shakllanagan</span>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
        <Separator className="mx-4 my-2" />
        <div className="p-3 border-t border-input">
          <form onSubmit={(e) => { e.preventDefault(); send() }} className="flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Savolingizni yozing..." disabled={sending} />
            <Button type="submit" disabled={sending}>
              {sending ? "Yuborilmoqda..." : <Send className="size-4" />}
            </Button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTED.map((q, i) => (
              <Button key={i} variant="outline" size="sm" className="text-left w-[150px]" onClick={() => setInput(q)}>
                {q}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function cn$(...classes: string[]) { return classes.filter(Boolean).join(" ") }
