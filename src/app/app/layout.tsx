import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TranslationProvider } from "@/i18n/providers"
import { AppShell } from "@/components/app/app-shell"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect("/login")
  return (
    <TranslationProvider defaultLanguage="uz">
      <AppShell>{children}</AppShell>
    </TranslationProvider>
  )
}
