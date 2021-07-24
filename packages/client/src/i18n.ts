/**
 * See https://react.i18next.com/guides/quick-start
 */
import i18n from "i18next"

import Detector from "i18next-browser-languagedetector"
import Backend from "i18next-http-backend"

import { initReactI18next } from "react-i18next"

const backend = new Backend(null, {
    crossDomain: true,
})

i18n
    /**
     * https://github.com/i18next/i18next-browser-languageDetector
     */
    .use(Detector)
    /**
     * https://github.com/i18next/i18next-http-backend
     */
    .use(backend)
    .use(initReactI18next)
    .init({
        debug: false,
        fallbackLng: "en-US",
        interpolation: {
            escapeValue: false,
        },
        load: "currentOnly",
    })

// TODO 更新 cli 工具处理 locales 文件夹, 并做好 en-US 和 zh-CN 语言的直接翻译支持

export default i18n
