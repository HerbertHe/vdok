import React, { Fragment } from "react"

import SideNavItem, { ISideNavItemProps } from "./SideNavItem"
import SideSection from "./SideSection"

export interface INavItemsWithSection {
    section: string
    navs: Array<ISideNavItemProps>
}

const routes: Array<INavItemsWithSection> = [
    {
        section: "ceshi",
        navs: [{ name: "测试1", url: "/test" }],
    },
    {
        section: "页面",
        navs: [{ name: "首页", url: "/" }],
    },
]

const SideOutlineNavs = () => (
    <div className="w-full flex flex-col h-full shadow py-20px dark:(bg-dark-800 text-white)">
        {/* 展示logo */}
        <h1 className="w-full text-center text-bold text-red-500">Vdok</h1>
        {/* 展示文档名 */}
        <ul className="h-auto overflow-auto mt-20px w-full px-5">
            {routes.map((item: INavItemsWithSection) => (
                <Fragment key={item.section}>
                    {!!item.section && <SideSection section={item.section} />}

                    {item.navs.map((item: ISideNavItemProps) => (
                        <SideNavItem key={item.url} {...item} />
                    ))}
                </Fragment>
            ))}
        </ul>
    </div>
)

export default SideOutlineNavs
