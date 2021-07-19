import React, { FC } from "react"
import DarkSwitcher from "../layouts/DarkSwitcher"

const ContentHeader: FC = () => (
    <div className="w-full h-full px-20px flex flex-row justify-start items-center">
        <DarkSwitcher />
    </div>
)

export default ContentHeader
