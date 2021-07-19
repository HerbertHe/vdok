import {
    bgBlue,
    green,
    yellow,
    magentaBright,
    bgGreen,
    bgRed,
    red,
    bgCyan,
    cyan,
    bgMagenta,
    magenta,
    blue,
    bold,
} from "chalk"
import fs from "fs"
import path from "path"

/**
 * 删除文件
 * @param p 路径
 */
export function deleteAllFiles(p: string) {
    if (fs.existsSync(p)) {
        const files = fs.readdirSync(p)
        files.forEach((f) => {
            const tP = path.join(p, f)
            const stat = fs.lstatSync(tP)
            const isDir = stat.isDirectory()
            const isLink = stat.isSymbolicLink()
            if (isDir && !isLink) {
                deleteAllFiles(tP)
            } else {
                fs.unlinkSync(tP)
            }
        })
        fs.rmdirSync(p)
    }
}

/**
 * 文件夹递归复制
 */
export function copyDirectory(src: string, dest: string) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true })
    }

    const fS = fs.readdirSync(src)
    fS.forEach((item) => {
        const p = path.join(src, item)
        const isDir = fs.lstatSync(p).isDirectory()

        if (isDir) {
            copyDirectory(p, path.join(dest, item))
        } else {
            fs.copyFileSync(p, path.join(dest, item))
        }
    })
}

/**
 * debug 警告输出
 * @param warning
 * @returns
 */
export function debugWarning(warning: string): string {
    return `${yellow(warning)}\n`
}

/**
 * debug 信息输出
 * @param title
 * @param info
 * @returns
 */
export function debugInfo(title: string, info?: string): string {
    return `${bgBlue(title)} >>> \n${!!info ? `${magentaBright(info)}\n` : ""}`
}

/**
 * debug 内容输出
 * @param content
 * @returns
 */
export function debugExport(content: string): string {
    return `${green(content)}\n`
}

/**
 * 监视文件添加
 * @param p
 * @param type
 * @returns
 */
export function watchExportAdd(
    p: string,
    type: "file" | "dir" = "file"
): string {
    return `${bgGreen(" Add ")}${bgBlue(
        ` ${type.length === 3 ? type + " " : type} `
    )} >>> ${green(p)}`
}

/**
 * 监视文件删除
 * @param p
 * @param type
 * @returns
 */
export function watchExportUnlink(
    p: string,
    type: "file" | "dir" = "file"
): string {
    return `${bgRed(" Unlink ")}${bgBlue(
        ` ${type.length === 3 ? type + " " : type} `
    )} >>> ${red(p)}`
}

/**
 * 监视文件修改
 * @param p
 * @returns
 */
export function watchExportChange(p: string): string {
    return `${bgCyan(" Change ")} >>> ${cyan(p)}`
}

export function exportLabel(label: string): string {
    return `${bgMagenta(" TASK ")}  ${magenta(label)}`
}

export function exportPass(content: string): string {
    return `${bgGreen(" PASS ")}  ${green(content)}`
}

export function exportMode(mode: "i18n" | "normal" = "normal"): string {
    return `${bgBlue(" MODE ")}  ${bold(blue(mode))}`
}

export function exportUpdate(content: string): string {
    return `${bgMagenta(" UPDATE ")}  ${blue(content)}`
}
