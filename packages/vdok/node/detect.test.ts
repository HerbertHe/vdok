import { detectEffectiveFiles } from "./detect"

test("测试有效文件侦测", () => {
    const res = detectEffectiveFiles()
    console.log(res[1].sections)
})
