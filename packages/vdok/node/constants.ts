// 在此定义常量命名
import path from "path"

export const cwd = process.cwd()

/**
 * 项目根目录路径
 */
export const dotVdokDirPath = path.join(cwd, ".vdok")
export const rawVdokConfigYamlPath = path.join(cwd, "vdok.config.yaml")
export const rawVdokConfigYmlPath = path.join(cwd, "vdok.config.yml")
export const rawDocsPath = path.join(cwd, "docs")
export const rawPackageJsonPath = path.join(cwd, "package.json")
export const distPath = path.join(cwd, "dist")
export const rootNodeModulesPath = path.join(cwd, "node_modules")

export const vdokClientFromNodeModulesPath = path.join(
    cwd,
    "node_modules",
    "@herberthe",
    "vdok-client"
)

/**
 * .vdok 子路径
 */
export const vdokConfigPath = path.join(dotVdokDirPath, "vdok.config.ts")
export const vdokRoutesPath = path.join(dotVdokDirPath, "src", "routes.ts")
export const vdokPublicPath = path.join(dotVdokDirPath, "public")
export const vdokDocsPath = path.join(dotVdokDirPath, "public", "docs")
export const vdokPackageJsonPath = path.join(dotVdokDirPath, "package.json")
export const vdokViteConfigPath = path.join(dotVdokDirPath, "vite.config.ts")
export const vdokNodeModulesPath = path.join(dotVdokDirPath, "node_modules")

/**
 * 正则表达式
 */
export const vdokYamlConfigRegExp = /vdok.config.y(a)?ml/
