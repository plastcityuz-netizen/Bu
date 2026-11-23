import type { Metadata } from "next"
import { LoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Kirish — BALANS AI",
  description: "BALANS AI hisobingizga kiring.",
}

export default function LoginPage() {
  return <LoginForm />
}
