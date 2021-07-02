/**
 * 预处理器: 分割yaml拓展语法特性
 * @param markdown markdown原文内容
 */
export function DivideFeatures(markdown: string): Array<string> {
    const yamlRegExp = /^---([\s\S]*)---\n/
    const reg = yamlRegExp.exec(markdown) as RegExpExecArray

    if (!!reg) {
        return [reg[1].trim(), markdown.replace(yamlRegExp, "").trim()]
    }
    return ["", markdown]
}
