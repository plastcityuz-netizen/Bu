import type { Metadata } from "next"
import { ForgotPasswordForm } from "./forgot-password-form"

export const metadata: Metadata = {
  title: "Parolni tiklash — BALANS AI",
  description: "Parolni tiklash uchun poчta manzil kiriting.",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
