import { handleEffectiveFiles } from "./handle"
import fs from "fs"
import path from "path"

test("测试有效文件结构", () => {
    try {
        fs.writeFileSync(
            path.join(process.cwd(), "__test__", "handle.test.json"),
            JSON.stringify(handleEffectiveFiles())
        )
    } catch (e) {
        console.error(e)
    }
})
