import fs from "fs"
import { md5 } from "hash-wasm"
import { execSync } from "child_process"
import YAML from "yaml"

import { readVdokConfig } from "./config"
import { generateRoutes } from "./routes"
import { copyDirectory } from "./utils"

import {
    dotVdokDirPath,
    rawDocsPath,
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
export function installPackage() {
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

    for (let item of dependencies) {
        dependencies.push(`${item}@${dependencies[item]}`)
    }

    for (let item of devDependencies) {
        devDependencies.push(`${item}@${devDependencies[item]}`)
    }

    // 这里得考虑使用什么包管理工具
    const deps = dependenciesDownload.join(" ")
    const devDeps = devDependenciesDownload.join(" ")

    // 根目录执行下载指令
    // execSync("")
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
    // 移动路由文件
    writeRoutesInfos()
    // 移动配置文件
    writeVdokConfig()
    // 移动 docs
    copyDocs()
}
