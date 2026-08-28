import { useMemo } from 'react'
import { i18nStore, type Language } from './i18nStore'
import { translations, type TranslationKey } from './translations'

export function useT() {
  const lang = i18nStore((s) => s.lang)

  const t = useMemo(() => {
    return (key: TranslationKey) => translations[lang][key] ?? translations.vi[key]
  }, [lang])

  return t
}

export function getT(lang: Language) {
  return (key: TranslationKey) => translations[lang][key] ?? translations.vi[key]
}

