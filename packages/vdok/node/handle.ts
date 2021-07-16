import fs from "fs"

import { analyzerArticle, IArticleFeatures } from "./analyzers"
import {
    detectEffectiveFiles,
    IDetectEffectiveFiles,
    IDetectEffectiveSection,
} from "./detect"
import { debugExport, debugInfo } from "./utils"

export interface IEffectiveFilesSectionIndex {
    exist: boolean
    feats?: IArticleFeatures
    markdown?: string
}

/**
 * 文件
 * 特性
 * 源文本内容
 */
export type BackFileItemType = [string, IArticleFeatures, string]

export interface IEffectiveFilesSection {
    title: string
    name: string
    index: IEffectiveFilesSectionIndex
    files: Array<BackFileItemType>
}

export interface IEffectiveFilesSectionWithLang {
    lang: string
    sections: Array<IEffectiveFilesSection>
}

/**
 * 文件处理
 * @param files 发现的文件
 */
export function handleFiles(files: Array<string>): Array<BackFileItemType> {
    let _raw: Array<BackFileItemType> = []
    for (let f of files) {
        const content = fs.readFileSync(f, { encoding: "utf-8" })
        const res = analyzerArticle(content)
        const fileName = f
            .split(/(\/|\\)/)
            .filter((f) => /.md$/.test(f))[0]
            .replace(/.md/, "")
        _raw.push([fileName, ...res])
    }

    let _ordered: Array<BackFileItemType> = []
    let _noOrdered: Array<BackFileItemType> = []

    _raw.forEach((f) => {
        if (f[1].order !== 0) {
            _noOrdered.push(f)
        } else {
            _ordered.push(f)
        }
    })

    // 默认排序
    if (_ordered.length === 0) {
        return _raw
    } else {
        const _sorted = _ordered.sort(
            ([, f1], [, f2]) => (f1.order as number) - (f2.order as number)
        )
        return _sorted.concat(_noOrdered)
    }
}

/**
 * 章节排序
 * @param sections
 */
function sortSections(
    sections: Array<IEffectiveFilesSection>
): Array<IEffectiveFilesSection> {
    let _nonSection: IEffectiveFilesSection = sections[0]
    let _ordered: Array<IEffectiveFilesSection> = []
    let _noOrdered: Array<IEffectiveFilesSection> = []

    sections.slice(1, sections.length).forEach((_section) => {
        if (
            !_section.index.exist ||
            (_section.index.exist &&
                (_section.index.feats?.order as number) === 0)
        ) {
            _noOrdered.push(_section)
        } else {
            _ordered.push(_section)
        }
    })

    if (_ordered.length === 0) {
        return [_nonSection, ..._noOrdered]
    } else {
        const _sorted = _ordered.sort(
            ({ index: idx1 }, { index: idx2 }) =>
                (idx1.feats?.order as number) - (idx2.feats?.order as number)
        )

        return [_nonSection, ..._sorted, ..._noOrdered]
    }
}

function handleSection(
    _section: IDetectEffectiveSection
): IEffectiveFilesSection {
    let _tS: IEffectiveFilesSection = {
        title: "",
        name: _section.section,
        index: {
            exist: false,
            feats: {
                title: "",
                order: -1,
            },
            markdown: "",
        },
        files: [],
    }

    if (_section.files.length === 0) {
        return _tS
    }

    let _notIndex: Array<string> = []
    let _isIndex: string = ""

    _section.files.forEach((f) => {
        const _fnameArray = f.split(/(\\|\/)/)

        // 处理非 _index.md 文件
        if (_fnameArray[_fnameArray.length - 1] !== "_index.md") {
            _notIndex.push(f)
        } else {
            _isIndex = f
        }
    })

    if (_section.section === "_root") {
        // TODO 根目录/语言根目录 存在 _index.md 文件
        if (_notIndex.length !== _section.files.length) {
            const [feats, markdown] = analyzerArticle(
                fs.readFileSync(_isIndex, { encoding: "utf-8" })
            )
            _tS.index.exist = true
            _tS.index.feats = feats
            _tS.index.markdown = markdown
        }
    } else {
        _tS.name === _section.section
        // section 存在 _index.md 文件
        if (_notIndex.length !== _section.files.length) {
            // 处理 section 的 _index.md 文件
            const [feats, markdown] = analyzerArticle(
                fs.readFileSync(_isIndex, { encoding: "utf-8" })
            )
            _tS.title = !!feats.title ? feats.title : _section.section
            _tS.index.exist = true
            _tS.index.feats = feats
            _tS.index.markdown = markdown
        }
    }

    // 返回文件分析结果
    _tS.files = handleFiles(_notIndex)

    return _tS
}

/**
 * 有效文件处理
 */
export function handleEffectiveFiles(): [
    boolean,
    Array<IEffectiveFilesSectionWithLang>
] {
    const _fs: Array<IDetectEffectiveFiles> = detectEffectiveFiles()

    if (_fs.length === 0) {
        throw new Error("No files in the /docs folder")
    }

    // 处理非 i18n 的情况
    if (_fs.length === 1 && !_fs[0].lang) {
        let _tmp: IEffectiveFilesSectionWithLang = {
            lang: "",
            sections: [],
        }

        for (let _section of _fs[0].sections) {
            const _tS = handleSection(_section)

            // 单文件默认扔到最前面, 要排除 _index.md 文件
            if (_section.section === "_root") {
                // 头部插入根目录文件
                _tmp.sections.unshift(_tS)
            } else {
                _tmp.sections.push(_tS)
            }
        }

        // 对section进行排序
        const _back = _tmp
        _back.sections = sortSections(_tmp.sections)

        if (process.env.VDOK_DEBUG === "DEBUG") {
            console.log(
                debugInfo("Handle EffectiveFilesSectionWithLang for normal")
            )
            console.log(debugExport(JSON.stringify(_back)))
        }
        // 返回结果
        return [false, [_back]]
    } else {
        // 处理 i18n 模式
        let _backTmp: Array<IEffectiveFilesSectionWithLang> = []

        for (let _f of _fs) {
            let _tmp: IEffectiveFilesSectionWithLang = {
                lang: "",
                sections: [],
            }

            // TODO 根目录配置已经不再支持, 改为 zh-CN/_index.md 侦测
            _tmp.lang = _f.lang
            // 遍历处理子 sections
            for (let _section of _f.sections) {
                const _tS = handleSection(_section)
                if (_section.section === "_root") {
                    _tmp.sections.unshift(_tS)
                } else {
                    _tmp.sections.push(_tS)
                }
            }
            _backTmp.push(_tmp)
        }

        let _back: Array<IEffectiveFilesSectionWithLang> = []

        // 这里需要遍历所有的语言进行文档排序
        for (let _bT of _backTmp) {
            let _tmp: IEffectiveFilesSectionWithLang = _bT

            // 章节目录无文件
            if (_bT.sections.length === 0) {
                continue
            } else {
                _tmp.sections = sortSections(_bT.sections)
            }

            _back.push(_tmp)
        }

        if (process.env.VDOK_DEBUG === "DEBUG") {
            console.log(
                debugInfo("Handle EffectiveFilesSectionWithLang for i18n")
            )
            console.log(debugExport(JSON.stringify(_back)))
        }

        return [true, _back]
    }
}
