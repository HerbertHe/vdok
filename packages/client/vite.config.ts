import { defineConfig } from "vite"
import reactRefresh from "@vitejs/plugin-react-refresh"
import WindiCSS from "vite-plugin-windicss"
import VdokPlugin from "./vite-plugin-vdok"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [reactRefresh(), WindiCSS(), VdokPlugin()],
})
