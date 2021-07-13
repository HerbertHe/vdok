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
            const isDir = fs.lstatSync(tP).isDirectory()
            if (isDir) {
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
