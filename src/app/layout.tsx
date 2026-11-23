import type { Metadata } from "next"
import "./globals.css"
import { TranslationProvider } from "@/i18n/providers"
import { Toaster } from "@/components/ui/toast"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "BALANS AI — Intelligent Financial Operating System",
  description:
    "BALANS AI brings your income, expenses, cash flow and business performance into one intelligent workspace — helping you make better financial decisions with confidence.",
  openGraph: {
    title: "BALANS AI — Intelligent Financial Operating System",
    description:
      "BALANS AI brings your income, expenses, cash flow and business performance into one intelligent workspace.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="antialiased">
        <Suspense fallback={null}>
          <TranslationProvider defaultLanguage="uz">
            {children}
            <Toaster />
          </TranslationProvider>
        </Suspense>
      </body>
    </html>
  )
}
