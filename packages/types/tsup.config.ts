import type { Options } from "tsup"

export const tsup: Options = {
    entryPoints: ["src/index.ts"],
    sourcemap: true,
    dts: true,
    clean: true,
    format: ["cjs", "esm"],
    legacyOutput: true,
    outDir: "dist",
}
