import bcrypt from "bcryptjs"

const uuidv4 = () => crypto.randomUUID()

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type UserRole = "owner" | "admin" | "accountant" | "viewer"

export interface User {
  id: string
  email: string
  passwordHash: string
  role: UserRole
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Profile {
  id: string
  userId: string
  fullName: string | null
  avatarUrl: string | null
  language: "uz" | "ru"
  theme: "light" | "dark" | "system"
  updatedAt: Date
}

export interface Business {
  id: string
  userId: string
  name: string
  type: string | null
  taxId: string | null
  address: string | null
  phone: string | null
  email: string | null
  currency: string
  website: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  businessId: string
  name: string
  type: "income" | "expense"
  color: string
}

export interface Transaction {
  id: string
  businessId: string
  type: "income" | "expense"
  description: string
  amount: number // minor units of currency (e.g. cents / tiyin)
  currency: string
  date: string // ISO date
  categoryId: string | null
  categoryName: string | null
  paymentMethod: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Subscription {
  id: string
  businessId: string
  plan: "start" | "business" | "premium" | "enterprise"
  status: "active" | "canceled" | "past_due" | "trialing"
  price: number | null
  currency: string
  currentPeriodEnd: Date | null
  canceledAt: Date | null
  updatedAt: Date
}

export interface Notification {
  id: string
  userId: string
  title: string
  body: string | null
  read: boolean
  createdAt: Date
}

export interface AIConversation {
  id: string
  userId: string
  title: string
  createdAt: Date
  updatedAt: Date
}

export interface AIMessage {
  id: string
  conversationId: string
  role: "user" | "assistant"
  content: string
  demo: boolean
  createdAt: Date
}

export interface Report {
  id: string
  businessId: string
  type: string
  title: string
  rangeStart: string
  rangeEnd: string
  data: string // JSON
  createdAt: Date
}

export interface AuditLog {
  id: string
  userId: string | null
  action: string
  entity: string
  entityId: string | null
  meta: string | null
  createdAt: Date
}

export interface Session {
  userId: string
  email: string
}

/* ------------------------------------------------------------------ */
/* Storage interface                                                  */
/* ------------------------------------------------------------------ */

export interface Storage {
  // users
  getUserById(id: string): Promise<User | null>
  getUserByEmail(email: string): Promise<User | null>
  createUser(email: string, passwordHash: string): Promise<User>
  updateUser(id: string, patch: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>): Promise<User | null>

  // profiles
  getProfile(userId: string): Promise<Profile | null>
  upsertProfile(userId: string, patch: Partial<Profile>): Promise<Profile>

  // businesses
  getBusinesses(userId: string): Promise<Business[]>
  getBusiness(id: string, userId: string): Promise<Business | null>
  createBusiness(userId: string, data: Partial<Business>): Promise<Business>
  updateBusiness(id: string, userId: string, data: Partial<Business>): Promise<Business | null>

  // categories
  getCategories(businessId: string): Promise<Category[]>
  createCategory(businessId: string, data: Omit<Category, "id">): Promise<Category>
  updateCategory(id: string, businessId: string, data: Partial<Category>): Promise<Category | null>
  deleteCategory(id: string, businessId: string): Promise<boolean>

  // transactions
  getTransactions(businessId: string, opts?: TransactionFilter): Promise<Transaction[]>
  getTransaction(id: string, businessId: string): Promise<Transaction | null>
  createTransaction(businessId: string, data: Omit<Transaction, "id" | "createdAt" | "updatedAt">): Promise<Transaction>
  updateTransaction(id: string, businessId: string, data: Partial<Transaction>): Promise<Transaction | null>
  deleteTransaction(id: string, businessId: string): Promise<boolean>
  transactionTotals(businessId: string, from?: string, to?: string): Promise<{ income: number; expense: number }>

  // subscriptions
  getSubscription(businessId: string): Promise<Subscription | null>
  upsertSubscription(businessId: string, data: Partial<Subscription>): Promise<Subscription>

  // notifications
  getNotifications(userId: string): Promise<Notification[]>
  markNotificationRead(id: string, userId: string): Promise<boolean>
  markAllNotificationsRead(userId: string): Promise<void>
  createNotification(userId: string, title: string, body?: string): Promise<Notification>

  // AI
  getAIConversations(userId: string): Promise<AIConversation[]>
  getAIConversation(id: string, userId: string): Promise<AIConversation | null>
  createAIConversation(userId: string, title: string): Promise<AIConversation>
  addAIMessage(conversationId: string, role: AIMessage["role"], content: string, demo: boolean): Promise<AIMessage>
  getAIMessages(conversationId: string): Promise<AIMessage[]>

  // reports
  createReport(report: Omit<Report, "id" | "createdAt">): Promise<Report>
  getReports(businessId: string): Promise<Report[]>

