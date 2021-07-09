import { ISideNavSection, ISideNavItem } from "@herberthe/vdok-types"
import { handleEffectiveFiles, IEffectiveFilesSection } from "./handle"

interface IRouteItem {
    lang: string
    sections: Array<ISideNavSection>
}

function generateSideNavSection(
    lang: string,
    section: IEffectiveFilesSection
): ISideNavSection {
    let sideNavSectionTmp: ISideNavSection = {
        section: "",
        title: "",
        index: "",
        navs: [],
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
                    langSectionTmp.sections.push(
                        generateSideNavSection(tr.lang, section)
                    )
                }
                // 根目录暂不处理
            })

            _back.push(langSectionTmp)
        })

        return _back
    } else {
        // 非 i18n 路由生成
        let _sections: Array<ISideNavSection> = []
        tree[0].sections.forEach((section) => {
            if (section.name !== "_root") {
                _sections.push(generateSideNavSection("", section))
            }
            // 根目录暂时不处理
        })

        return [
            {
                lang: "",
                sections: _sections,
            },
        ]
    }
}
