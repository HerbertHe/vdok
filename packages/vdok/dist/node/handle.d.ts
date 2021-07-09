import { IArticleFeatures } from "./analyzers";
export interface IEffectiveFilesSectionIndex {
    exist: boolean;
    feats?: IArticleFeatures;
    markdown?: string;
}
export declare type BackFileItemType = [string, IArticleFeatures, string];
export interface IEffectiveFilesSection {
    title: string;
    name: string;
    index: IEffectiveFilesSectionIndex;
    files: Array<BackFileItemType>;
}
export interface IEffectiveFilesSectionWithLang {
    lang: string;
    sections: Array<IEffectiveFilesSection>;
}
/**
 * 文件处理
 * @param files 发现的文件
 */
export declare function handleFiles(files: Array<string>): Array<BackFileItemType>;
/**
 * 有效文件处理
 */
export declare function handleEffectiveFiles(): Array<IEffectiveFilesSectionWithLang>;
