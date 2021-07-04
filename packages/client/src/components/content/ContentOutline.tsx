import React, { FC, useEffect } from "react"
import _ from "lodash"
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
    useEffect(() => {
        updateAnchorTheme()
        window.addEventListener("hashchange", (e) => {
            updateAnchorTheme()
        })
        window.addEventListener(
            "scroll",
            _.throttle(() => {
                for (let item of outlines) {
                    const top = document
                        .getElementById(item.anchor as string)
                        ?.getBoundingClientRect().top as number
                    // BUG 锚点太近的页面抖动问题
                    if (top > 0 && top < 80) {
                        location.hash = item.anchor as string
                    }
                }
            }, 200)
        )
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
