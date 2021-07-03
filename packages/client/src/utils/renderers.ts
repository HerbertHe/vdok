// Vditor自定义render

import { ConvertAnchor } from "./converters"

declare let Lute: any

/**
 * 自定义渲染heading
 * @param node Vditor节点
 * @param entering 进入渲染状态
 */
function renderHeading(node: any, entering: boolean) {
    // TODO 插入锚点, 拿不到自定义锚点的问题
    if (entering) {
        console.log(node.__internal_object__)
        return [
            `<h${node.__internal_object__.HeadingLevel} id=${ConvertAnchor(
                node.Text()
            )}>`,
            Lute.WalkContinue,
        ]
    } else {
        return [
            `</h${node.__internal_object__.HeadingLevel}>`,
            Lute.WalkContinue,
        ]
    }
}

const renderers = {
    renderHeading,
}

export { renderers }
