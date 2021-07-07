import path from "path"
import fs from "fs"
import YAML from "yaml"

const cwd = process.cwd()

/**
 * TODO: 不再支持 .ts 配置文件, 注意在 client 端修正!!
 * 后缀优先级排序 .yaml > .yml
 */
const VdokYamlConfigRegExp = /vdok.config.y(a)?ml/

interface IVdokConfig {
    [index: string]: any
}

/**
 * 合并 Vdok 的配置
 */
function mergeVdokConfig(custom: IVdokConfig, def: IVdokConfig) {
    let _back: IVdokConfig = {}
    for (let item in def) {
        if (!custom[item]) {
            _back[item] = custom[item]
        } else {
            _back[item] = def[item]
        }
    }
    return YAML.stringify(_back)
}

/**
 * TODO: 默认 Vdok 的配置
 */
function defaultVdokConfig() {
    const def: IVdokConfig = {}
    return def
}

export function readVdokConfig() {
    const config = fs
        .readdirSync(cwd)
        .filter((f) => VdokYamlConfigRegExp.test(f))

    if (config.length === 0) {
        // 没有配置文件
        return YAML.stringify(defaultVdokConfig())
    } else {
        // 有配置文件的读取和merge操作
        const configed = YAML.parse(
            fs.readFileSync(path.join(cwd, config[0]), {
                encoding: "utf-8",
            })
        )

        if (!configed) {
            return YAML.stringify(defaultVdokConfig())
        } else {
            return mergeVdokConfig(configed as IVdokConfig, defaultVdokConfig())
        }
    }
}
