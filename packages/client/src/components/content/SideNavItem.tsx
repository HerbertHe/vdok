import React, { FC } from "react"
import { NavLink } from "react-router-dom"

export interface ISideNavItemProps {
    key?: any
    name: string
    url: string
}

const SideNavItem: FC<ISideNavItemProps> = ({ name, url }) => (
    <li className="w-full">
        <NavLink
            to={url}
            className="w-full block hover:bg-red-50 dark:hover:bg-dark-200 py-2 px-3 rounded-md my-2 text-sm tracking-wide"
            activeClassName="bg-red-50 text-color-[#d43e2a] dark:bg-dark-200"
            exact={true}
            onClick={() => location.replace(url)}
        >
            {name}
        </NavLink>
    </li>
)

export default SideNavItem
