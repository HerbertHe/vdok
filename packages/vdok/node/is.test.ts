import { exist_indexInPath, isI18nMode, isIncludedInBCP47 } from "./is"
import path from "path"

test("测试BCP47", () => {
    expect(isIncludedInBCP47("zh-CN")).toBe(true)
    expect(isIncludedInBCP47("ss-ssdf")).toBe(false)
})

test("测试是否处于i18n模式", () => {
    // console.log(isI18nMode(process.cwd()))
})

test("判断指定路径下是否存在_index.md文件", () => {
    // console.log(exist_indexInPath(path.join(process.cwd(), "docs")))
})
