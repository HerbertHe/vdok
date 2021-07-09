/**
 * 分割yaml拓展语法特性
 * @param markdown markdown原文内容
 */
export declare function DivideFeatures(markdown: string): Array<string>;
/**
 * 文章的 yaml features
 * @param title 自定义标题文件
 * @param order 文档排序
 */
export interface IArticleFeatures {
    title?: string;
    order?: number;
}
/**
 * 分析文本的拓展特性
 * @param yml yaml features
 */
export declare function analyzeArticleFeatures(yml: string): IArticleFeatures;
/**
 * 分析文章
 * @param content 原文内容
 */
export declare function analyzerArticle(content: string): [IArticleFeatures, string];
