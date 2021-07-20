// 自定义修改vite设置
import fs from "fs"

const { createServer, build } = require("vite")
import { distPath, dotVdokDirPath, vdokViteConfigPath } from "./constants"

/**
 * Vite 开发服务器启动
 */
export async function startViteServer() {
    // 检查.vdok目录是否存在
    if (!fs.existsSync(dotVdokDirPath)) {
        throw new Error("Folder .vdok Not Found!")
    }
    // 检查配置文件是否存在
    if (!fs.existsSync(vdokViteConfigPath)) {
        throw new Error("No Vite Config File Found!")
    }

    const server = await createServer({
        configFile: vdokViteConfigPath,
        root: dotVdokDirPath,
    })

    await server.listen()
}

/**
 * TODO: Vite 构建
 */
export async function buildByVite() {
    if (!fs.existsSync(dotVdokDirPath)) {
        throw new Error("Folder .vdok Not Found!")
    }

    await build({
        root: dotVdokDirPath,
        build: {
            outDir: distPath,
        },
    })
}
