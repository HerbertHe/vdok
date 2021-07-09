import { generateRoutes } from "./routes"
import fs from "fs"
import path from "path"

test("测试有效文件结构", () => {
    try {
        fs.writeFileSync(
            path.join(process.cwd(), "__test__", "routes.test.json"),
            JSON.stringify(generateRoutes())
        )
    } catch (e) {
        console.error(e)
    }
})
