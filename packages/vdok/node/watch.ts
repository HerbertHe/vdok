// 定义监听文件更改
import chokidar from "chokidar"
import { writeRoutesInfos, writeVdokConfig } from "./actions"

import {
    cwd,
    rawDocsPath,
    rawPackageJsonPath,
    rootNodeModulesPath,
} from "./constants"
import {
    exportLabel,
    exportUpdate,
    watchExportAdd,
    watchExportChange,
    watchExportUnlink,
} from "./utils"

function getFileName(p: string): [string, Array<string>] {
    const fileNameArray = p.split(/(\\|\/)/)
    const fileName = fileNameArray[fileNameArray.length - 1]
    return [fileName, fileNameArray]
}

/**
 * 文件改动监听
 */
export function runWatch(): chokidar.FSWatcher {
    // 定义监听驻守
    const watcher = chokidar.watch(cwd, {
        ignored: /((^|[\/\\])\..|.log|.lock)/, // 忽略 dot files
        ignoreInitial: true,
        persistent: true,
    })

    watcher.unwatch(rawPackageJsonPath)
    watcher.unwatch(rootNodeModulesPath)

    console.log(exportLabel("Watch for file changes"))
    watcher
        // 监听添加文件事件
        .on("add", (path, stats) => {
            console.log(watchExportAdd(path))
            const [fileName, fileNameArray] = getFileName(path)
            const vdokConfigRegExp = /vdok.config.y(a)?ml/
            // 修改文件为配置文件, 触发配置写入
            if (vdokConfigRegExp.test(fileName)) {
                ;(async () => {
                    await writeVdokConfig()
                    console.log(exportUpdate("Vdok Config"))
                })()
            }

            // 只有第一次生效
            // TODO 性能可以继续优化
            if (/.md$/.test(path) && fileNameArray.includes("docs")) {
                ;(async () => {
                    await writeRoutesInfos()
                    console.log(exportUpdate("Vdok Routes"))
                })()
            }
        })
        // 监听文件改动事件
        .on("change", (path, stats) => {
            console.log(watchExportChange(path))
            const [fileName, fileNameArray] = getFileName(path)
            const vdokConfigRegExp = /vdok.config.y(a)?ml/
            // 修改文件为配置文件, 触发配置写入
            if (vdokConfigRegExp.test(fileName)) {
                ;(async () => {
                    await writeVdokConfig()
                    console.log(exportUpdate("Vdok Config"))
                })()
            }

            // TODO 性能可以优化
            if (/.md$/.test(path) && fileNameArray.includes("docs")) {
                ;(async () => {
                    await writeRoutesInfos()
                    console.log(exportUpdate("Vdok Routes"))
                })()
            }
        })
        // 监听文件删除事件
        .on("unlink", (path) => {
            console.log(watchExportUnlink(path))
            const [, fileNameArray] = getFileName(path)
            if (/.md$/.test(path) && fileNameArray.includes("docs")) {
                ;(async () => {
                    await writeRoutesInfos()
                    console.log(exportUpdate("Vdok Routes"))
                })()
            }
        })

    watcher
        // 监听文件夹添加事件
        .on("addDir", (path, stats) => {
            console.log(watchExportAdd(path, "dir"))
        })
        // 监听文件夹删除事件
        .on("unlinkDir", (path) => {
            console.log(watchExportUnlink(path, "dir"))
            if (path === rawDocsPath) {
                throw new Error("Delete necessary folder /docs!")
            }
        })
    return watcher
}
