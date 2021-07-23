import type { ILuteNode } from "./vditor-types"
import { ConvertAnchor, ConvertAnchorMagic } from "./converters"

interface INode extends ILuteNode {
    Text: () => string
}

declare let Lute: any

function bytes2Str(bytes: any): string {
    return String.fromCharCode.apply(String, bytes)
}

/**
 * 自定义渲染heading
 * @param node Vditor节点
 * @param entering 进入渲染状态
 */
function renderHeading(node: INode, entering: boolean): [string, number] {
    // BUG 插入锚点, 原生拿不到自定义锚点的问题, hack 实现
    if (entering) {
        const [anchor, text] = ConvertAnchorMagic(node.Text())
        return [
            `<h${node.__internal_object__.HeadingLevel} id=${ConvertAnchor(
                anchor
            )}>${text}`,
            Lute.WalkSkipChildren,
        ]
    } else {
        return [
            `</h${node.__internal_object__.HeadingLevel}>`,
            Lute.WalkContinue,
        ]
    }
}

function renderCodeBlock(node: any, entering: boolean): [string, number] {
    // TODO 下面的特性来源于 slidev
    // const vdokSpecialHighlight = //

    // TODO react 仅支持 .tsx, vue 仅支持 .vue
    // TODO 组件支持 iframe 模式?
    const vdokSpecialExtendLanguage = ["vdok:react", "vdok:vue"]

    if (entering) {
        const language = bytes2Str(
            node.__internal_object__.CodeBlockInfo.$array
        )
            .trim()
            .toLowerCase()
        const content = node.Content()
        if (vdokSpecialExtendLanguage.includes(language)) {
            console.log("当前激活了vdok的组件渲染模式")
            // TODO 在此拓展组件
            return [
                `<iframe srcdoc="${content}"></iframe>`,
                Lute.WalkSkipChildren,
            ]
        }
        return ["", Lute.WalkContinue]
    } else {
        return ["", Lute.WalkContinue]
    }
}

export const renderers = {
    renderHeading,
    renderCodeBlock,
}
