/**
 * 符合BCP47规范
 */
export declare function isIncludedInBCP47(tag: string): boolean;
export declare function isI18nMode(cwd: string): boolean;
/**
 * 判断路径下是否存在_index.md
 * @param p 传入路径
 */
export declare function exist_indexInPath(p: string): boolean;
