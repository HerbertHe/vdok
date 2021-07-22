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

/**
 * 全文转化 hack 实现
 */
export function ConvertHeadingMagic(markdown: string): string {
    return markdown.replace(/\{\#/g, "$")
}

/**
 * 锚点分析
 */
export function ConvertAnchorMagic(text: string): Array<string> {
    const anchorRegExp = /\$([^\n]+)\}/
    let anchor: string = ""
    const anchorArray = text.match(anchorRegExp)
    if (!anchorArray) {
        anchor = ""
    } else {
        anchor = anchorArray[1]
    }
    const _anchor = !anchor ? text : anchor
    return [_anchor, text.replace(anchorRegExp, "")]
}
