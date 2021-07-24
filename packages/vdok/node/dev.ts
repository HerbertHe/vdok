import fs from "fs"

import { startViteServer } from "./vite"
import { debugInfo, deleteAllFiles, exportLabel, exportPass } from "./utils"
import {
    copyVdokClient,
    createSymlinkForDocs,
    createSymlinkForInnerNodeModules,
    createSymlinkForLocales,
    generateDotVdok,
    installPackage,
    writeRoutesInfos,
    writeVdokConfig,
} from "./actions"
import {
    dotVdokDirPath,
    rawDocsPath,
    rawPackageJsonPath,
    vdokDocsPath,
    vdokNodeModulesPath,
} from "./constants"
import { runWatch } from "./watch"

/**
 * 开发构建任务
 */
async function devTask() {
    // 生成 .vdok 文件夹
    generateDotVdok()
    // 移动vdok-client
    copyVdokClient()
    // 根目录下载依赖
    if (
        process.env.VDOK_DEBUG === "DEBUG" &&
        process.env.VDOK_DEBUG_FAST === "FAST"
    ) {
        console.log(debugInfo("Fast rebuild for debug"))
    } else {
        await installPackage()
    }
    // 创建软连接
    createSymlinkForInnerNodeModules()
    // 移动路由文件
    await writeRoutesInfos()
    // 移动配置文件
    await writeVdokConfig()
    // 文档创建软连接
    createSymlinkForDocs()
    // 国际化翻译创建软连接
    createSymlinkForLocales()
}

export async function runDev() {
    process.env.NODE_ENV = "development"

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

    // 检查到软连接, 则视为二次构建
    if (
        !fs.existsSync(vdokNodeModulesPath) ||
        !fs.existsSync(vdokDocsPath) ||
        process.env.VDOK_DEBUG === "DEBUG"
    ) {
        // 检查 .vdok 目录, 不管有没有都初始化
        if (fs.existsSync(dotVdokDirPath)) {
            deleteAllFiles(dotVdokDirPath)
        }

        console.log(exportLabel("Initial Build Start~"))
        await devTask()
    }

    // 启动 vite 服务
    console.log(exportLabel("Start Vite Server~"))
    await startViteServer()

    // 监听文件修改
    runWatch()
    console.log("Press Ctrl/Command + C to quit")
}
