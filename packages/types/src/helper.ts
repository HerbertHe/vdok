/**
 * IVdok配置类型定义
 */
export interface IVdokConfig {
    [key: string]: any
    dev?: boolean
    base?: string
    branch?: string
    root?: string
    lang?: string
    footer?: string
}

/**
 * Vdok配置定义帮助函数
 * @param config 配置项
 */
export function defineConfig(config: IVdokConfig) {
    return config
}

/**
 * 默认配置项
 */
export function defaultVdokConfig(): IVdokConfig {
    return {
        dev: true,
        base: "",
        branch: "main",
        root: "",
        lang: "",
        footer: "",
    }
}
