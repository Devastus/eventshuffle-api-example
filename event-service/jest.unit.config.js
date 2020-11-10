const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig");

module.exports = {
    bail: 0,
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: ".",
    setupFilesAfterEnv: ["./__tests__/jest-setup.ts"],
    verbose: true,
    moduleFileExtensions: ["js", "ts", "tsx"],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: "<rootDir>/"
    }),
    transform: {
      "\\.ts$": "ts-jest"
    },
    testMatch: ["<rootDir>/__tests__/unit/**/*.spec.ts"]
}
