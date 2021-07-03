import React, { FC, useEffect } from "react"
import _ from "lodash"
import { ToAnchor } from "../../utils/actions"
import { ConvertAnchor } from "../../utils/converters"

export interface IContentOutlineItem {
    heading: string
    level: number
    anchor?: string
}

export interface IContentOutlineProps {
    outlines: Array<IContentOutlineItem>
}

const ContentOutline: FC<IContentOutlineProps> = ({ outlines }) => {
    useEffect(() => {
        // TODO 滚动更新hash
        updateAnchorTheme()
        window.addEventListener("hashchange", () => {
            updateAnchorTheme()
        })
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
        <ul className="w-full text-xs h-full overflow-auto pb-5 scrollbar-thin scrollbar-thumb-light-900 scrollbar-track-light-500 dark:(scrollbar-track-transparent scrollbar-thumb-dark-100)">
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
            {outlines.length === 0 && <li>No Content ~</li>}
        </ul>
    )
}

export default ContentOutline