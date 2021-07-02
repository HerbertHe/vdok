import React, { FC } from "react"
import { SwitchTheme } from "../../utils/actions"

const ContentHeader: FC = () => (
    <div className="w-full h-full px-20px flex flex-row justify-start items-center">
        <button onClick={() => SwitchTheme()}>切换主题</button>
    </div>
)

export default ContentHeader
