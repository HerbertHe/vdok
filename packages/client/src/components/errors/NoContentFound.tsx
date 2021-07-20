import React, { FC } from "react"
import { Error } from "@icon-park/react"

const NoContentFound: FC = () => (
    <div className="w-full flex flex-col justify-start items-center py-20">
        <Error theme="outline" size="80" fill="#d43e2a" />
        <div className="mt-6 font-bold text-3xl text-color-[#d43e2a]">
            文件中无内容!
        </div>
        <div className="text-gray-400">No Content Found!</div>
        <div className="mt-4 text-xl dark:text-light-900">
            回到<a className="vdok-special-a" href="/">首页</a>?
        </div>
        <div className="text-gray-400 text-sm">
            Back to <a className="vdok-special-a" href="/">Home</a>?
        </div>
    </div>
)

export default NoContentFound