  // audit
  writeAuditLog(userId: string | null, action: string, entity: string, entityId: string | null, meta?: string): Promise<void>
}

export interface TransactionFilter {
  type?: "income" | "expense"
  categoryId?: string
  from?: string // ISO date
  to?: string // ISO date
  search?: string
}

/* ------------------------------------------------------------------ */
/* In-memory implementation (demo / development)                      */
/* ------------------------------------------------------------------ */

export class InMemoryStorage implements Storage {
  private users = new Map<string, User>()
  private profiles = new Map<string, Profile>()
  private businesses = new Map<string, Business>()
  private categories = new Map<string, Category>()
  private transactions = new Map<string, Transaction>()
  private subscriptions = new Map<string, Subscription>()
  private notifications = new Map<string, Notification>()
  private aiConversations = new Map<string, AIConversation>()
  private aiMessages = new Map<string, AIMessage[]>()
  private reports = new Map<string, Report>()
  private auditLogs: AuditLog[] = []

  private byBusiness = new Map<string, string[]>() // businessId -> transaction ids
  private byCategory = new Map<string, string[]>() // categoryId -> transaction ids

  async getUserById(id: string) {
    return this.users.get(id) ?? null
  }
  async getUserByEmail(email: string) {
    return [...this.users.values()].find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null
  }
  async createUser(email: string, passwordHash: string) {
    const id = uuidv4()
    const now = new Date()
    const user: User = { id, email, passwordHash, role: "owner", emailVerified: true, createdAt: now, updatedAt: now }
    this.users.set(id, user)
    await this.writeAuditLog(id, "user.created", "user", id)
    return user
  }
  async updateUser(id: string, patch: Partial<User>) {
    const user = this.users.get(id)
    if (!user) return null
    const next = { ...user, ...patch, updatedAt: new Date() }
    this.users.set(id, next)
    return next
  }

  async getProfile(userId: string) {
    return this.profiles.get(userId) ?? null
  }
  async upsertProfile(userId: string, patch: Partial<Profile>) {
    const now = new Date()
    const existing = this.profiles.get(userId)
    const profile: Profile = {
      id: existing?.id ?? uuidv4(),
      userId,
      fullName: existing?.fullName ?? null,
      avatarUrl: existing?.avatarUrl ?? null,
      language: (existing?.language ?? "uz") as "uz" | "ru",
      theme: (existing?.theme ?? "system") as "light" | "dark" | "system",
      ...patch,
      updatedAt: now,
    }
    this.profiles.set(userId, profile)
    return profile
  }

  async getBusinesses(userId: string) {
    return [...this.businesses.values()].filter((b) => b.userId === userId)
  }
  async getBusiness(id: string, userId: string) {
    const b = this.businesses.get(id)
    return b && b.userId === userId ? b : null
  }
  async createBusiness(userId: string, data: Partial<Business>) {
    const id = uuidv4()
    const now = new Date()
    const business: Business = {
      id,
      userId,
      name: data.name ?? "Biznes",
      type: data.type ?? null,
      taxId: data.taxId ?? null,
      address: data.address ?? null,
      phone: data.phone ?? null,
      email: data.email ?? null,
      currency: data.currency ?? "USD",
      website: data.website ?? null,
      createdAt: now,
      updatedAt: now,
    }
    this.businesses.set(id, business)
    await this.writeAuditLog(userId, "business.created", "business", id)
    // seed default categories
    await this.createCategory(id, { name: "Ish haqi", type: "income", color: "#4338ca" })
    await this.createCategory(id, { name: "Savdo", type: "income", color: "#06b6d4" })
    await this.createCategory(id, { name: "Ijara", type: "expense", color: "#dc2626" })
    await this.createCategory(id, { name: "Marketing", type: "expense", color: "#7c3aed" })
    await this.createCategory(id, { name: "Xizmatlar", type: "expense", color: "#059669" })
    return business
  }
  async updateBusiness(id: string, userId: string, data: Partial<Business>) {
    const b = this.businesses.get(id)
    if (!b || b.userId !== userId) return null
    const next = { ...b, ...data, updatedAt: new Date() }
    this.businesses.set(id, next)
    return next
  }

  async getCategories(businessId: string) {
    return [...this.categories.values()].filter((c) => c.businessId === businessId)
  }
  async createCategory(businessId: string, data: Omit<Category, "id" | "businessId">) {
    const id = uuidv4()
    const category: Category = { id, businessId, ...data }
    this.categories.set(id, category)
    return category
  }
  async updateCategory(id: string, businessId: string, data: Partial<Category>) {
    const c = this.categories.get(id)
    if (!c || c.businessId !== businessId) return null
    const next = { ...c, ...data }
    this.categories.set(id, next)
    return next
  }
  async deleteCategory(id: string, businessId: string) {
    const c = this.categories.get(id)
    if (!c || c.businessId !== businessId) return false
    this.categories.delete(id)
    return true
  }

