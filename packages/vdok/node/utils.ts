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