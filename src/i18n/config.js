import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import frCommon from './locales/fr/common.js'
import frQuickref from './locales/fr/quickref.js'
import frStructure from './locales/fr/structure.js'
import frChangelog from './locales/fr/changelog.js'
import frControls from './locales/fr/controls.js'
import enCommon from './locales/en/common.js'
import enQuickref from './locales/en/quickref.js'
import enStructure from './locales/en/structure.js'
import enChangelog from './locales/en/changelog.js'
import enControls from './locales/en/controls.js'

export const I18N_LANGUAGES = ['fr', 'en']
export const I18N_DEFAULT_LANGUAGE = 'fr'
export const I18N_STORAGE_KEY = 'torso-t1-manual.language'

function normalizeLanguage(input) {
  if (!input) return null
  const normalized = String(input).toLowerCase().split('-')[0]
  return I18N_LANGUAGES.includes(normalized) ? normalized : null
}

function resolveInitialLanguage() {
  if (typeof window === 'undefined') return I18N_DEFAULT_LANGUAGE

  const storedLanguage = normalizeLanguage(window.localStorage.getItem(I18N_STORAGE_KEY))
  if (storedLanguage) return storedLanguage

  const browserLanguage = String(window.navigator.language || '').toLowerCase()
  return browserLanguage.startsWith('fr') ? 'fr' : 'en'
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        common: frCommon,
        quickref: frQuickref,
        structure: frStructure,
        changelog: frChangelog,
        controls: frControls,
      },
      en: {
        common: enCommon,
        quickref: enQuickref,
        structure: enStructure,
        changelog: enChangelog,
        controls: enControls,
      },
    },
    lng: resolveInitialLanguage(),
    fallbackLng: I18N_DEFAULT_LANGUAGE,
    defaultNS: 'common',
    ns: ['common', 'quickref', 'structure', 'changelog', 'controls'],
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  })

export default i18n
