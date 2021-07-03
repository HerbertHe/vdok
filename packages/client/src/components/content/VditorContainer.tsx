import React, { createRef, FC, useEffect } from "react"
import Vditor from "vditor"

import "../../styles/vdok-vditor-container.less"
import { renderers } from "../../utils/renderers"

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
            !!markdown ? markdown : "",
            {
                renderers,
            }
        ).then(() => {
            // 样式注入
            vditorContainerRef.current?.classList.add("vdok-vditor-container")

            // 锚点定位
            const hash = `#${decodeURIComponent(
                location.hash.substring(1, location.hash.length)
            )}`

            if (!!hash) {
                const target = document.querySelector(
                    hash
                ) as HTMLHeadingElement
                if (!!target) {
                    scrollTo({
                        top: target.offsetTop - 80,
                    })
                }
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
