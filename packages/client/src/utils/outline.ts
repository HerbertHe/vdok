import { lexer } from "marked"

import type { IContentOutlineItem } from "../components/content/ContentOutline"

interface IMarkedHeading {
    depth: number
    text: string
}

export function GenerateContentOutline(
    content: string
): Array<IContentOutlineItem> {
    const AnchorRegExp = /\{#([\S]*)\}/
    const filter = lexer(content).filter(
        (v) => v.type === "heading"
    ) as Array<IMarkedHeading>

    const res = filter.map((item: IMarkedHeading) => {
        const anchorArray = AnchorRegExp.exec(item.text)

        return {
            heading: item.text.replace(AnchorRegExp, "").trim(),
            level: item.depth,
            anchor: !!anchorArray ? anchorArray[1] : "",
        }
    }) as Array<IContentOutlineItem>

    return res
}