  async getTransactions(businessId: string, opts: TransactionFilter = {}) {
    let list = [...this.transactions.values()].filter((t) => t.businessId === businessId)
    if (opts.type) list = list.filter((t) => t.type === opts.type)
    if (opts.categoryId) list = list.filter((t) => t.categoryId === opts.categoryId)
    if (opts.from) list = list.filter((t) => t.date >= opts.from!)
    if (opts.to) list = list.filter((t) => t.date <= opts.to!)
    if (opts.search) {
      const q = opts.search.toLowerCase()
      list = list.filter((t) => t.description.toLowerCase().includes(q) || (t.notes ?? "").toLowerCase().includes(q))
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
  async getTransaction(id: string, businessId: string) {
    const t = this.transactions.get(id)
    return t && t.businessId === businessId ? t : null
  }
  async createTransaction(businessId: string, data: Omit<Transaction, "id" | "createdAt" | "updatedAt">) {
    const id = uuidv4()
    const now = new Date()
    const transaction: Transaction = { id, ...data, createdAt: now, updatedAt: now }
    this.transactions.set(id, transaction)
    this.byBusiness.get(businessId)?.push(id)
    if (transaction.categoryId) this.byCategory.get(transaction.categoryId)?.push(id)
    await this.writeAuditLog(null, "transaction.created", "transaction", id)
    return transaction
  }
  async updateTransaction(id: string, businessId: string, data: Partial<Transaction>) {
    const t = this.transactions.get(id)
    if (!t || t.businessId !== businessId) return null
    const next = { ...t, ...data, updatedAt: new Date() }
    this.transactions.set(id, next)
    return next
  }
  async deleteTransaction(id: string, businessId: string) {
    const t = this.transactions.get(id)
    if (!t || t.businessId !== businessId) return false
    this.transactions.delete(id)
    return true
  }
  async transactionTotals(businessId: string, from?: string, to?: string) {
    let list = [...this.transactions.values()].filter((t) => t.businessId === businessId)
    if (from) list = list.filter((t) => t.date >= from)
    if (to) list = list.filter((t) => t.date <= to)
    const income = list.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0)
    const expense = list.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0)
    return { income, expense }
  }

  async getSubscription(businessId: string) {
    return this.subscriptions.get(businessId) ?? null
  }
  async upsertSubscription(businessId: string, data: Partial<Subscription>) {
    const existing = this.subscriptions.get(businessId)
    const now = new Date()
    const sub: Subscription = {
      id: existing?.id ?? uuidv4(),
      businessId,
      plan: (existing?.plan ?? "start") as Subscription["plan"],
      status: (existing?.status ?? "active") as Subscription["status"],
      price: existing?.price ?? null,
      currency: "USD",
      currentPeriodEnd: existing?.currentPeriodEnd ?? null,
      canceledAt: existing?.canceledAt ?? null,
      ...data,
      updatedAt: now,
    }
    this.subscriptions.set(businessId, sub)
    return sub
  }

