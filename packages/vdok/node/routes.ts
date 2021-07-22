import {
    ISideNavSection,
    ISideNavItem,
    IRouteItem,
} from "@herberthe/vdok-types"
import {
    BackFileItemType,
    handleEffectiveFiles,
    IEffectiveFilesSection,
} from "./handle"
import { debugExport, debugInfo, exportLabel, exportPass } from "./utils"

function generateSideNavSection(
    lang: string,
    section: IEffectiveFilesSection
): ISideNavSection | null {
    let sideNavSectionTmp: ISideNavSection = {
        section: "",
        title: "",
        index: "",
        navs: [],
    }

    if (process.env.VDOK_DEBUG === "DEBUG") {
        const debugSection = JSON.parse(
            JSON.stringify(section)
        ) as IEffectiveFilesSection
        let debugFile: Array<BackFileItemType> = []
        if (debugSection.files.length !== 0) {
            debugFile = debugSection.files.map((i) => [
                i[0],
                i[1],
                `${i[2].substr(0, 30)}...`,
            ])
        }
        debugSection.files = debugFile
        console.log(debugInfo("Generate Side Nav Section Start"))
        console.log(debugExport(`${lang}\n${JSON.stringify(debugSection)}`))
    }

    // 没有文件的时候直接跳过
    if (section.files.length === 0) {
        return null
    }

    sideNavSectionTmp.index = section.index.exist
        ? `${!!lang ? `/${lang}` : ""}/${section.name}/_index`
        : `${!!lang ? `/${lang}` : ""}/${section.name}/${section.files[0][0]}`
    sideNavSectionTmp.title = section.title
    sideNavSectionTmp.section = section.name
    sideNavSectionTmp.navs = section.files.map(
        ([name, features]) =>
            ({
                title: `${!!features.title ? features.title : name}`,
                url: `${!!lang ? `/${lang}` : ""}/${section.name}/${name}`,
            } as ISideNavItem)
    )

    return sideNavSectionTmp
}

export function generateRoutes(): Array<IRouteItem> {
    console.log(exportLabel("Generate Routes start~"))
    const [mode, tree] = handleEffectiveFiles()
    if (mode) {
        let _back: Array<IRouteItem> = []
        tree.forEach((tr) => {
            let langSectionTmp: IRouteItem = {
                lang: tr.lang,
                index: "",
                sections: [],
            }

            tr.sections.forEach((section) => {
                if (section.name !== "_root") {
                    const sections = generateSideNavSection(tr.lang, section)
                    if (!!sections) {
                        langSectionTmp.sections.push(sections)
                    }
                } else {
                    // 目前只处理 _index.md 文件
                    if (section.index.exist) {
                        langSectionTmp.index = `/${tr.lang}/_index`
                    }
                }
                // 根目录暂不处理
            })

            _back.push(langSectionTmp)
        })

        if (process.env.VDOK_DEBUG === "DEBUG") {
            console.log(debugInfo("Generate Routes for i18n"))
            console.log(debugExport(JSON.stringify(_back)))
        }

        console.log(exportPass("Generate Routes"))
        return _back
    } else {
        // 非 i18n 路由生成
        let _sections: Array<ISideNavSection> = []
        let _index: string = ""

        tree[0].sections.forEach((section) => {
            if (section.name !== "_root") {
                const sections = generateSideNavSection("", section)
                if (!!sections) {
                    _sections.push(sections)
                }
            } else {
                // 目前根目录只处理 _index.md 文件
                if (section.index.exist) {
                    _index = "_index"
                }
            }
            // 根目录暂时不处理
        })

        const _back = [
            {
                lang: "",
                index: _index,
                sections: _sections,
            },
        ]

        if (process.env.VDOK_DEBUG === "DEBUG") {
            console.log(debugInfo("Generate Routes for normal"))
            console.log(debugExport(JSON.stringify(_back)))
        }

        console.log(exportPass("Generate Routes"))
        return _back
    }
}
