import path from "path"
import type { HmrContext, PluginOption } from "vite"

const vdokDotPublicPath = path
    .join(process.cwd(), ".vdok", "public")
    .replace(/\\/g, "/")

/**
 * Vdok 定制的 vite 插件
 */
export default function VdokPlugin(): PluginOption {
    return {
        name: "vdok-plugin",
        handleHotUpdate: ({ file, server }: HmrContext) => {
            if (/\.md$/.test(file)) {
                const p = file.replace(vdokDotPublicPath, "")
                server.ws.send({
                    type: "custom",
                    event: "vdok:doc-update",
                    data: {
                        file: p,
                    },
                })
            }
        },
    }
}
