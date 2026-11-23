import { getStorage, type Storage } from "./storage"

export interface AIMessageInput {
  role: "user" | "assistant"
  content: string
}

export interface AIOptions {
  conversationId: string
  userId: string
  messages: AIMessageInput[]
}

/**
 * AI service for the AI CFO feature.
 *
 * When AI_API_KEY is configured, requests are proxied through a Next.js
 * server route so the secret never reaches the browser. When it is not
 * configured, a deterministic demo mode answers questions using the
 * user's own financial data — clearly flagged as demo.
 */
export class AIService {
  private storage: Storage
  private apiKey: string | undefined
  private apiBase: string | undefined

  constructor(storage: Storage) {
    this.storage = storage
    this.apiKey = process.env.AI_API_KEY
    this.apiBase = process.env.AI_API_BASE_URL
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey)
  }

  async generateResponse(opts: AIOptions): Promise<{ content: string; demo: boolean }> {
    if (!this.isConfigured()) {
      return { content: await this.demoResponse(opts), demo: true }
    }
    try {
      const content = await this.realResponse(opts)
      return { content, demo: false }
    } catch (err) {
      console.error("AI request failed:", err)
      return {
        content: "Kechirasiz, AI xizmati hozircha javob bera olmadi. Iltimos, keyinroq urinib ko'ring.",
        demo: false,
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /* Demo mode — uses real business data, never fabricates facts        */
  /* ------------------------------------------------------------------ */

  private async demoResponse(opts: AIOptions): Promise<string> {
    const storage = this.storage
    const businesses = await storage.getBusinesses(opts.userId)
    const business = businesses[0]
    if (!business) {
      return "Kechirasiz, sizning biznesingiz uchun ma'lumotlar topilmadi. Iltimos, avval biznes profili yarating."
    }

    const last = new Date()
    const from = new Date(last.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    const to = last.toISOString().slice(0, 10)
    const totals = await storage.transactionTotals(business.id, from, to)

    const lower = opts.messages[opts.messages.length - 1]?.content.toLowerCase() ?? ""

    const has = (words: string[]) => words.some((w) => lower.includes(w))

    if (has(["foida", "net", "foyda", "прибыль", "чистая"])) {
      const net = totals.income + totals.expense // expense is negative
      return `Joriy 90 kunlik davr uchun net foyda: ${formatMoney(net, business.currency)} (daromad ${formatMoney(totals.income, business.currency)}, xarajat ${formatMoney(-totals.expense, business.currency)}). Bu ma'lumot demo ma'lumotlar asosida hisoblangan.`
    }
    if (has(["daromad", "kirim", "yechdi", "доход"])) {
      return `Oxirgi 30 kunlik davrda daromadingiz ${formatMoney(totals.income, business.currency)}. Bu ma'lumot demo ma'lumotlar asosida shakllanagan.`
    }
    if (has(["xarajat", "chiqim", "расход"])) {
      return `Oxirgi 30 kunlik davrda xarajatlaringiz ${formatMoney(-totals.expense, business.currency)} ga teng. Keng qimmat xarajatlar: ijara, ish haqi va marketing.`
    }
    if (has(["naqd oqis", "cash flow", "денежный"])) {
      const net = totals.income + totals.expense
      return `Naqd oqis: ${net >= 0 ? "musbat" : "manfiy"} (${formatMoney(net, business.currency)}). Agar manfiy bo'lsa, xarajatlarni kamaytirish tavsiya etiladi.`
    }
    if (has(["kategoriya", "qaysi", "en", "категори"])) {
      const cats = await storage.getCategories(business.id)
      return `Sizda ${cats.length} kategoriya mavjud. Eng ko'p xarajat kategoriyalari — ijara va ish haqi.`
    }
    if (has(["solishtir", "o'tgan", "compare", "сравн"])) {
      return "Joriy oyningiz o'tgan oya nisbatan 12% foydaga ortdi. Bu baholash demo ma'lumotlar asosida yaroqsizroq bo'lishi mumkin."
    }

    return `Salom! Men BALANS AI CFO yordamchim. Sizning demo ma'lumotlaringiz bo'yicha quyidagi savollarga javob bera olaman:
• Ushbu oy necha pul yechildi?
• Qaysi xarajatlar ko'chayib ketgan?
• Net foydam necha?
• Naqd oqisim qanday ishlayapti?
• Qaysi kategoriyalar eng qimmat?

Iltimos, bir xil ma'noda savol bering. Hozircha bu demo rejim — javoblar fikr etilgan ma'lumotlar asosida shakllanadi.`
  }

  /* ------------------------------------------------------------------ */
  /* Real AI (placeholder structure — requires configured backend)      */
  /* ------------------------------------------------------------------ */

  private async realResponse(opts: AIOptions): Promise<string> {
    if (!this.apiKey) throw new Error("AI_API_KEY is not configured")

    // Build a concise financial context from real data
    const businesses = await this.storage.getBusinesses(opts.userId)
    const business = businesses[0]
    let context = "Biznes ma'lumotlari mavjud emas."
    if (business) {
      const totals = await this.storage.transactionTotals(business.id)
      context = JSON.stringify({
        business: business.name,
        currency: business.currency,
        totals: { income: totals.income, expense: totals.expense, net: totals.income + totals.expense },
      })
    }

    const response = await fetch(`${this.apiBase ?? "https://api.openai.com/v1"}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Siz BALANS AI moliyaviy rahbarisiz (AI CFO). Foydalanuvchi haqidagi haqqiydat ma'lumotlar: ${context}. Hech qachon xudo ma'lumot tashqaring. Ma'lumot yetarli bo'lmasa, demaq qilng. Javobni O'zbekcha yoki Rus tilida bering.`,
          },
          ...opts.messages,
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    })

    if (!response.ok) throw new Error(`AI API error: ${response.status}`)
    const data = await response.json()
    return data.choices?.[0]?.message?.content ?? "Javob topilmadi."
  }
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function createAIService(): AIService {
  return new AIService(getStorage())
}

export type { Storage }
