import React, { FC } from "react"

import VdokConfig from "../../../vdok.config"

/**
 * Footer组件
 */
const Footer: FC = () => (
    <div className="w-full flex flex-col justify-center items-center pt-0 pb-10 mt-10 text-center select-none px-10">
        <hr className="w-full bg-gray-500 mb-5" />
        <div dangerouslySetInnerHTML={{ __html: VdokConfig.footer }}></div>
        <div className="w-full text-sm text-gray-500 mt-3">
            Powered by <a href="https://github.com/HerbertHe/vdok">Vdok</a>
        </div>
    </div>
)

export default Footer
