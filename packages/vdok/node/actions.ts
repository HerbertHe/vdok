import fs from "fs"
import path from "path"
import { bcryptVerify, md5 } from "hash-wasm"
import YAML from "yaml"

import { readVdokConfig } from "./config"
import { generateRoutes } from "./routes"
import { copyDirectory } from "./utils"

const cwd = process.cwd()

const dotVdokDir = path.join(cwd, ".vdok")
const VdokRawConfigYamlPath = path.join(cwd, "vdok.config.yaml")
const VdokRawConfigYmlPath = path.join(cwd, "vdok.config.yml")

/**
 * 本地生成 .vdok 临时文件夹
 */
function generateDotVdok() {
    if (!fs.existsSync(dotVdokDir)) {
        // 生成文件夹
        fs.mkdirSync(dotVdokDir, { recursive: true })
    }
    return
}

/**
 * Vdok配置模板
 */
const VdokConfigTemplate = String.raw`// Vdok Config File through automatic generation

export default defineConfig(/* Inject-Vdok-Config-Here */)
`

const VdokConfigPath = path.join(dotVdokDir, "vdok.config.ts")

/**
 * 写入配置文件
 */
export async function writeVdokConfig() {
    const writeContent = VdokConfigTemplate.replace(
        "/* Inject-Vdok-Config-Here */",
        readVdokConfig()
    )

    if (fs.existsSync(VdokConfigPath)) {
        const content = fs.readFileSync(VdokConfigPath, { encoding: "utf-8" })
        if (!!content && (await md5(content)) === (await md5(writeContent))) {
            return
        }
    }

    fs.writeFileSync(VdokConfigPath, writeContent)
}

/**
 * Vdok Routes 模板
 */
const VdokRoutesTemplate = String.raw`// Vdok Routes File through automatic generation
import { IRouteItem } from "@herberthe/vdok-types"
import VdokConfig from "../vdok.config"

const { lang } = VdokConfig

const routes: Array<IRouteItem> = /* inject-routes-here */

const route =
    routes.length === 1
        ? routes[0]
        : !!lang
        ? routes.filter((item) => item.lang === lang)
        : routes[0]

export { routes, route }
`

const VdokRoutesPath = path.join(cwd, ".vdok", "src", "routes.ts")

export async function writeRoutesInfos() {
    if (!fs.existsSync(VdokRoutesPath)) {
        fs.unlinkSync(VdokRoutesPath)
    }

    let lang: string = ""

    if (fs.existsSync(VdokRawConfigYamlPath)) {
        const { lang: configLang } = YAML.parse(
            fs.readFileSync(VdokRawConfigYamlPath, { encoding: "utf-8" })
        )
        lang = !!configLang ? configLang : ""
    } else if (fs.existsSync(VdokRawConfigYmlPath)) {
        const { lang: configLang } = YAML.parse(
            fs.readFileSync(VdokRawConfigYmlPath, { encoding: "utf-8" })
        )
        lang = !!configLang ? configLang : ""
    }

    const langs = generateRoutes().map((i) => i.lang)

    if (!!lang && !langs.includes(lang)) {
        throw new Error(
            "The value of the configuration option `lang` is invalid, please check your Vdok config file!"
        )
    }

    fs.writeFileSync(
        VdokRoutesPath,
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

const ProjDocsPath = path.join(cwd, "docs")
const VdokDocsPath = path.join(dotVdokDir, "public", "docs")

/**
 * 移动文本文件, 考虑性能优化
 */
export function copyDocs() {
    copyDirectory(ProjDocsPath, VdokDocsPath)
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

const VdokClientFromNodeModules = path.join(
    cwd,
    "node_modules",
    "@herberthe",
    "vdok-client"
)

/**
 * 移动 vdok client文件
 */
export function copyVdokClient() {
    copyDirectory(VdokClientFromNodeModules, dotVdokDir)
}

/**
 * 初始化构建操作
 */
export function initialBuild() {
    // 生成 .vdok 文件夹
    generateDotVdok()
    // 移动vdok-client
    copyVdokClient()
    // 移动配置文件
    writeVdokConfig()
    // 移动 docs
    copyDocs()
}
