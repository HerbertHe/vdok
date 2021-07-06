import fs from "fs"

import { analyzerArticle, IArticleFeatures } from "./analyzers"
import { detectEffectiveFiles, IDetectEffectiveFiles } from "./detect"

export interface IEffectiveFilesSectionIndex {
    exist: boolean
    feats?: IArticleFeatures
    markdown?: string
}

export interface IEffectiveFilesSection {
    title: string
    index: IEffectiveFilesSectionIndex
    files: Array<[IArticleFeatures, string]>
}

export interface IEffectiveFilesSectionWithLang {
    lang: string
    sections: Array<IEffectiveFilesSection>
}

/**
 * 文件处理
 * @param files 发现的文件
 */
export function handleFiles(
    files: Array<string>
): Array<[IArticleFeatures, string]> {
    let _raw: Array<[IArticleFeatures, string]> = []
    for (let f of files) {
        const content = fs.readFileSync(f, { encoding: "utf-8" })
        const res = analyzerArticle(content)
        _raw.push(res)
    }

    let _ordered: Array<[IArticleFeatures, string]> = []
    let _noOrdered: Array<[IArticleFeatures, string]> = []

    _raw.forEach((f) => {
        if (f[0].order !== 0) {
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
            ([f1], [f2]) => (f1.order as number) - (f2.order as number)
        )
        return _sorted.concat(_noOrdered)
    }
}

/**
 * 章节排序
 * @param sections
 */
export function sortSections(
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

/**
 * 有效文件处理
 */
export function handleEffectiveFiles(): Array<IEffectiveFilesSectionWithLang> {
    const _fs: Array<IDetectEffectiveFiles> = detectEffectiveFiles()

    if (_fs.length === 0) {
        // TODO 没有文件扔出错误
        throw new Error("No Content")
    }

    // 处理非 i18n 的情况
    if (_fs.length === 1 && !_fs[0].lang) {
        let _tmp: IEffectiveFilesSectionWithLang = {
            lang: "",
            sections: [],
        }

        for (let _section of _fs[0].sections) {
            // 单文件默认扔到最前面, 要排除 _index.md 文件
            if (!_section.section) {
                let _tS: IEffectiveFilesSection = {
                    title: "",
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
                let _notIndex: Array<string> = []
                let _isIndex: string = ""

                _section.files.forEach((f) => {
                    const _fnameArray = f.split(/(\\\\|\/)/)

                    // 处理非 _index.md 文件
                    if (_fnameArray[_fnameArray.length] !== "_index.md") {
                        _notIndex.push(f)
                    } else {
                        _isIndex === f
                    }
                })

                // 根目录 存在 _index.md 文件
                if (_notIndex.length !== _section.files.length) {
                    // TODO 处理 根目录的 _index.md 文件
                }

                // 返回文件分析结果
                _tS.files = handleFiles(_notIndex)

                // 头部插入非 section 文件
                _tmp.sections.unshift(_tS)
            } else {
                // section 的处理
                let _tS: IEffectiveFilesSection = {
                    title: "",
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

                let _notIndex: Array<string> = []
                let _isIndex: string = ""

                _section.files.forEach((f) => {
                    const _fnameArray = f.split(/(\\\\|\/)/)

                    // 处理非 _index.md 文件
                    if (_fnameArray[_fnameArray.length] !== "_index.md") {
                        _notIndex.push(f)
                    } else {
                        _isIndex === f
                    }
                })

                // section 存在 _index.md 文件
                if (_notIndex.length !== _section.files.length) {
                    // 处理 section 的 _index.md 文件
                    const [feats, markdown] = analyzerArticle(_isIndex)
                    _tS.title = !!feats.title ? feats.title : _section.section
                    _tS.index.exist = true
                    _tS.index.feats = feats
                    _tS.index.markdown = markdown
                }

                // 返回文件分析结果
                _tS.files = handleFiles(_notIndex)
                _tmp.sections.push(_tS)
            }
        }

        // 对section进行排序
        const _back = _tmp
        _back.sections = sortSections(_tmp.sections)

        // 返回结果
        return [_back]
    } else {
        let _back: Array<IEffectiveFilesSectionWithLang> = []

        for (let _f of _fs) {
            let _tmp: IEffectiveFilesSectionWithLang = {
                lang: "",
                sections: [],
            }

            // 处理根目录文件, 已经过滤了非i18n文件夹
            if (!_f.lang) {
                let _tS: IEffectiveFilesSection = {
                    title: "",
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
                let _notIndex: Array<string> = []
                let _isIndex: string = ""

                // TODO 检测和处理根目录 _index.md
            }
        }

        return _back
    }
}
