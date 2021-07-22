import { lexer } from "marked"
import { ConvertAnchor, ConvertAnchorMagic } from "../utils/shared"

import type { IContentOutlineItem } from "../components/content/ContentOutline"

interface IMarkedHeading {
    depth: number
    text: string
}

export function GenerateContentOutline(
    content: string
): Array<IContentOutlineItem> {
    // TODO 修复不支持自定义锚点, 使用 hack 方法实现
    const [] = ConvertAnchorMagic(content)
    const filter = lexer(content).filter(
        (v) => v.type === "heading"
    ) as Array<IMarkedHeading>

    const res = filter.map((item: IMarkedHeading) => {
        const [anchor, heading] = ConvertAnchorMagic(item.text)

        return {
            heading,
            level: item.depth,
            anchor: ConvertAnchor(anchor),
        }
    }) as Array<IContentOutlineItem>

    return res
}
