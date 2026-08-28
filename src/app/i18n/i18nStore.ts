import { create } from 'zustand'

export type Language = 'vi' | 'en'

const LANG_KEY = 'sos_admin_lang'
const DEFAULT_LANG: Language = 'vi'

function detectInitialLanguage(): Language {
  const stored = localStorage.getItem(LANG_KEY)
  if (stored === 'vi' || stored === 'en') return stored

  const nav = typeof navigator !== 'undefined' ? navigator.language : ''
  if (nav.toLowerCase().startsWith('en')) return 'en'
  return DEFAULT_LANG
}

interface I18nState {
  lang: Language
  setLang: (lang: Language) => void
}

export const i18nStore = create<I18nState>((set) => ({
  lang: detectInitialLanguage(),
  setLang: (lang) => {
    localStorage.setItem(LANG_KEY, lang)
    set({ lang })
  },
}))

