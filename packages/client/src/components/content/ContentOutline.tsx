import React, { FC, Fragment, useEffect } from "react"
// import _ from "lodash"
import { useTranslation } from "react-i18next"

import { ToAnchor } from "../../utils/actions"

export interface IContentOutlineItem {
    heading: string
    level: number
    anchor?: string
}

export interface IContentOutlineProps {
    outlines: Array<IContentOutlineItem>
}

const ContentOutline: FC<IContentOutlineProps> = ({ outlines }) => {
    const { t } = useTranslation("translation", { useSuspense: false })

    useEffect(() => {
        updateAnchorTheme()
        window.addEventListener("hashchange", (e) => {
            updateAnchorTheme()
        })
        window.addEventListener("scroll", () => {
            // TODO 修复此处BUG
            for (let item of outlines) {
                const top = document
                    .getElementById(item.anchor as string)
                    ?.getBoundingClientRect().top as number
                // BUG 锚点太近的页面抖动问题
                if (top > 0 && top < 80) {
                    location.hash = item.anchor as string
                }
            }
        })
        return () => {
            window.removeEventListener("hashchange", () => {})
            window.removeEventListener("scroll", () => {})
        }
    }, [])

    const updateAnchorTheme = () => {
        const doms = document.getElementsByClassName(
            "vdok-content-outline"
        ) as HTMLCollectionOf<HTMLLinkElement>
        for (let item of doms) {
            if (
                item.getAttribute("data-anchor") ===
                `#${decodeURIComponent(
                    location.hash.substring(1, location.hash.length)
                )}`
            ) {
                item.classList.add("text-color-[#d43e2a]")
            } else {
                item.classList.remove("text-color-[#d43e2a]")
            }
        }
    }

    const scrollAnchor = (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
        anchor: string
    ) => {
        e.preventDefault()
        ToAnchor(anchor)
    }

    return (
        <Fragment>
            <div className="text-gray-400 font-bold mb-3">{t("Outline")}</div>
            <ul className="w-full text-xs h-full overflow-auto pb-5 scrollbar-thin vdok-scrollbar">
                {outlines.map((item: IContentOutlineItem) => (
                    <li key={item.heading} className="my-1">
                        <a
                            href={`#${item.anchor}`}
                            data-anchor={`#${item.anchor}`}
                            title={item.heading}
                            className="vdok-content-outline"
                            onClick={(e) => scrollAnchor(e, `#${item.anchor}`)}
                        >
                            {item.heading}
                        </a>
                    </li>
                ))}
                {outlines.length === 0 && <li>{t("No Content")}</li>}
            </ul>
        </Fragment>
    )
}

export default ContentOutline
