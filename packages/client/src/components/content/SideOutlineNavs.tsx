import React, { Fragment } from "react"
import { ISideNavItem, ISideNavSection } from "@herberthe/vdok-types"

import SideNavItem from "./SideNavItem"
import SideSection from "./SideSection"

// import routes
import { routes, route } from "../../routes"

// TODO 优化 i18n 无缝切换

const SideOutlineNavs = () => (
    <div className="w-full flex flex-col h-full shadow py-20px dark:(bg-dark-800 text-white)">
        {/* 展示logo */}
        <h1 className="w-full text-center text-bold text-red-500">Vdok</h1>
        {/* 展示文档名 */}
        <ul className="h-auto overflow-auto mt-20px w-full px-5 vdok-scrollbar">
            {route.sections.map((item: ISideNavSection) => (
                <Fragment key={item.section}>
                    {!!item.section && <SideSection section={item} />}

                    {item.navs.map((j: ISideNavItem) => (
                        <SideNavItem
                            key={j.url}
                            url={j.url || ""}
                            title={j.title}
                        />
                    ))}
                </Fragment>
            ))}
        </ul>
    </div>
)

export default SideOutlineNavs
