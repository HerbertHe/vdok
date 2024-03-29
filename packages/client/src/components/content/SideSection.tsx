import React, { FC, useEffect, useState } from "react"
import { ISideNavSection } from "@herberthe/vdok-types"
import { NavLink } from "react-router-dom"
import { LinkOne } from "@icon-park/react"

import DraftTag from "../extra/DraftTag"

interface ISideSectionProps {
    section: ISideNavSection
}

const SideSection: FC<ISideSectionProps> = ({ section }) => {
    const [ownUrl, setOwnUrl] = useState(false)

    useEffect(() => {
        const urls = section.index.split("/")
        setOwnUrl(urls[urls.length - 1] === "_index")
    }, [])

    return (
        <div className="w-full font-bold text-gray-400 select-none flex flex-row justify-between items-center">
            {/* section有自定义的话就链接 */}
            <div className="flex-1">
                {ownUrl ? (
                    <NavLink to={section.index}>
                        {!!section.title ? section.title : section.section}
                    </NavLink>
                ) : !!section.title ? (
                    section.title
                ) : (
                    section.section
                )}
                {ownUrl && (
                    <LinkOne
                        className="ml-2"
                        theme="outline"
                        size="14"
                        fill="#d43e2a"
                    />
                )}
            </div>

            <div>{ownUrl && section.draft && <DraftTag />}</div>
        </div>
    )
}

export default SideSection
