import React, { FC } from "react"

export interface ISideSectionProps {
    section: string
}

const SideSection: FC<ISideSectionProps> = ({ section }) => (
    <div className="w-full font-bold text-gray-400 select-none">{section}</div>
)

export default SideSection
