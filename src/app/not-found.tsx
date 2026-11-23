import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PublicHeader } from "@/components/public/header"
import { PublicFooter } from "@/components/public/footer"

export const metadata = {
  title: "Sahifa topilmadi — BALANS AI",
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicHeader />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold tracking-tight text-foreground">404</h1>
          <p className="text-lg text-muted-foreground mt-4">Siz qidirayotgan sahifa topilmadi.</p>
          <div className="mt-8 flex items-center gap-4">
            <Button asChild>
              <Link href="/">Bosh sahifaga qaytish</Link>
            </Button>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
