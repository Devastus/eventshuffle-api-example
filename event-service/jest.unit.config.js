const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig");

module.exports = {
    bail: 0,
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: ".",
    verbose: true,
    moduleFileExtensions: ["js", "ts", "tsx"],
    globals: {
        'ts-jest': {
            "target": "ES2017",
            "module": "commonjs",
            "lib": ["es2017"],
            "outDir": "dist",
            "noImplicitAny": true,
            "importHelpers": true,
            "experimentalDecorators": true,
            "emitDecoratorMetadata": true,
            "esModuleInterop": true
        }
    },
    // roots: ["<rootDir>/src"],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: "<rootDir>/"
    }),
    transform: {
      "\\.ts$": "ts-jest"
    },
    // collectCoverage: true,
    // collectCoverageFrom: [
    //   "src/**/*.{ts,js}",
    //   "!**/node_modules/**",
    //   "!**/build/**",
    //   "!**/coverage/**",
    //   "!**/__tests__/**"
    // ],
    // coverageThreshold: {
    //   global: {
    //     branches: 80,
    //     functions: 80,
    //     lines: 80,
    //     statements: 80
    //   }
    // },
    // coverageReporters: [
    //   "text",
    //   "text-summary"
    // ],
    // testRegex: ".*\\.spec\\.ts$",
    testMatch: ["<rootDir>/__tests__/unit/**/*.spec.ts"]
    // testPathIgnorePatterns: [
    //   "/node_modules/",
    //   "/build/",
    //   "/coverage/",
    //   "/src/",
    //   "__tests__/testutils",
    // ]
}
