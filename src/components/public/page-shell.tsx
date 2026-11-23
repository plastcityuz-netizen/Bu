"use client"

import * as React from "react"
import { PublicHeader } from "./header"
import { PublicFooter } from "./footer"

interface PageShellProps {
  title: string
  description: string
  children: React.ReactNode
}

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  )
}
