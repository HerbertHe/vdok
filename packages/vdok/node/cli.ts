import { Command } from "commander"
import { version } from "../package.json"

// 初始化命令行
const cli = new Command()

cli.name("vdok").version(version)

cli.command("dev")
    .description("启动开发")
    .action(() => {
        console.log("开发模式")
    })

cli.command("build")
    .description("构建产物")
    .action(() => {
        console.log("产物输出")
    })

cli.parse(process.argv)