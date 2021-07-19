import fs from "fs"
import path from "path"

import { isI18nMode, isIncludedInBCP47 } from "./is"
import { cwd } from "./constants"
import {
    debugExport,
    debugInfo,
    exportLabel,
    exportMode,
    exportPass,
} from "./utils"

export interface IDetectEffectiveSection {
    section: string
    files: Array<string>
}

export interface IDetectEffectiveFiles {
    lang: string
    sections: Array<IDetectEffectiveSection>
}

function removePrefix(t: string, i18n: string): string {
    if (!i18n) {
        return t
            .replace(path.join(cwd, "docs"), "")
            .replace("\\", "")
            .replace("/", "")
    }

    return t
        .replace(path.join(cwd, "docs", i18n), "")
        .replace("\\", "")
        .replace("/", "")
}

/**
 * 在i18n模式下侦测
 */
function detectInI18nMode(): Array<string> {
    const p = path.join(cwd, "docs")
    let _dirs: Array<string> = []

    const fd = fs.readdirSync(p)

    fd.forEach((item) => {
        const tmp = path.join(p, item)
        const isDir = fs.lstatSync(tmp).isDirectory()

        // 为i18n模式的目录
        if (isDir && isIncludedInBCP47(item)) {
            // 完整路径
            _dirs.push(tmp)
        }

        // 忽略掉所有根目录文件

        // 不是i18n文件夹忽略掉
    })

    return _dirs
}

/**
 * 不在i18n模式下
 */
function detectNotInI18nMode(): [Array<string>, Array<string>] {
    const p = path.join(cwd, "docs")
    let _dirs: Array<string> = []
    let _files: Array<string> = []

    const fd = fs.readdirSync(p)

    fd.forEach((item) => {
        const tmp = path.join(p, item)
        const isDir = fs.lstatSync(tmp).isDirectory()

        if (isDir) {
            _dirs.push(tmp)
        } else {
            _files.push(tmp)
        }
    })

    return [_files, _dirs]
}

/**
 * 递归获取所有 markdown 的文件
 * @param dirp 文件夹完整路径
 */
function detectAllFiles(dirp: string): Array<string> {
    let _files: Array<string> = []
    const mdRegExp = /.md$/
    const fd = fs.readdirSync(dirp)

    fd.forEach((item) => {
        const p = path.join(dirp, item)
        const isDir = fs.lstatSync(p).isDirectory()
        if (isDir) {
            // 递归
            _files.push(...detectAllFiles(p))
        } else if (mdRegExp.test(item)) {
            _files.push(p)
        }
    })

    return _files
}

export function detectEffectiveFiles(): Array<IDetectEffectiveFiles> {
    const p = path.join(cwd, "docs")

    if (!fs.existsSync(p)) {
        throw new Error("Folder /docs not found in current path!")
    }

    let _back: Array<IDetectEffectiveFiles> = []

    console.log(exportLabel("Detect Effective Files start~"))
    if (isI18nMode(cwd)) {
        console.log(exportMode("i18n"))
        if (process.env.VDOK_DEBUG === "DEBUG") {
            console.log(debugInfo("Detect Mode", "i18n"))
        }

        const _dirs = detectInI18nMode()

        for (let _dir of _dirs) {
            // 这里的 _dir 是完整路径
            let _fTmp: IDetectEffectiveFiles = {
                lang: removePrefix(_dir, ""),
                sections: [],
            }

            const children = fs.readdirSync(_dir)
            // 空文件夹
            if (children.length === 0) continue

            let _nonSectionFile: IDetectEffectiveSection = {
                section: "_root",
                files: [],
            }

            // 处理章节和文件问题
            for (let child of children) {
                const p = path.join(_dir, child)
                const isDir = fs.lstatSync(p).isDirectory()

                if (!isDir) {
                    // 文件的情况
                    _nonSectionFile.files.push(p)
                } else {
                    let _tmpSection: IDetectEffectiveSection = {
                        section: child,
                        files: detectAllFiles(p),
                    }
                    _fTmp.sections.push(_tmpSection)
                }
            }

            _fTmp.sections.push(_nonSectionFile)
            _back.push(_fTmp)
        }
    } else {
        console.log(exportMode("normal"))
        if (process.env.VDOK_DEBUG === "DEBUG") {
            console.log(debugInfo("Detect Mode", "normal"))
        }

        const [_files, _dirs] = detectNotInI18nMode()
        let _f: IDetectEffectiveFiles = {
            lang: "",
            sections: [],
        }

        if (_files.length !== 0) {
            _f.sections.push({
                section: "_root",
                files: _files,
            })
        }

        for (let _dir of _dirs) {
            let _tmp: IDetectEffectiveSection = {
                section: removePrefix(_dir, ""),
                files: detectAllFiles(_dir),
            }

            _f.sections.push(_tmp)
        }

        _back.push(_f)
    }
    console.log(exportPass("Detect Effective Files"))

    if (process.env.VDOK_DEBUG === "DEBUG") {
        console.log(debugInfo("Detected:"))
        console.log(debugExport(JSON.stringify(_back)))
    }

    return _back
}
