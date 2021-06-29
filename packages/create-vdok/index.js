#!/usr/bin/env node

// @ts-check
const fs = require("fs")
const path = require("path")
const argv = require("minimist")(process.argv.slice(2))
const prompts = require("prompts")
const execa = require("execa")
const { red, gray, yellow, bold, dim, blue } = require("kolorist")
const { version } = require("./package.json")

const cwd = process.cwd()

async function init() {
    console.log()
    console.log(`  ${red("+".repeat(20))}\n`)
    console.log(`  ${bold("Vdok") + dim(" Creator")} ${blue(`v${version}`)}\n`)
    console.log(`  ${gray("-".repeat(20))}\n`)

    let targetDir = argv._[0]
    if (!targetDir) {
        const { projName } = await prompts({
            type: "text",
            name: "projName",
            message: "项目名称",
            initial: "vdok",
        })

        targetDir = projName.trim()
    }

    // 校验包名合法化
    const packageName = targetDir
    const root = path.join(cwd, targetDir)

    if (!fs.existsSync(root)) {
        fs.mkdirSync(root, { recursive: true })
    } else {
        const files = fs.readdirSync(root)
        if (files.length) {
            console.log(yellow(`目标文件夹 ${root} 不为空!!`))

            const { ok } = await prompts({
                type: "confirm",
                name: "ok",
                initial: "Y",
                message: "删除已存在所有文件并继续?",
            })

            if (ok) {
                // 清空文件夹
                emptyDir(root)
            } else {
                // 退出初始化
                return
            }
        }
    }
}

function emptyDir(dir) {
    if (!fs.existsSync(dir)) return

    for (const file of fs.readdirSync(dir)) {
        const abs = path.resolve(dir, file)
        if (fs.lstatSync(abs).isDirectory()) {
            // 递归文件
            emptyDir(abs)
            fs.rmdirSync(abs)
        } else {
            fs.unlinkSync(abs)
        }
    }
}

init().catch((e) => {
    console.error(e)
})
