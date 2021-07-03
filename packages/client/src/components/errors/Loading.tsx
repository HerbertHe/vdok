import React, { FC } from "react"
import { Loading as LoadingIcon } from "@icon-park/react"

/**
 * TODO: 加载动画
 */
const Loading: FC = () => (
    <div className="animate-spin">
        <LoadingIcon theme="filled" size="40" fill="#d43e2a" />
    </div>
)

export default Loading
