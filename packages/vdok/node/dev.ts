import fs from "fs"

import { startViteServer } from "./vite"
import { deleteAllFiles } from "./utils"
import { initialBuild } from "./actions"
import { dotVdokDirPath, rawDocsPath, rawPackageJsonPath } from "./constants"

export async function runDev() {
    // 检查仓库是否属于 vdok 项目
    if (fs.existsSync(rawPackageJsonPath)) {
        const { vdok } = JSON.parse(
            fs.readFileSync(rawPackageJsonPath, { encoding: "utf-8" })
        )

        if (!vdok) {
            throw new Error("Current Project is not Vdok Project!")
        }
    } else {
        throw new Error("No package.json found in this project!")
    }

    // 检查 docs 目录
    if (!fs.existsSync(rawDocsPath)) {
        throw new Error("No docs folder found in this project!")
    }

    // 检查 .vdok 目录, 不管有没有都初始化
    if (fs.existsSync(dotVdokDirPath)) {
        deleteAllFiles(dotVdokDirPath)
    }

    initialBuild()

    // 启动 vite 服务
    // await startViteServer()

    // 监听文件修改
}
