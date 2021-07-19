import path from "path"
import fs from "fs"
import YAML from "yaml"

import { IVdokConfig, defaultVdokConfig } from "@herberthe/vdok-types"
import { cwd, vdokYamlConfigRegExp } from "./constants"

/**
 * 后缀优先级排序 .yaml > .yml
 */

/**
 * 合并 Vdok 的配置
 */
function mergeVdokConfig(custom: IVdokConfig, def: IVdokConfig): string {
    let _back: IVdokConfig = {}
    for (let item in def) {
        if (!!custom[item]) {
            _back[item] = custom[item]
        } else {
            _back[item] = def[item]
        }
    }
    return JSON.stringify(_back)
}

export function readVdokConfig(): string {
    const config = fs
        .readdirSync(cwd)
        .filter((f) => vdokYamlConfigRegExp.test(f))

    if (config.length === 0) {
        // 没有配置文件
        return JSON.stringify(defaultVdokConfig())
    } else {
        // 有配置文件的读取和merge操作
        const configed = YAML.parse(
            fs.readFileSync(path.join(cwd, config[0]), {
                encoding: "utf-8",
            })
        )

        if (!configed) {
            return JSON.stringify(defaultVdokConfig())
        } else {
            return mergeVdokConfig(configed as IVdokConfig, defaultVdokConfig())
        }
    }
}
