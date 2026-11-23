import type { Metadata } from "next"
import { RegisterForm } from "./register-form"

export const metadata: Metadata = {
  title: "Ro'yxatdan o'tish — BALANS AI",
  description: "BALANS AI da yangi hisob yarating.",
}

export default function RegisterPage() {
  return <RegisterForm />
}
