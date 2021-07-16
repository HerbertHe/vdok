import {
    ISideNavSection,
    ISideNavItem,
    IRouteItem,
} from "@herberthe/vdok-types"
import { handleEffectiveFiles, IEffectiveFilesSection } from "./handle"
import { debugExport, debugInfo } from "./utils"

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
        console.log(debugInfo("Generate Side Nav Section Start"))
        console.log(debugExport(`${lang}\n${JSON.stringify(section)}`))
    }

    // 没有文件的时候直接跳过
    if (section.files.length === 0) {
        return null
    }

    sideNavSectionTmp.index = section.index.exist
        ? `${!!lang ? `/${lang}` : ""}/${section.name}/_index`
        : section.files[0][0]
    sideNavSectionTmp.title = section.title
    sideNavSectionTmp.section = section.name
    sideNavSectionTmp.navs = section.files.map(
        ([name, features]) =>
            ({
                title: `${!!features.title ? features.title : name}`,
                url: `/${section.name}/${name}`,
            } as ISideNavItem)
    )

    return sideNavSectionTmp
}

export function generateRoutes(): Array<IRouteItem> {
    const [mode, tree] = handleEffectiveFiles()
    if (mode) {
        let _back: Array<IRouteItem> = []
        tree.forEach((tr) => {
            let langSectionTmp: IRouteItem = {
                lang: tr.lang,
                sections: [],
            }

            tr.sections.forEach((section) => {
                if (section.name !== "_root") {
                    const sections = generateSideNavSection(tr.lang, section)
                    if (!!sections) {
                        langSectionTmp.sections.push(sections)
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

        return _back
    } else {
        // 非 i18n 路由生成
        let _sections: Array<ISideNavSection> = []
        tree[0].sections.forEach((section) => {
            if (section.name !== "_root") {
                const sections = generateSideNavSection("", section)
                if (!!sections) {
                    _sections.push(sections)
                }
            }
            // 根目录暂时不处理
        })

        const _back = [
            {
                lang: "",
                sections: _sections,
            },
        ]

        if (process.env.VDOK_DEBUG === "DEBUG") {
            console.log(debugInfo("Generate Routes for normal"))
            console.log(debugExport(JSON.stringify(_back)))
        }

        return _back
    }
}
