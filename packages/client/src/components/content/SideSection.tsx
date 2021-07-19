import React, { FC, useEffect, useState } from "react"
import { ISideNavSection } from "@herberthe/vdok-types"

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
        <div className="w-full font-bold text-gray-400 select-none">
            {/* section有自定义的话就链接 */}
            {ownUrl ? (
                <a href={section.index}>
                    {!!section.title ? section.title : section.section}
                </a>
            ) : !!section.title ? (
                section.title
            ) : (
                section.section
            )}
        </div>
    )
}

export default SideSection
