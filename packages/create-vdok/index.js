#!/usr/bin/env node

// @ts-check
const fs = require("fs")
const path = require("path")
const argv = require("minimist")(process.argv.slice(2))
const prompts = require("prompts")
const execa = require("execa")
const { red, gray, yellow, bold, dim, blue, green } = require("kolorist")
const { version } = require("./package.json")

const cwd = process.cwd()

const renameFiles = {
    _gitignore: ".gitignore",
    _npmrc: ".npmrc",
}

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
            initial: "vdok-docs-template",
        })

        targetDir = projName.trim()
    }

    const packageName = await getValidPkgName(targetDir)
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

    console.log(`生成文件于 ${targetDir}`)
    const templateDir = path.join(__dirname, "template")

    // _gitignore重命名操作
    const write = (file, content) => {
        const targetPath = renameFiles[file]
            ? path.join(root, renameFiles[file])
            : path.join(root, file)
        if (content) {
            fs.writeFileSync(targetPath, content)
        } else {
            // 处理无内容和目录情况
            copy(path.join(templateDir, file), targetPath)
        }
    }

    // 遍历写入文件
    const files = fs.readdirSync(templateDir)
    for (const file of files.filter((f) => f !== "package.json")) {
        write(file)
    }

    // 处理 "package.json"
    const pkg = require(path.join(templateDir, "package.json"))

    pkg.name = packageName
    pkg.vdok = true

    write("package.json", JSON.stringify(pkg, null, 2))

    // 包管理器只考虑支持yarn和npm
    const pkgManager = /yarn/.test(process.env.npm_execpath) ? "yarn" : "npm"

    const related = path.relative(cwd, root)

    console.log(green("  完成!\n"))

    const { ok } = await prompts({
        type: "confirm",
        name: "ok",
        initial: "Y",
        message: "下载并启动?",
    })

    if (ok) {
        const { agent } = await prompts({
            name: "agent",
            type: "select",
            message: "选择包管理器",
            choices: ["yarn", "npm"].map((v) => ({
                value: v,
                title: v,
            })),
        })

        // 不选择退出
        if (!agent) {
            return
        }

        // 二写入 pkg
        pkg.agent = agent

        write("package.json", JSON.stringify(pkg, null, 2))

        // 执行下载运行
        await execa(agent, ["install"], { stdio: "inherit", cwd: root })
        await execa(agent, ["run", "dev"], { stdin: "inherit", cwd: root })
    } else {
        console.log("稍后通过下述步骤启动:\n")
        if (root !== cwd) {
            console.log(blue(`  cd ${bold(related)}`))
        }

        console.log(
            blue(
                `  ${pkgManager === "yarn" ? "yarn" : `${pkgManager} install`}`
            )
        )
        console.log(
            blue(
                `  ${
                    pkgManager === "yarn" ? "yarn dev" : `${pkgManager} run dev`
                }`
            )
        )
        console.log()
    }
}

// 包名过滤,符合npm规则
async function getValidPkgName(projName) {
    projName = path.basename(projName)
    const pkgNameRegExp =
        /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/
    if (pkgNameRegExp.test(projName)) {
        return projName
    } else {
        const suggest = projName
            .trim()
            .toLowerCase()
            .replace(/s+/g, "-")
            .replace(/^[._]/, "")
            .replace(/[^a-z0-9\~]/, "-")

        const { inputPkgName } = await prompts({
            type: "text",
            name: "inputPkgName",
            message: "Package name:",
            initial: suggest,
            validate: (input) =>
                pkgNameRegExp.test(input) ? true : "不合法 package.json 包名",
        })

        return inputPkgName
    }
}

function copy(src, dest) {
    const stat = fs.statSync(src)
    if (stat.isDirectory()) {
        copyDir(src, dest)
    } else {
        fs.copyFileSync(src, dest)
    }
}

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true })
    // 遍历递归复制文件
    for (const file of fs.readdirSync(src)) {
        const srcFile = path.resolve(src, file)
        const destFile = path.resolve(dest, file)
        copy(srcFile, destFile)
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
