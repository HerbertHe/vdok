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
        nodeResolve({ extensions, preferBuiltins: true }),

        // Allow bundling cjs modules. Rollup doesn't understand cjs
        commonjs({ ignoreDynamicRequires: true }),

        // Compile TypeScript/JavaScript files
        babel({ extensions, babelHelpers: "runtime", include: ["node/**/*"] }),

        /**
         * 针对 fsevents-handler.js 的问题, 现阶段直接修改依赖的源码
         */
    ],

    output: {
        file: pkg.main,
        format: "cjs",
        banner: "#!/usr/bin/env node",
    },
}
