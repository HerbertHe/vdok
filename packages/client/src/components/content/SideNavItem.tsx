import React, { FC } from "react"
import { NavLink } from "react-router-dom"
import { ISideNavItem } from "@herberthe/vdok-types"
import DraftTag from "../extra/DraftTag"

export interface ISideNavItemProps extends ISideNavItem {
    key?: any
    url: string
}

const SideNavItem: FC<ISideNavItemProps> = ({ title, url, draft }) => (
    <li className="w-full my-1.5">
        <NavLink
            to={url}
            className="w-full block hover:bg-red-50 dark:hover:bg-dark-200 py-2 px-3 rounded-md text-sm tracking-wide flex flex-row justify-between items-center"
            activeClassName="bg-red-50 text-color-[#d43e2a] dark:bg-dark-200"
            exact={true}
        >
            <span className="flex-1">{title}</span>

            {!!draft && <DraftTag />}
        </NavLink>
    </li>
)

export default SideNavItem
