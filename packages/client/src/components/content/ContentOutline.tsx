import React, { FC } from "react"

export interface IContentOutlineItem {
    heading: string
    level: number
    anchor?: string
}

export interface IContentOutlineProps {
    outlines: Array<IContentOutlineItem>
}

const ContentOutline: FC<IContentOutlineProps> = ({ outlines }) => (
    <ul className="w-full text-xs h-full overflow-auto">
        {outlines.map((item: IContentOutlineItem) => (
            <li key={item.heading} className="my-1">
                <a
                    href={`#${!!item.anchor ? item.anchor : item.heading}`}
                    title={item.heading}
                >
                    {item.heading}
                </a>
            </li>
        ))}
    </ul>
)

export default ContentOutline
