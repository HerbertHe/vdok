import * as YAML from "yaml"

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
 * @param draft 草稿
 */
// TODO draft (仅开发模式会显示, 生产模式会忽略路由生成相关)
export interface IArticleFeatures {
    title?: string
    order?: number
    draft?: boolean
}

/**
 * 分析文本的拓展特性
 * @param yml yaml features
 */
export function analyzeArticleFeatures(yml: string): IArticleFeatures {
    if (!!yml) {
        const ans = YAML.parse(yml) as IArticleFeatures
        let _re: IArticleFeatures = {}
        _re.title = ans.title || ""
        _re.order = ans.order || -1
        _re.draft = ans.draft || false
        return _re
    }

    return {
        title: "",
        order: -1,
        draft: false,
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
