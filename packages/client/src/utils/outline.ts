import { lexer } from "marked"

import type { IContentOutlineItem } from "../components/content/ContentOutline"
import { ConvertAnchor } from "./converters"

interface IMarkedHeading {
    depth: number
    text: string
}

export function GenerateContentOutline(
    content: string
): Array<IContentOutlineItem> {
    // TODO 修复不支持自定义锚点
    const AnchorRegExp = /\{#([\S]*)\}/
    const filter = lexer(content).filter(
        (v) => v.type === "heading"
    ) as Array<IMarkedHeading>

    const res = filter.map((item: IMarkedHeading) => {
        const anchorArray = AnchorRegExp.exec(item.text)

        const heading = item.text.replace(AnchorRegExp, "").trim()

        return {
            heading,
            level: item.depth,
            anchor: !!anchorArray
                ? ConvertAnchor(anchorArray[1])
                : ConvertAnchor(heading),
        }
    }) as Array<IContentOutlineItem>

    return res
}
