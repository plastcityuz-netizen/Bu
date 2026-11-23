"use client"

import * as React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/i18n/providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"

const schema = z
  .object({
    fullName: z.string().min(2, "Ism kamida 2 belgi bo'lishi kerak"),
    email: z.string().email("Noto'g'ri elektron poчta manzili"),
    password: z.string().min(8, "Parol kamida 8 belgi bo'lishi kerak"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((v) => v === true, "Shartlarga rozilish kerak"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Parollar mos kelmaydi",
    path: ["confirmPassword"],
  })

export function RegisterForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "", terms: false },
  })

  const passwordStrength = (pw: string) => {
    let score = 0
    if (pw.length >= 8) score++
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
    if (/\d/.test(pw)) score++
    if (/[^a-zA-Z\d]/.test(pw)) score++
    return score
  }

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: values.fullName, email: values.email, password: values.password }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json?.error || "Ro'yxatdan o'tishda xatolik")
        return
      }
      router.push("/app/dashboard")
    } catch {
      setError("Server xatosi yuz berdi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full w-[460px]">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl">{t("auth.registerTitle")}</CardTitle>
          <CardDescription>{t("auth.registerSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Xatolik</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t("auth.fullName")}</Label>
              <Input id="fullName" placeholder={t("auth.fullNamePlaceholder")} {...form.register("fullName")} />
              {form.formState.errors.fullName && (
                <p className="text-xs text-destructive">{form.formState.errors.fullName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" type="email" placeholder={t("auth.emailPlaceholder")} {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input id="password" type="password" placeholder={t("auth.passwordPlaceholder")} {...form.register("password")} />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Kuch:
                <span className="ml-1 font-medium">
                  {["Juda qisqa", "Qisqa", "O'rtacha", "Yaxshi", "Kuchli"][passwordStrength(form.getValues("password")) ?? 0] ||
                    "-"}
                </span>
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
              <Input id="confirmPassword" type="password" placeholder={t("auth.confirmPasswordPlaceholder")} {...form.register("confirmPassword")} />
              {form.formState.errors.confirmPassword && (
                <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>
            <div className="flex items-start gap-2">
              <Checkbox id="terms" {...form.register("terms")} />
              <div className="text-sm text-muted-foreground leading-none">
                {t("auth.termsText1")} <Link href="/terms" className="text-primary underline">{t("auth.termsLink")}</Link>{" "}
                {t("auth.termsText2")} <Link href="/privacy" className="text-primary underline">{t("auth.privacyLink")}</Link>.
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("common.saving") : t("auth.registerButton")}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 text-center">
          <p className="text-sm text-muted-foreground">
            {t("auth.haveAccount")} <Link href="/login" className="text-primary hover:underline font-medium">{t("nav.login")}</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
