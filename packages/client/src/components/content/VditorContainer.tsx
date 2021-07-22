import React, { createRef, FC, useEffect } from "react"
import Vditor from "vditor"
import { renderers, ConvertHeadingMagic } from "../../utils/shared"

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
        if (!!markdown) {
            Vditor.preview(
                vditorContainerRef.current as HTMLDivElement,
                !!markdown ? markdown : "",
                {
                    renderers,
                    anchor: 1,
                    mode: "light",
                }
            ).then(() => {
                // 样式注入
                vditorContainerRef.current?.classList.add(
                    "vdok-vditor-container"
                )

                // 锚点定位
                const hash = `#${decodeURIComponent(
                    location.hash.substring(1, location.hash.length)
                )}`

                if (hash.length !== 1) {
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
        }
    }, [markdown])

    return !!markdown ? (
        <div ref={vditorContainerRef} className="w-full"></div>
    ) : (
        <NoContentFound />
    )
}

export default VditorContainer
