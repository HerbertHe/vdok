import React, { createRef, FC, useEffect } from "react"
import Vditor from "vditor"

import "../../styles/vdok-vditor-container.less"

import NoContentFound from "../errors/NoContentFound"

export interface IVditorContainerProps {
    markdown?: string
}

/**
 * markdown内容渲染容器, 远程获取markdown
 * @param markdown
 */
const VditorContainer: FC<IVditorContainerProps> = ({ markdown }) => {
    const vditorContainerRef = createRef<HTMLDivElement>()
    useEffect(() => {
        // TODO 处理Vditor奇异锚点渲染的问题
        Vditor.preview(
            vditorContainerRef.current as HTMLDivElement,
            !!markdown ? markdown : ""
        ).then(() => {
            // 样式注入
            vditorContainerRef.current?.classList.add("vdok-vditor-container")

            // 锚点定位
            const hash = location.hash
            const target = document.querySelector(hash) as HTMLHeadingElement

            if (!!hash && !!target) {
                scrollTo({
                    top: target.offsetTop - 80,
                })
            }
        })
    }, [])
    return !!markdown ? (
        <div ref={vditorContainerRef} className="w-full"></div>
    ) : (
        <NoContentFound />
    )
}

export default VditorContainer
