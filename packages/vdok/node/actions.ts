import fs from "fs"
import { md5 } from "hash-wasm"
import YAML from "yaml"
import prompts from "prompts"
import execa from "execa"

import { readVdokConfig } from "./config"
import { generateRoutes } from "./routes"
import { copyDirectory } from "./utils"

import {
    dotVdokDirPath,
    rawDocsPath,
    rawPackageJsonPath,
    rawVdokConfigYamlPath,
    rawVdokConfigYmlPath,
    vdokClientFromNodeModulesPath,
    vdokConfigPath,
    vdokDocsPath,
    vdokPackageJsonPath,
    vdokRoutesPath,
} from "./constants"

import { VdokConfigTemplate, VdokRoutesTemplate } from "./templates"

/**
 * 本地生成 .vdok 临时文件夹
 */
function generateDotVdok() {
    if (!fs.existsSync(dotVdokDirPath)) {
        // 生成文件夹
        fs.mkdirSync(dotVdokDirPath, { recursive: true })
    }
    return
}

/**
 * 写入配置文件
 */
export async function writeVdokConfig() {
    const writeContent = VdokConfigTemplate.replace(
        "/* Inject-Vdok-Config-Here */",
        readVdokConfig()
    )

    if (fs.existsSync(vdokConfigPath)) {
        const content = fs.readFileSync(vdokConfigPath, { encoding: "utf-8" })
        if (!!content && (await md5(content)) === (await md5(writeContent))) {
            return
        }
    }

    fs.writeFileSync(vdokConfigPath, writeContent)
}

export async function writeRoutesInfos() {
    if (!fs.existsSync(vdokRoutesPath)) {
        fs.unlinkSync(vdokRoutesPath)
    }

    let lang: string = ""

    if (fs.existsSync(rawVdokConfigYamlPath)) {
        const { lang: configLang } =
            YAML.parse(
                fs.readFileSync(rawVdokConfigYamlPath, { encoding: "utf-8" })
            ) || {}
        lang = !!configLang ? configLang : ""
    } else if (fs.existsSync(rawVdokConfigYmlPath)) {
        const { lang: configLang } =
            YAML.parse(
                fs.readFileSync(rawVdokConfigYmlPath, { encoding: "utf-8" })
            ) || {}
        lang = !!configLang ? configLang : ""
    }

    const langs = generateRoutes().map((i) => i.lang)

    if (!!lang && !langs.includes(lang)) {
        throw new Error(
            "The value of the configuration option `lang` is invalid, please check your Vdok config file!"
        )
    }

    fs.writeFileSync(
        vdokRoutesPath,
        JSON.stringify(
            VdokRoutesTemplate.replace(
                "/* inject-routes-here */",
                JSON.stringify(generateRoutes())
            )
        ),
        {
            encoding: "utf-8",
        }
    )
}

/**
 * 移动文本文件, 考虑性能优化
 */
export function copyDocs() {
    copyDirectory(rawDocsPath, vdokDocsPath)
}

/**
 * 移动文本文件
 */
export function copyMarkdownFile(src: string, dest: string) {
    const before = fs.readFileSync(src, { encoding: "utf-8" })
    const after = fs.readFileSync(src, { encoding: "utf-8" })

    if (md5(before) === md5(after)) {
        return
    }

    fs.copyFileSync(src, dest)
}

/**
 * 移动 vdok client文件
 */
export function copyVdokClient() {
    copyDirectory(vdokClientFromNodeModulesPath, dotVdokDirPath)
}

/**
 * 下载 .vdok 下面的 package 的包
 */
export async function installPackage() {
    const { dependencies, devDependencies } =
        JSON.parse(
            fs.readFileSync(vdokPackageJsonPath, {
                encoding: "utf-8",
            })
        ) || {}

    if (!dependencies && !devDependencies) {
        return
    }

    let dependenciesDownload: Array<string> = []
    let devDependenciesDownload: Array<string> = []

    for (let item in dependencies) {
        dependenciesDownload.push(`${item}@${dependencies[item]}`)
    }

    for (let item in devDependencies) {
        devDependenciesDownload.push(`${item}@${devDependencies[item]}`)
    }

    // 这里得考虑使用什么包管理工具
    const deps = dependenciesDownload.join(" ")
    const devDeps = devDependenciesDownload.join(" ")

    console.log(deps)
    console.log(devDeps)

    // 根目录执行下载指令
    const pkg =
        JSON.parse(
            fs.readFileSync(rawPackageJsonPath, { encoding: "utf-8" })
        ) || {}

    if (!pkg.agent) {
        const { agent1 } = await prompts({
            name: "agent1",
            type: "select",
            message: "选择包管理器",
            choices: ["yarn", "npm"].map((v) => ({
                value: v,
                title: v,
            })),
            initial: "npm",
        })

        // 写入配置项文件
        pkg.agent = agent1
        fs.writeFileSync(rawPackageJsonPath, JSON.stringify(pkg), {
            encoding: "utf-8",
        })

        await execa(agent1, [agent1 === "yarn" ? "add" : "install", deps])
        await execa(agent1, [
            agent1 === "yarn" ? "add --dev" : "install --dev",
            devDeps,
        ])
    } else {
        const agent = pkg.agent === "yarn" ? "yarn" : "npm"
        await execa(agent, [agent === "yarn" ? "add" : "install", deps])
        await execa(agent, [
            agent === "yarn" ? "add" : "install",
            devDeps,
            "--dev"
        ])
    }
}

/**
 * 初始化构建操作
 */
export function initialBuild() {
    // 生成 .vdok 文件夹
    generateDotVdok()
    // 移动vdok-client
    copyVdokClient()
    // 根目录下载依赖
    installPackage()
    // 移动路由文件
    writeRoutesInfos()
    // 移动配置文件
    writeVdokConfig()
    // 移动 docs
    copyDocs()
}
