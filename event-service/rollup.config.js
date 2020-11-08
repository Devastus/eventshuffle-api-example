import typescript from "rollup-plugin-typescript";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
    input: "src/index.ts",
    output: {
        format: "cjs",
        name: "app",
        file: "dist/index.js"
    },
    plugins: [
        typescript({
            include: 'src/**/*.{ts,js}'
        }),
        // resolve(),
        // commonjs({
        //     include: ["src/index.ts", "node_modules/**/*.js"],
        //     ignoreGlobal: false
        // }),
        json({
            compact: true
        })
    ]
}
