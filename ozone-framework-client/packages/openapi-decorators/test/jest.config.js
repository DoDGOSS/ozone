module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**",
    ],
    coverageDirectory: "test/coverage/",
    globals: {
        "ts-jest": {
            tsConfig: "test/tsconfig.json"
        }
    },
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js"
    ],
    rootDir: "../",
    testEnvironment: "node",
    testMatch: [
        "**/?(*.)+(spec).(ts|tsx|js)"
    ],
    testPathIgnorePatterns: [
        "/node_modules/",
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    }
};
