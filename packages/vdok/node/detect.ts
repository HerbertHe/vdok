import fs from "fs"
import path from "path"
import { isI18nMode, isIncludedInBCP47 } from "./is"

/**
 * TODO: 考虑将根目录的section改为 _root?
 */

/**
 * 命令行执行路径
 */
const cwd = process.cwd()

interface IDetectEffectiveSection {
    section: string
    files: Array<string>
}

export interface IDetectEffectiveFiles {
    lang: string
    sections: Array<IDetectEffectiveSection>
}

/**
 * 在i18n模式下侦测
 */
function detectInI18nMode(): [Array<string>, Array<string>] {
    const p = path.join(cwd, "docs")
    let _dirs: Array<string> = []
    let _files: Array<string> = []

    const fd = fs.readdirSync(p)

    fd.forEach((item) => {
        const tmp = path.join(p, item)
        const isDir = fs.lstatSync(tmp).isDirectory()

        // 为i18n模式的目录
        if (isDir && isIncludedInBCP47(item)) {
            // 完整路径
            _dirs.push(tmp)
        }

        // 文件
        if (!isDir) {
            _files.push(tmp)
        }

        // 不是i18n文件夹忽略掉
    })

    return [_files, _dirs]
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
        // TODO 扔出错误
        throw new Error("No /docs dir Found!")
    }

    // 判断是否处于i18n模式, 返回数据结构不同
    if (isI18nMode(cwd)) {
        const [_files, _dirs] = detectInI18nMode()
        let _back: Array<IDetectEffectiveFiles> = []
        let rootFiles: IDetectEffectiveFiles = {
            lang: "",
            sections: [
                {
                    section: "",
                    files: _files,
                },
            ],
        }

        _back.push(rootFiles)

        for (let _dir of _dirs) {
            // 这里的 _dir 是完整路径
            let _fTmp: IDetectEffectiveFiles = {
                lang: _dir.replace(cwd, ""),
                sections: [],
            }

            const children = fs.readdirSync(_dir)
            // 空文件夹
            if (children.length === 0) continue

            let _nonSectionFile: IDetectEffectiveSection = {
                section: "",
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

        return _back
    } else {
        const [_files, _dirs] = detectNotInI18nMode()
        let _back: Array<IDetectEffectiveFiles> = []
        let _f: IDetectEffectiveFiles = {
            lang: "",
            sections: [
                {
                    section: "",
                    files: _files,
                },
            ],
        }

        for (let _dir of _dirs) {
            let _tmp: IDetectEffectiveSection = {
                section: _dir.replace(cwd, ""),
                files: detectAllFiles(_dir),
            }

            _f.sections.push(_tmp)
        }

        _back.push(_f)

        return _back
    }
}
