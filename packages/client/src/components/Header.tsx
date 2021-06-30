import React, { FC } from "react"

interface IHeaderProps {
    logo?: string
    title?: string
    // navs
}

const Header: FC<IHeaderProps> = ({ logo, title }) => (
    <div className="bg-white h-full flex flex-row justify-start items-center flex-auto shadow-md">
        <div>logo</div>
        <div>title</div>
        <div>nav</div>
    </div>
)

export default Header
