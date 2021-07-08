import fs from "fs"
import path from "path"

import tags from "language-tags"

/**
 * 符合BCP47规范
 */
export function isIncludedInBCP47(tag: string): boolean {
    return tags(tag).valid()
}

export function isI18nMode(cwd: string): boolean {
    const dirs = fs.readdirSync(path.join(cwd, "docs")).filter((item) => {
        const p = path.join(path.join(cwd, "docs"), item)
        return fs.lstatSync(p).isDirectory()
    })

    // 过滤没有文件夹的情况
    if (dirs.length === 0) {
        return false
    }

    // 判断i18n模式, 只要一个文件夹名称符合就自动启动
    for (let i = 0; i < dirs.length; i++) {
        if (isIncludedInBCP47(dirs[i])) {
            return true
        }
    }
    return false
}

/**
 * 判断路径下是否存在_index.md
 * @param p 传入路径
 */
export function exist_indexInPath(p: string): boolean {
    const ab = path.join(p, "_index.md")
    if (fs.existsSync(ab)) {
        return true
    }
    return false
}
