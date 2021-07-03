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
        // 监听hash改变, 更新样式
        // window.addEventListener(
        //     "scroll",
        //     _.debounce(() => {
        //         // 滚动更新 hash
        //     }, 500)
        // )
        // return () => {
        //     window.removeEventListener("scroll", () => {})
        // }
        window.addEventListener("hashchange", () => {
            const doms = document.getElementsByClassName(
                "vdok-content-outline"
            ) as HTMLCollectionOf<HTMLLinkElement>
            for (let item of doms) {
                if (
                    `#${encodeURIComponent(
                        item.href.substring(1, item.href.length)
                    )}` === location.hash
                ) {
                    item.classList.add("text-red")
                } else {
                    item.classList.remove("text-red")
                }
            }
        })
    }, [])

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
