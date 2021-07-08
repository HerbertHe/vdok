import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import babel from "@rollup/plugin-babel"
import json from "@rollup/plugin-json"

import pkg from "./package.json"

const extensions = [".ts"]

export default {
    input: "./node/cli.ts",

    plugins: [
        json(),
        // Allows node_modules resolution
        resolve({ extensions }),

        // Allow bundling cjs modules. Rollup doesn't understand cjs
        commonjs(),

        // Compile TypeScript/JavaScript files
        babel({ extensions, babelHelpers: "bundled", include: ["node/**/*"] }),
    ],

    output: {
        file: pkg.main,
        format: "cjs",
        banner: "#!/usr/bin/env node",
    },
}
