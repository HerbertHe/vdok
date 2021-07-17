import commonjs from "@rollup/plugin-commonjs"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import babel from "@rollup/plugin-babel"
import json from "@rollup/plugin-json"

import pkg from "./package.json"

const extensions = [".ts", ".js"]

export default {
    input: "./node/cli.ts",
    external: [
        "language-subtag-registry/data/json/index",
        "language-subtag-registry/data/json/macrolanguage",
        "language-subtag-registry/data/json/meta",
        "language-subtag-registry/data/json/registry",
        "fsevents",
    ],

    plugins: [
        json(),
        // Allows node_modules resolution
        nodeResolve({ extensions }),

        // Allow bundling cjs modules. Rollup doesn't understand cjs
        commonjs(),

        // Compile TypeScript/JavaScript files
        babel({ extensions, babelHelpers: "runtime", include: ["node/**/*"] }),
    ],

    output: {
        file: pkg.main,
        format: "cjs",
        banner: "#!/usr/bin/env node",
    },
}
