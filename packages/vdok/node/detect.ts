import fs from "fs"
import path from "path"
import { isI18nMode, isIncludedInBCP47 } from "./is"

/**
 * 命令行执行路径
 */
const cwd = process.cwd()

/**
 * 在i18n模式下侦测
 */
function detectInI18nMode(): [Array<string>, Array<string>] {
    const p = path.join(cwd, "docs")
    let _dirs: Array<string> = []
    let _files: Array<string> = []

    const fd = fs.readdirSync(p)

    fd.forEach((item) => {
        const tmp = path.join(p, item)
        const isDir = fs.lstatSync(tmp).isDirectory()

        // 为i18n模式的目录
        if (isDir && isIncludedInBCP47(item)) {
            // 完整路径
            _dirs.push(tmp)
        }

        // 文件
        if (!isDir) {
            _files.push(tmp)
        }

        // 不是i18n文件夹忽略掉
    })

    return [_files, _dirs]
}

/**
 * 不在i18n模式下
 */
function detectNotInI18nMode(): [Array<string>, Array<string>] {
    const p = path.join(cwd, "docs")
    let _dirs: Array<string> = []
    let _files: Array<string> = []

    const fd = fs.readdirSync(p)

    fd.forEach((item) => {
        const tmp = path.join(p, item)
        const isDir = fs.lstatSync(tmp).isDirectory()

        if (isDir) {
            _dirs.push(tmp)
        } else {
            _files.push(tmp)
        }
    })

    return [_files, _dirs]
}

/**
 * 递归获取所有 markdown 的文件
 * @param dirp 文件夹完整路径
 */
function detectAllFiles(dirp: string) {
    let _files: Array<string> = []
    const mdRegExp = /.md$/
    const fd = fs.readdirSync(dirp)

    fd.forEach((item) => {
        const p = path.join(dirp, item)
        const isDir = fs.lstatSync(p).isDirectory()
        if (isDir) {
            // 递归
            _files.push(...detectAllFiles(p))
        } else if (mdRegExp.test(item)) {
            _files.push(p)
        }
    })

    return _files
}

export function detectEffectiveFiles() {
    const p = path.join(cwd, "docs")
    if (!fs.existsSync(p)) {
        // TODO 扔出错误
        throw new Error("No /docs dir Found!")
    }

    // 判断是否处于i18n模式
    if (isI18nMode(cwd)) {
        detectInI18nMode()
    } else {
        detectNotInI18nMode()
    }
}
