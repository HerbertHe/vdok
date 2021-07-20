import { defineConfig } from "vite-plugin-windicss"
import { resolve } from "path"

import PluginScrollBar from "@windicss/plugin-scrollbar"

export default defineConfig({
    extract: {
        exclude: [
            ".git",
            "dist",
            resolve(process.cwd(), ".git"),
            resolve(process.cwd(), "dist"),
            // 排除node_modules影响
            resolve(__dirname, "node_modules"),
            resolve(__dirname, "windi.config.ts"),
        ],
    },
    darkMode: "class",
    plugins: [PluginScrollBar],
    shortcuts: {
        "vdok-scrollbar":
            "scrollbar-thin scrollbar-thumb-light-900 scrollbar-track-light-500 dark:(scrollbar-track-transparent scrollbar-thumb-dark-100)",
    },
})
