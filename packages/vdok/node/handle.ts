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

    // TODO 支持根目录 i18n 这里需要修改
    sections.slice(1, sections.length - 1).forEach((_section) => {
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

                // 头部插入根目录文件
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
        // 处理 i18n 模式
        let _backTmp: Array<IEffectiveFilesSectionWithLang> = []

        for (let _f of _fs) {
            let _tmp: IEffectiveFilesSectionWithLang = {
                lang: "",
                sections: [],
            }

            // 处理根目录文件, 已经过滤了非i18n文件夹, 不能以 _f.lang 判断根目录文件夹
            // 后期支持根目录 i18n 需要修改判断条件
            if (!_f.sections[0].section) {
                // TODO 对于根目录考虑支持i18n, eg. _index.zh_CN.md  要替换为 -
                _tmp.lang = _f.lang
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
                let _notRootIndex: Array<string> = []
                // TODO 支持根目录 i18n 之后这里需要修改
                let _isRootIndex: string = ""

                // 目前没有支持根目录的 i18n, 只有一个section
                _f.sections[0].files.forEach((f) => {
                    const _fnameArray = f.split(/(\\\\|\/)/)

                    // 处理非 _index.md 文件
                    if (_fnameArray[_fnameArray.length] !== "_index.md") {
                        _notRootIndex.push(f)
                    } else {
                        _isRootIndex === f
                    }
                })

                // section 存在 _index.md 文件
                if (_notRootIndex.length !== _f.sections[0].files.length) {
                    // 处理 section 的 _index.md 文件
                    const [feats, markdown] = analyzerArticle(_isRootIndex)
                    _tS.title = !!feats.title
                        ? feats.title
                        : _f.sections[0].section
                    _tS.index.exist = true
                    _tS.index.feats = feats
                    _tS.index.markdown = markdown
                }

                // 返回文件分析结果
                _tS.files = handleFiles(_notRootIndex)

                // 目前只有一个section直接射出去就好了
                _tmp.sections.push(_tS)
            } else {
                // 非根目录处理
                _tmp.lang = _f.lang
                // 遍历处理子 sections
                for (let _section of _f.sections) {
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
                        _tS.title = !!feats.title
                            ? feats.title
                            : _section.section
                        _tS.index.exist = true
                        _tS.index.feats = feats
                        _tS.index.markdown = markdown
                    }

                    // 返回文件分析结果
                    _tS.files = handleFiles(_notIndex)
                    _tmp.sections.push(_tS)
                }
            }
            _backTmp.push(_tmp)
        }

        // TODO 支持非根目录 i18n 之后, 需要修改根目录排序
        let _back: Array<IEffectiveFilesSectionWithLang> = []

        // 这里需要遍历所有的语言进行文档排序
        for (let _bT of _backTmp) {
            let _tmp: IEffectiveFilesSectionWithLang = _bT
            if (_bT.sections.length === 0) {
                // 根目录文件不参与排序
                _tmp.sections = _bT.sections
            } else {
                _tmp.sections = sortSections(_bT.sections)
            }

            _back.push(_tmp)
        }

        return _back
    }
}
