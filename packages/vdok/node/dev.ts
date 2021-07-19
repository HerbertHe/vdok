import fs from "fs"

import { startViteServer } from "./vite"
import { debugInfo, deleteAllFiles, exportLabel, exportPass } from "./utils"
import { initialBuild } from "./actions"
import { dotVdokDirPath, rawDocsPath, rawPackageJsonPath } from "./constants"
import { runWatch } from "./watch"

export async function runDev() {
    process.env.NODE_ENV = JSON.stringify("development")

    console.log(exportLabel("Vdok Development Start~"))

    if (process.env.VDOK_DEBUG === "DEBUG") {
        console.log(debugInfo("Vdok DEBUG Mode Start!"))
    }

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
    console.log(exportPass("Check for Vdok Project"))

    // 检查 docs 目录
    if (!fs.existsSync(rawDocsPath)) {
        throw new Error("No docs folder found in this project!")
    }
    console.log(exportPass("Check for Vdok Docs"))

    // 检查 .vdok 目录, 不管有没有都初始化
    if (fs.existsSync(dotVdokDirPath)) {
        deleteAllFiles(dotVdokDirPath)
    }

    console.log(exportLabel("Initial Build Start~"))
    await initialBuild()

    // 启动 vite 服务
    console.log(exportLabel("Start Vite Server~"))
    await startViteServer()

    // 监听文件修改
    runWatch()
}
