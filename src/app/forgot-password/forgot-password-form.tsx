"use client"

import * as React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslation } from "@/i18n/providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const schema = z.object({
  email: z.string().email("Noto'g'ri elektron poчta manzili"),
})

export function ForgotPasswordForm() {
  const { t } = useTranslation()
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle")
  const [error, setError] = React.useState<string | null>(null)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setError(null)
    setStatus("submitting")
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json?.error || "Xatolik yuz berdi")
        setStatus("error")
        return
      }
      setStatus("success")
    } catch {
      setError("Server xatosi yuz berdi")
      setStatus("error")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full w-[420px]">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl">{t("auth.forgotTitle")}</CardTitle>
          <CardDescription>{t("auth.forgotSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          {status === "success" ? (
            <div className="space-y-4 text-center">
              <Alert>
                <AlertTitle>Yuborildi</AlertTitle>
                <AlertDescription>{t("auth.forgotSuccess")}</AlertDescription>
              </Alert>
              <Button asChild>
                <a href="/login">{t("nav.login")}</a>
              </Button>
            </div>
          ) : (
            <>
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Xatolik</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("auth.email")}</Label>
                  <Input id="email" type="email" placeholder={t("auth.emailPlaceholder")} {...form.register("email")} />
                  {form.formState.errors.email && (
                    <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={status === "submitting"}>
                  {status === "submitting" ? t("common.saving") : t("auth.forgotButton")}
                </Button>
              </form>
            </>
          )}
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
