import { defineConfig } from "vite-plugin-windicss"
import { resolve } from "path"

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
})
