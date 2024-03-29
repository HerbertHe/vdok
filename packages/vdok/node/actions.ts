import fs from "fs"
import { md5 } from "hash-wasm"
import YAML from "yaml"
import prompts from "prompts"
import execa from "execa"

import { readVdokConfig } from "./config"
import { generateRoutes } from "./routes"
import {
    copyDirectory,
    debugInfo,
    deleteAllFiles,
    exportLabel,
    exportPass,
} from "./utils"

import {
    dotVdokDirPath,
    rawDocsPath,
    rawLocalesPath,
    rawPackageJsonPath,
    rawVdokConfigYamlPath,
    rawVdokConfigYmlPath,
    rootNodeModulesPath,
    vdokClientFromNodeModulesPath,
    vdokConfigPath,
    vdokDocsPath,
    vdokLocalesPath,
    vdokNodeModulesPath,
    vdokPackageJsonPath,
    vdokPublicPath,
    vdokRoutesPath,
} from "./constants"

import { VdokConfigTemplate, VdokRoutesTemplate } from "./templates"

/**
 * 本地生成 .vdok 临时文件夹
 */
export function generateDotVdok() {
    if (!fs.existsSync(dotVdokDirPath)) {
        // 生成文件夹
        fs.mkdirSync(dotVdokDirPath, { recursive: true })
        console.log(exportPass("Generate .vdok"))
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
    console.log(exportPass("Write Vdok Config"))
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
        VdokRoutesTemplate.replace(
            "/* inject-routes-here */",
            JSON.stringify(generateRoutes())
        ),
        {
            encoding: "utf-8",
        }
    )
    console.log(exportPass("Write Routes Infos"))
}

export function createSymlinkForDocs() {
    if (process.env.VDOK_DEBUG === "DEBUG") {
        console.log(debugInfo("Create Symlink for .vdok/public/docs"))
    }

    if (!fs.existsSync(rawDocsPath)) {
        throw new Error("No docs folder in root path!")
    }

    if (fs.existsSync(vdokDocsPath)) {
        deleteAllFiles(vdokDocsPath)
    }

    if (!fs.existsSync(vdokPublicPath)) {
        fs.mkdirSync(vdokPublicPath, { recursive: true })
    }

    fs.symlinkSync(rawDocsPath, vdokDocsPath, "dir")
    console.log(exportPass("Create symlink for docs"))
}

export function createSymlinkForLocales() {
    if (process.env.VDOK_DEBUG === "DEBUG") {
        console.log(debugInfo("Create Symlink for .vdok/public/locales"))
    }

    if (!fs.existsSync(rawLocalesPath)) {
        throw new Error("No locales folder in root path!")
    }

    if (fs.existsSync(vdokLocalesPath)) {
        deleteAllFiles(vdokLocalesPath)
    }

    if (!fs.existsSync(vdokPublicPath)) {
        fs.mkdirSync(vdokPublicPath, { recursive: true })
    }

    fs.symlinkSync(rawLocalesPath, vdokLocalesPath, "dir")
    console.log(exportPass("Create symlink for locales"))
}

/**
 * 移动 vdok client文件
 */
export function copyVdokClient() {
    console.log(exportLabel("Copy Vdok Client Start~"))
    copyDirectory(vdokClientFromNodeModulesPath, dotVdokDirPath)
    console.log(exportPass("Copy Vdok Client"))
}

/**
 * 清理不必要显示的包信息
 */
function cleanPackageJson(dev: Array<string>, dep: Array<string>) {
    console.log(exportLabel("Clean package.json start~"))
    let pkg = JSON.parse(
        fs.readFileSync(rawPackageJsonPath, { encoding: "utf-8" })
    )

    const reservedDep = [
        "@herberthe/vdok-client",
        "@herberthe/vdok-cli",
        "@herberthe/vdok-types",
    ]
    const reservedDev = ["cross-env"]

    for (let item of dev) {
        if (!reservedDev.includes(item)) {
            delete pkg.devDependencies[item]
        }
    }

    for (let item of dep) {
        if (!reservedDep.includes(item)) {
            delete pkg.dependencies[item]
        }
    }

    fs.writeFileSync(rawPackageJsonPath, JSON.stringify(pkg), {
        encoding: "utf-8",
    })
    console.log(exportPass("Clean package.json"))
}

/**
 * 下载 .vdok 下面的 package 的包
 */
export async function installPackage() {
    console.log(exportLabel("Install Packages for Client start~"))
    const { dependencies, devDependencies } =
        JSON.parse(
            fs.readFileSync(vdokPackageJsonPath, {
                encoding: "utf-8",
            })
        ) || {}

    if (!dependencies && !devDependencies) {
        console.log(exportPass("Install Packages for Client"))
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

    if (process.env.VDOK_DEBUG === "DEBUG") {
        console.log(
            debugInfo(
                "Vdok Client Dependencies",
                JSON.stringify(dependenciesDownload)
            )
        )
        console.log(
            debugInfo(
                "Vdok Client Dev Dependencies",
                JSON.stringify(devDependenciesDownload)
            )
        )
    }

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

        console.log(exportLabel("Install dependencies start~"))
        const task1 = await execa(agent1, [
            agent1 === "yarn" ? "add" : "install",
            ...dependenciesDownload,
        ])
        console.log(exportPass("Install dependencies"))

        if (process.env.VDOK_DEBUG === "DEBUG") {
            console.log(
                debugInfo("Download dependencies task", JSON.stringify(task1))
            )
        }

        console.log(exportLabel("Install devdependencies start~"))
        const task2 = await execa(agent1, [
            agent1 === "yarn" ? "add --dev" : "install --dev",
            ...devDependenciesDownload,
        ])
        console.log(exportPass("Install devdependencies"))

        if (process.env.VDOK_DEBUG === "DEBUG") {
            console.log(
                debugInfo(
                    "Download devdependencies task",
                    JSON.stringify(task2)
                )
            )
        }
    } else {
        const agent = pkg.agent === "yarn" ? "yarn" : "npm"

        console.log(exportLabel("Install dependencies start~"))
        const task1 = await execa(agent, [
            agent === "yarn" ? "add" : "install",
            ...dependenciesDownload,
        ])
        console.log(exportPass("Install dependencies"))

        if (process.env.VDOK_DEBUG === "DEBUG") {
            console.log(
                debugInfo("Download dependencies task", JSON.stringify(task1))
            )
        }

        console.log(exportLabel("Install devdependencies start~"))
        const task2 = await execa(agent, [
            agent === "yarn" ? "add" : "install",
            ...devDependenciesDownload,
            "--dev",
        ])
        console.log(exportPass("Install devdependencies"))

        if (process.env.VDOK_DEBUG === "DEBUG") {
            console.log(
                debugInfo(
                    "Download devdependencies task",
                    JSON.stringify(task2)
                )
            )
        }
    }

    cleanPackageJson(Object.keys(devDependencies), Object.keys(dependencies))
}

export function createSymlinkForInnerNodeModules() {
    if (process.env.VDOK_DEBUG === "DEBUG") {
        console.log(debugInfo("Create symlink for .vdok/node_modules"))
    }
    if (!fs.existsSync(rootNodeModulesPath)) {
        throw new Error("No node_modules folder in root path!")
    }

    if (fs.existsSync(vdokNodeModulesPath)) {
        deleteAllFiles(vdokNodeModulesPath)
    }

    fs.symlinkSync(rootNodeModulesPath, vdokNodeModulesPath, "dir")
    console.log(exportPass("Create symlink for .vdok/node_modules"))
}
