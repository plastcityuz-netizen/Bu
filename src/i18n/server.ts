import { getDictionary, DEFAULT_LANGUAGE, type Language } from "./registry"

export function getStaticTranslations(language: Language = DEFAULT_LANGUAGE) {
  return getDictionary(language)
}

export { DEFAULT_LANGUAGE, type Language }