  async getNotifications(userId: string) {
    return [...this.notifications.values()].filter((n) => n.userId === userId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }
  async markNotificationRead(id: string, userId: string) {
    const n = this.notifications.get(id)
    if (!n || n.userId !== userId) return false
    n.read = true
    return true
  }
  async markAllNotificationsRead(userId: string) {
    for (const n of [...this.notifications.values()].filter((n) => n.userId === userId)) n.read = true
  }
  async createNotification(userId: string, title: string, body?: string) {
    const id = uuidv4()
    const n: Notification = { id, userId, title, body: body ?? null, read: false, createdAt: new Date() }
    this.notifications.set(id, n)
    return n
  }

  async getAIConversations(userId: string) {
    return [...this.aiConversations.values()].filter((c) => c.userId === userId).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }
  async getAIConversation(id: string, userId: string) {
    const c = this.aiConversations.get(id)
    return c && c.userId === userId ? c : null
  }
  async createAIConversation(userId: string, title: string) {
    const id = uuidv4()
    const now = new Date()
    const c: AIConversation = { id, userId, title, createdAt: now, updatedAt: now }
    this.aiConversations.set(id, c)
    this.aiMessages.set(id, [])
    return c
  }
  async addAIMessage(conversationId: string, role: AIMessage["role"], content: string, demo: boolean) {
    const id = uuidv4()
    const m: AIMessage = { id, conversationId, role, content, demo, createdAt: new Date() }
    const arr = this.aiMessages.get(conversationId) ?? []
    arr.push(m)
    this.aiMessages.set(conversationId, arr)
    const c = this.aiConversations.get(conversationId)
    if (c) c.updatedAt = new Date()
    return m
  }
  async getAIMessages(conversationId: string) {
    return this.aiMessages.get(conversationId) ?? []
  }

  async createReport(report: Omit<Report, "id" | "createdAt">) {
    const id = uuidv4()
    const r: Report = { id, ...report, createdAt: new Date() }
    this.reports.set(id, r)
    return r
  }
  async getReports(businessId: string) {
    return [...this.reports.values()].filter((r) => r.businessId === businessId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async writeAuditLog(userId: string | null, action: string, entity: string, entityId: string | null, meta?: string) {
    this.auditLogs.push({ id: uuidv4(), userId, action, entity, entityId, meta: meta ?? null, createdAt: new Date() })
  }
}

/* ------------------------------------------------------------------ */
/* Demo data seeding                                                  */
/* ------------------------------------------------------------------ */

const DEMO_EMAIL = process.env.DEMO_EMAIL || "demo@balans.ai"
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "DemoBALANS123!"

export async function seedDemo(storage: Storage) {
  const existing = await storage.getUserByEmail(DEMO_EMAIL)
  if (existing) return existing

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12)
  const user = await storage.createUser(DEMO_EMAIL, passwordHash)
  await storage.upsertProfile(user.id, { fullName: "Demo Foydalanuvchi", language: "uz" })
  const business = await storage.createBusiness(user.id, {
    name: "O'ztemon MCHJ",
    type: "Do'kon savdo",
    taxId: "123456789",
    currency: "USD",
  })

  const now = new Date()
  const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 24 * 60 * 60 * 1000)
  const iso = (d: Date) => d.toISOString().slice(0, 10)

  const demoTransactions: Omit<Transaction, "id" | "createdAt" | "updatedAt">[] = [
    { businessId: business.id, type: "income", description: "Savdo daromadi", amount: 8400000, currency: "USD", date: iso(addDays(now, -5)), categoryId: null, categoryName: "Savdo", paymentMethod: "Naqd", notes: null },
    { businessId: business.id, type: "income", description: "Xizmat to'lovi", amount: 12500000, currency: "USD", date: iso(addDays(now, -3)), categoryId: null, categoryName: "Xizmatlar", paymentMethod: "Karta", notes: null },
    { businessId: business.id, type: "expense", description: "Dukon ijarasi", amount: -6500000, currency: "USD", date: iso(addDays(now, -10)), categoryId: null, categoryName: "Ijara", paymentMethod: "Naqd", notes: null },
    { businessId: business.id, type: "expense", description: "Ish haqlari", amount: -14000000, currency: "USD", date: iso(addDays(now, -8)), categoryId: null, categoryName: "Ish haqi", paymentMethod: "Karta", notes: null },
    { businessId: business.id, type: "expense", description: "Marketing", amount: -3200000, currency: "USD", date: iso(addDays(now, -4)), categoryId: null, categoryName: "Marketing", paymentMethod: "Karta", notes: null },
    { businessId: business.id, type: "income", description: "Onlayn savdo", amount: 5600000, currency: "USD", date: iso(addDays(now, -1)), categoryId: null, categoryName: "Savdo", paymentMethod: "Naqd", notes: null },
    { businessId: business.id, type: "expense", description: "O'qituvchi to'lovi", amount: -2100000, currency: "USD", date: iso(addDays(now, -2)), categoryId: null, categoryName: "Xizmatlar", paymentMethod: "Naqd", notes: null },
    { businessId: business.id, type: "income", description: "Konsultatsiya", amount: 7800000, currency: "USD", date: iso(addDays(now, -6)), categoryId: null, categoryName: "Xizmatlar", paymentMethod: "Karta", notes: null },
  ]

  for (const tx of demoTransactions) {
    await storage.createTransaction(business.id, tx)
  }

  await storage.upsertSubscription(business.id, { plan: "premium", status: "active", price: 49000, currency: "USD", currentPeriodEnd: addDays(now, 30) })
  await storage.createNotification(user.id, "Xush kelibsiz", "Demo hisobingiz tayyor. Barcha ma'lumotlar fikr etilgan.")
  await storage.writeAuditLog(user.id, "demo.seeded", "system", null, "demo data loaded")

  return user
}

/* ------------------------------------------------------------------ */
/* Shared instance                                                    */
/* ------------------------------------------------------------------ */

export let storage: Storage

export function getStorage(): Storage {
  if (!storage) {
    storage = new InMemoryStorage()
    void seedDemo(storage)
  }
  return storage
}

/**
 * PostgreSQL storage is intentionally not implemented here. It requires
 * DATABASE_URL and the @neondatabase/serverless (or pg) package. The
 * schema is documented in prisma/schema.prisma. Set USE_POSTGRES=true
 * and implement PostgresStorage to switch.
 */
