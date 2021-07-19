import React, { FC } from "react"
import { ISideNavItem } from "@herberthe/vdok-types"

interface IPrevNextProps {
    prev?: ISideNavItem
    next?: ISideNavItem
}

interface IPrevNextItem extends ISideNavItem {
    type: "prev" | "next"
}

/**
 * 前后文切换组件
 */
const PrevNextItem: FC<IPrevNextItem> = ({ title, url, type }) => (
    <div>
        <a href={url}>{title}</a>
    </div>
)

const PrevNext: FC<IPrevNextProps> = ({ prev, next }) => (
    <div className="w-full flex flex-row justify-between">
        <PrevNextItem
            title={!!prev?.title ? prev.title : ""}
            url={!!prev?.url ? prev.url : ""}
            type="prev"
        />
        <PrevNextItem
            title={!!next?.title ? next.title : ""}
            url={!!next?.url ? next.url : ""}
            type="next"
        />
    </div>
)

export default PrevNext
