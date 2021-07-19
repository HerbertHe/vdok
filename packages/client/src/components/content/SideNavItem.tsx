import React, { FC } from "react"
import { NavLink } from "react-router-dom"
import { ISideNavItem } from "@herberthe/vdok-types"

export interface ISideNavItemProps extends ISideNavItem {
    key?: any
    url: string
}

const SideNavItem: FC<ISideNavItemProps> = ({ title, url }) => (
    <li className="w-full">
        {/* TODO 解决闪屏的问题 */}
        <NavLink
            to={url}
            className="w-full block hover:bg-red-50 dark:hover:bg-dark-200 py-2 px-3 rounded-md my-2 text-sm tracking-wide"
            activeClassName="bg-red-50 text-color-[#d43e2a] dark:bg-dark-200"
            exact={true}
            // onClick={() => location.replace(url)}
        >
            {title}
        </NavLink>
    </li>
)

export default SideNavItem
