import React, { FC, useEffect } from "react"
import _ from "lodash"

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
        window.addEventListener(
            "scroll",
            _.debounce(() => {
                // 滚动更新 hash
            }, 500)
        )
        return () => {
            window.removeEventListener("scroll", () => {})
        }
    }, [])

    const scrollAnchor = (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
        anchor: string
    ) => {
        e.preventDefault()
        const to = document.querySelector(anchor) as HTMLHeadingElement
        if (!to) {
            return
        }
        // TODO 添加滚动事件监听, 动态更新对应锚点的颜色
        location.hash = anchor
        scrollTo({
            top: to.offsetTop - 80,
        })
    }
    return (
        <ul className="w-full text-xs h-full overflow-auto pb-5 scrollbar-thin scrollbar-thumb-light-900 scrollbar-track-light-500 dark:(scrollbar-track-transparent scrollbar-thumb-dark-100)">
            {outlines.map((item: IContentOutlineItem) => (
                <li key={item.heading} className="my-1">
                    <a
                        href={`#${!!item.anchor ? item.anchor : item.heading}`}
                        title={item.heading}
                        onClick={(e) =>
                            scrollAnchor(
                                e,
                                `#${!!item.anchor ? item.anchor : item.heading}`
                            )
                        }
                    >
                        {item.heading}
                    </a>
                </li>
            ))}
        </ul>
    )
}

export default ContentOutline
