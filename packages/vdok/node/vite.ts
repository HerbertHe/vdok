// 自定义修改vite设置
import path from "path"
import fs from "fs"

const { createServer, build } = require("vite")

import { deleteAllFiles } from "./utils"

/**
 * 定义常量
 */
const cwd = process.cwd()

const root = path.join(cwd, ".vdok")
const ViteConfigFile = path.join(cwd, ".vdok", "vite.config.ts")
const buildDir = path.join(cwd, "dist")

/**
 * Vite 开发服务器启动
 */
export async function startViteServer() {
    // 检查.vdok目录是否存在
    if (!fs.existsSync(root)) {
        throw new Error("Folder .vdok Not Found!")
    }
    // 检查配置文件是否存在
    if (!fs.existsSync(ViteConfigFile)) {
        throw new Error("No Vite Config File Found!")
    }

    const server = await createServer({
        configFile: ViteConfigFile,
        root: root,
    })

    await server.listen()
}

/**
 * Vite 构建
 */
export async function buildByVite() {
    if (!fs.existsSync(root)) {
        throw new Error("Folder .vdok Not Found!")
    }

    deleteAllFiles(root)

    await build({
        root: root,
        build: {
            outDir: buildDir,
        },
    })
}
