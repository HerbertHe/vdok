import React, { FC } from "react"

import VdokConfig from "../../vdok.config"

/**
 * Footer组件
 */
const Footer: FC = () => (
    <div className="w-full flex flex-col justify-center items-center py-20px text-center">
        <div dangerouslySetInnerHTML={{ __html: VdokConfig.footer }}></div>
        <div className="w-full">
            Powered by <a href="https://github.com/HerbertHe/vdok">Vdok</a>
        </div>
    </div>
)

export default Footer
