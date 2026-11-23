import uz from "./locales/uz"
import ru from "./locales/ru"

export type Language = "uz" | "ru"

export const DEFAULT_LANGUAGE: Language = "uz"

export const LANGUAGES: { code: Language; label: string; dir: "ltr" | "rtl" }[] = [
  { code: "uz", label: "O'zbekcha", dir: "ltr" },
  { code: "ru", label: "Русский", dir: "ltr" },
]

export const LOCALES: Record<Language, Record<string, unknown>> = {
  uz,
  ru,
}

export function getDictionary(language: Language) {
  return LOCALES[language] ?? LOCALES[DEFAULT_LANGUAGE]
}

export function isSupportedLanguage(lang: string): lang is Language {
  return lang === "uz" || lang === "ru"
}

/**
 * Resolve a dot-notation key inside a translation dictionary.
 * Supports {{param}} interpolation.
 */
export function t(
  dictionary: Record<string, unknown>,
  key: string,
  params: Record<string, string | number> = {}
): string {
  const parts = key.split(".")
  let current: unknown = dictionary
  for (const part of parts) {
    if (!current || typeof current !== "object" || !(part in current)) {
      return key
    }
    current = (current as Record<string, unknown>)[part]
  }
  if (typeof current !== "string") {
    return key
  }
  return current.replace(/\{\{(\w+)\}}/g, (_match, name) => {
    const value = params[name]
    return value !== undefined ? String(value) : `{{${name}}}`
  })
}
