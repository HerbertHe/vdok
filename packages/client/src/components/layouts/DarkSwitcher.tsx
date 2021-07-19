import React, { FC, useEffect, useState } from "react"
import { Moon, SunOne } from "@icon-park/react"

import { SwitchTheme, isDarkMode } from "../../utils/actions"

/**
 * 夜间模式切换
 */
const DarkSwitcher: FC = () => {
    const [dark, setDark] = useState(isDarkMode)
    useEffect(() => {
        // AutoDarkMode()
        // 自动切换夜间模式
    })
    return (
        <button
            onClick={() => {
                SwitchTheme()
                setDark(!dark)
            }}
            className="rounded bg-red-50 w-9 h-9 flex justify-center items-center dark:bg-dark-200 outline-none focus:outline-none"
        >
            {!dark && <SunOne theme="filled" size="20" fill="#24292e" />}
            {dark && <Moon theme="outline" size="20" fill="#fff" />}
        </button>
    )
}

export default DarkSwitcher
