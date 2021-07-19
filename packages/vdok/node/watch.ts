// 定义监听文件更改
import chokidar from "chokidar"
import { writeVdokConfig } from "./actions"

import { cwd, rawPackageJsonPath, rootNodeModulesPath } from "./constants"
import {
    exportLabel,
    exportUpdate,
    watchExportAdd,
    watchExportChange,
    watchExportUnlink,
} from "./utils"

function getFileName(p: string) {
    const fileNameArray = p.split(/(\\|\/)/)
    const fileName = fileNameArray[fileNameArray.length - 1]
    return fileName
}

/**
 * 文件改动监听
 * TODO: 需要给vite发送更新指令热更新
 */
export function runWatch(): chokidar.FSWatcher {
    // 定义监听驻守
    const watcher = chokidar.watch(cwd, {
        ignored: /(^|[\/\\])\../, // 忽略 dot files
        persistent: true,
    })

    watcher.unwatch(rawPackageJsonPath)
    watcher.unwatch(rootNodeModulesPath)

    console.log(exportLabel("Watch for file changes"))
    watcher
        // 监听添加文件事件
        .on("add", (path, stats) => {
            console.log(watchExportAdd(path))
            const fileName = getFileName(path)
            const vdokConfigRegExp = /vdok.config.y(a)?ml/
            // 修改文件为配置文件, 触发配置写入
            if (vdokConfigRegExp.test(fileName)) {
                ;(async () => {
                    await writeVdokConfig()
                    console.log(exportUpdate("Vdok Config"))
                })()
            }

            // TODO 新增 docs 文件触发路由更新, 第一次除外
        })
        // 监听文件改动事件
        .on("change", (path, stats) => {
            console.log(watchExportChange(path))
            const fileName = getFileName(path)
            const vdokConfigRegExp = /vdok.config.y(a)?ml/
            // 修改文件为配置文件, 触发配置写入
            if (vdokConfigRegExp.test(fileName)) {
                ;(async () => {
                    await writeVdokConfig()
                    console.log(exportUpdate("Vdok Config"))
                })()
            }
        })
        // 监听文件删除事件
        .on("unlink", (path) => {
            console.log(watchExportUnlink(path))
        })

    watcher
        // 监听文件夹添加事件
        .on("addDir", (path, stats) => {
            console.log(watchExportAdd(path, "dir"))
        })
        // 监听文件夹删除事件
        .on("unlinkDir", (path) => {
            console.log(watchExportUnlink(path, "dir"))
            // TODO 删除根目录 docs 文件夹直接报错
        })
    return watcher
}
