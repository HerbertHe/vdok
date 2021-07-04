/**
 * 锚点URL规范化
 * https://github.com/vuejs/vitepress/blob/master/src/node/markdown/plugins/slugify.ts
 */
import { normalizeSync } from "normalize-diacritics"
const rControl = /[\u0000-\u001f]/g
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'<>,.?/]+/g

export function ConvertAnchor(text: string) {
    return normalizeSync(text)
        .replace(rControl, "")
        .replace(rSpecial, "-")
        .replace(/\-{2,}/g, "-")
        .replace(/^\-+|\-+$/g, "")
        .replace(/^(\d)/, "_$1")
        .toLowerCase()
}
