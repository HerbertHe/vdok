import path from "path"
import fs from "fs"
import YAML from "yaml"

import { IVdokConfig } from "@herberthe/vdok-types"

const cwd = process.cwd()

/**
 * 后缀优先级排序 .yaml > .yml
 */
const VdokYamlConfigRegExp = /vdok.config.y(a)?ml/

/**
 * 合并 Vdok 的配置
 */
function mergeVdokConfig(custom: IVdokConfig, def: IVdokConfig): string {
    let _back: IVdokConfig = {}
    for (let item in def) {
        if (!custom[item]) {
            _back[item] = custom[item]
        } else {
            _back[item] = def[item]
        }
    }
    return Object.prototype.toString.call(_back)
}

/**
 * TODO: 默认 Vdok 的配置
 */
function defaultVdokConfig(): IVdokConfig {
    const def: IVdokConfig = {}
    return def
}

export function readVdokConfig(): string {
    const config = fs
        .readdirSync(cwd)
        .filter((f) => VdokYamlConfigRegExp.test(f))

    if (config.length === 0) {
        // 没有配置文件
        return Object.prototype.toString.call(defaultVdokConfig())
    } else {
        // 有配置文件的读取和merge操作
        const configed = YAML.parse(
            fs.readFileSync(path.join(cwd, config[0]), {
                encoding: "utf-8",
            })
        )

        if (!configed) {
            return Object.prototype.toString.call(defaultVdokConfig())
        } else {
            return mergeVdokConfig(configed as IVdokConfig, defaultVdokConfig())
        }
    }
}
