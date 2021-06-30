import React, { createRef, FC, useEffect } from "react"

import Vditor from "vditor"

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
        Vditor.preview(
            vditorContainerRef.current as HTMLDivElement,
            !!markdown ? markdown : ""
        )

        // console.log(markdown)
    }, [])
    return !!markdown ? (
        <div ref={vditorContainerRef} className="w-full"></div>
    ) : (
        <div>没有内容！</div>
    )
}

export default VditorContainer
