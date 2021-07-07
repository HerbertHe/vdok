import fs from "fs"
import path from "path"
import { readVdokConfig } from "./config"

const cwd = process.cwd()

const dotVdokDir = path.join(cwd, ".vdok")

/**
 * 删除文件
 * @param p 路径
 */
function deleteAllFiles(p: string) {
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
 * 本地生成 .vdok 临时文件夹
 */
function generateDotVdok() {
    if (!fs.existsSync(dotVdokDir)) {
        // 生成文件夹
        fs.mkdirSync(dotVdokDir, { recursive: true })
    }
    return
}

/**
 * 移动Vdok的配置文件
 * TODO: 利用 hash 优化 io 操作性能
 */
export function copyVdokConfig() {
    generateDotVdok()
    const filePath = path.join(dotVdokDir, "vdok.config.yml")
    if (fs.existsSync(filePath)) {
        // 比较 hash 再进行可能的写入操作
        deleteAllFiles(filePath)
    }

    fs.writeFileSync(filePath, readVdokConfig())
}

/**
 * 移动文本文件, 考虑性能优化
 */
function copyDocs() {}

/**
 * 写入配置文件
 */
function writeVdokConfig() {}

/**
 * 初始化构建移动操作
 */
export function initialBuild() {}
