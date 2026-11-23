"use client"

import * as React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import type { Language } from "./registry"
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  getDictionary,
  isSupportedLanguage,
  t,
} from "./registry"

const LANGUAGE_STORAGE_KEY = "balans-language"
const LANGUAGE_COOKIE_KEY = "balans-locale"

interface TranslationProviderProps {
  children: React.ReactNode
  defaultLanguage?: Language
}

export function TranslationProvider({ children, defaultLanguage = DEFAULT_LANGUAGE }: TranslationProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = typeof localStorage !== "undefined" ? localStorage.getItem(LANGUAGE_STORAGE_KEY) : null
    if (stored && isSupportedLanguage(stored)) {
      setLanguageState(stored)
      return
    }
    if (typeof navigator !== "undefined") {
      const navLang = navigator.language.toLowerCase()
      if (navLang.startsWith("uz")) {
        setLanguageState("uz")
      } else if (navLang.startsWith("ru")) {
        setLanguageState("ru")
      }
    }
  }, [])

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, next)
      try {
        document.cookie = `${LANGUAGE_COOKIE_KEY}=${next}; path=/; max-age=31536000; SameSite=Lax`
      } catch {
        // ignore cookie errors in tests/SSR
      }
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = next
      document.documentElement.dir = LANGUAGES.find((l) => l.code === next)?.dir ?? "ltr"
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.lang = language
    document.documentElement.dir = LANGUAGES.find((l) => l.code === language)?.dir ?? "ltr"
  }, [language, mounted])

  const dictionary = useMemo(() => getDictionary(language), [language])

  const translate = useCallback(
    (key: string, params?: Record<string, string | number>) => t(dictionary, key, params),
    [dictionary],
  )

  const current = useMemo(
    () => LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0],
    [language],
  )

  const value = useMemo(
    () => ({ language, setLanguage, t: translate, current, languages: LANGUAGES, mounted }),
    [language, setLanguage, translate, current, mounted],
  )

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>
}

interface TranslationContextValue {
  language: Language
  setLanguage: (next: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
  current: { code: Language; label: string; dir: "ltr" | "rtl" }
  languages: { code: Language; label: string; dir: "ltr" | "rtl" }[]
  mounted: boolean
}

const TranslationContext = React.createContext<TranslationContextValue | null>(null)

export function useTranslation() {
  const context = React.useContext(TranslationContext)
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}

export function getStaticTranslations(language: Language = DEFAULT_LANGUAGE) {
  return getDictionary(language)
}

export { DEFAULT_LANGUAGE, LANGUAGES }
export type { Language }
