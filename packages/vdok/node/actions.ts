import fs from "fs"
import path from "path"
import { md5 } from "hash-wasm"

import { readVdokConfig } from "./config"
import { generateRoutes } from "./routes"

const cwd = process.cwd()

const dotVdokDir = path.join(cwd, ".vdok")

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
 * Vdok配置模板
 */
const VdokConfigTemplate = String.raw` // Vdok Config File through automatic generation

export default defineConfig(/* Inject-Vdok-Config-Here */)
`

/**
 * 写入配置文件
 */
async function writeVdokConfig() {
    generateDotVdok()
    const filePath = path.join(dotVdokDir, "vdok.config.ts")
    const writeContent = VdokConfigTemplate.replace(
        "/* Inject-Vdok-Config-Here */",
        readVdokConfig()
    )
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, { encoding: "utf-8" })
        if (!!content && (await md5(content)) === (await md5(writeContent))) {
            return
        }
    }
    fs.writeFileSync(filePath, writeContent)
}

async function writeRoutesInfos() {
    // 写入 routes 配置文件
    // 模板需要判断i18n的状态
}

/**
 * 移动Vdok的配置文件
 */
export function copyVdokConfig() {}

/**
 * 移动文本文件, 考虑性能优化
 */
function copyDocs() {}

/**
 * 初始化构建移动操作
 */
export function initialBuild() {}
