import { detectEffectiveFiles } from "./detect"
import path from "path"
import fs from "fs"

test("测试有效文件侦测", () => {
    try {
        fs.writeFileSync(
            path.join(process.cwd(), "__test__", "detect.test.json"),
            JSON.stringify(detectEffectiveFiles())
        )
    } catch (e) {
        console.error(e)
    }
})
