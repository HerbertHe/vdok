import { Command } from "commander"
import { version } from "../package.json"
import { runDev } from "./dev"

// 初始化命令行
const cli = new Command()

cli.name("vdok").version(version)

// TODO 新增 preview 命令优化跳过依赖重新下载流程
cli.command("dev")
    .description("Start development")
    .action(() => {
        runDev()
    })

cli.command("build")
    .description("Build product")
    .action(() => {
        console.log("产物输出")
    })

cli.parse(process.argv)
