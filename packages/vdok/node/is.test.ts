import { isIncludedInBCP47 } from "./is"

test("测试BCP47", () => {
    expect(isIncludedInBCP47("zh-CN")).toBe(true)
    expect(isIncludedInBCP47("ss-ssdf")).toBe(false)
})
