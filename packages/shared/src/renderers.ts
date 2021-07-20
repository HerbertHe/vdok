import type { ILuteNode } from "./vditor-types"
import { ConvertAnchor } from "./converters"

interface INode extends ILuteNode {
    Text: () => string
}

declare let Lute: any

/**
 * 自定义渲染heading
 * @param node Vditor节点
 * @param entering 进入渲染状态
 */
function renderHeading(node: INode, entering: boolean): [string, number] {
    // BUG 插入锚点, 拿不到自定义锚点的问题
    if (entering) {
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

// TODO 自定义渲染代码块, 代码块高亮支持

const renderers = {
    renderHeading,
}

export { renderers }