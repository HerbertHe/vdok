import path from "path"
import fs from "fs"

import { startViteServer } from "./vite"
import { deleteAllFiles } from "./utils"
import { initialBuild } from "./actions"


const cwd = process.cwd()

const PackageJSONPath = path.join(cwd, "package.json")
const DocsPath = path.join(cwd, "docs")
const DotVdokPath = path.join(cwd, ".vdok")

export async function runDev() {
    // 检查仓库是否属于 vdok 项目
    if (fs.existsSync(PackageJSONPath)) {
        const { vdok } = JSON.parse(
            fs.readFileSync(PackageJSONPath, { encoding: "utf-8" })
        )

        if (!vdok) {
            throw new Error("Current Project is not Vdok Project!")
        }
    } else {
        throw new Error("No package.json found in this project!")
    }

    // 检查 docs 目录
    if (!fs.existsSync(DocsPath)) {
        throw new Error("No docs folder found in this project!")
    }

    // 检查 .vdok 目录, 不管有没有都初始化
    if (fs.existsSync(DotVdokPath)) {
        deleteAllFiles(DotVdokPath)
    }

    initialBuild()

    // 启动 vite 服务
    await startViteServer()

    // 监听文件修改
}
