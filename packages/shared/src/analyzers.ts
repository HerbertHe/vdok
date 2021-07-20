const YAML = require("yaml")

/**
 * 分割yaml拓展语法特性
 * @param markdown markdown原文内容
 */
export function DivideFeatures(markdown: string): Array<string> {
    const yamlRegExp = /^---([\s\S]*)---\n/
    const reg = yamlRegExp.exec(markdown) as RegExpExecArray

    if (!!reg) {
        const yamlContent = reg[1].trim()
        const markdownContent = markdown.replace(yamlRegExp, "").trim()
        return [yamlContent, markdownContent]
    }
    return ["", markdown.trim()]
}

/**
 * 文章的 yaml features
 * @param title 自定义标题文件
 * @param order 文档排序
 */
export interface IArticleFeatures {
    title?: string
    order?: number
}

/**
 * 分析文本的拓展特性
 * @param yml yaml features
 */
export function analyzeArticleFeatures(yml: string): IArticleFeatures {
    if (!!yml) {
        const ans = YAML.parse(yml) as IArticleFeatures
        let _re: IArticleFeatures = {}
        _re.title = !!ans.title ? ans.title : ""
        _re.order = !!ans.order ? ans.order : 0
        return _re
    }
    return {
        title: "",
        order: 0,
    } as IArticleFeatures
}

/**
 * 分析文章
 * @param content 原文内容
 */
export function analyzerArticle(content: string): [IArticleFeatures, string] {
    const [features, markdown] = DivideFeatures(content)
    const feats = analyzeArticleFeatures(features)
    return [feats, markdown]
}
