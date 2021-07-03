/**
 * IVdok配置类型定义
 */
export interface IVdokConfig {
    root: string
}

/**
 * Vdok配置定义帮助函数
 * @param config 配置项
 */
export function defineConfig(config: IVdokConfig) {
    return config
}
