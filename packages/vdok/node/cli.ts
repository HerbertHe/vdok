import { Command } from "commander"
import { version } from "../package.json"
import { runDev } from "./dev"

// 初始化命令行
const cli = new Command()

cli.name("vdok").version(version)

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
