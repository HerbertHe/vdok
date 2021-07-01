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
            className="w-full block hover:bg-gray-100 py-2 px-3 rounded-md my-2 text-sm tracking-wide"
            activeClassName="bg-gray-100"
            activeStyle={{
                color: "#d43e2a",
            }}
            exact={true}
        >
            {name}
        </NavLink>
    </li>
)

export default SideNavItem
