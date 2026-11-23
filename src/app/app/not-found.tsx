"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AppNotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-6xl font-bold tracking-tight text-foreground">404</h1>
      <p className="text-lg text-muted-foreground mt-4">Sahifa topilmadi</p>
      <div className="mt-8 flex items-center gap-4">
        <Button asChild>
          <Link href="/app/dashboard">Boshqaruv paneliga qaytish</Link>
        </Button>
      </div>
    </div>
  )
}
