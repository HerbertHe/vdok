// 定义监听文件更改
import path from "path"
import chokidar from "chokidar"

const cwd = process.cwd()

/**
 * 文件改动监听
 */
export function runWatch(): chokidar.FSWatcher {
    // 定义监听驻守
    const watcher = chokidar.watch(cwd, {
        ignored: /(^|[\/\\])\../, // 忽略 dot files
        persistent: true,
    })

    watcher.unwatch(path.join(cwd, "package.json"))

    watcher
        // 监听添加文件事件
        .on("add", (path, stats) => {})
        // 监听文件改动事件
        .on("change", (path, stats) => {})
        // 监听文件删除事件
        .on("unlink", (path) => {})

    watcher
        // 监听文件夹添加事件
        .on("addDir", (path, stats) => {})
        // 监听文件夹删除事件
        .on("unlinkDir", (path) => {})
    return watcher
}
