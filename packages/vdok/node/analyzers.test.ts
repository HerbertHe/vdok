import { analyzeArticleFeatures } from "./analyzers"

test("测试 section index 的 yaml features", () => {
    expect(analyzeArticleFeatures("order: 3\ntitle: 测试")).toEqual({
        order: 3,
        title: "测试",
    })

    expect(analyzeArticleFeatures("title: 测试")).toEqual({
        order: 0,
        title: "测试",
    })
})
