import { createI18n } from 'vue-i18n'

import Common, { StringDict } from '../lib/common'

const i18n = createI18n({
    locale: Common.getData('lang') || 'zh',
    fallbackLocale: 'zh',
    globalInjection: true,
    silentTranslationWarn: true,
    messages: {}
})

export function setI18nDict (dict: StringDict) {
    i18n.global.mergeLocaleMessage('zh', dict.zh || {})
    i18n.global.mergeLocaleMessage('en', dict.en || {})
}

export default i18n
