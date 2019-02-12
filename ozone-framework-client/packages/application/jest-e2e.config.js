module.exports = {
    collectCoverage: true,
    coverageDirectory: "coverage/e2e/",
    globals: {
        "ts-jest": {
            tsConfig: "./src/tsconfig.json"
        }
    },
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js"
    ],
    roots: [
        "<rootDir>"
    ],
    testEnvironment: "node",
    testMatch: [
        "**/?(*.)+(e2e-spec).(ts|tsx|js)"
    ],
    testPathIgnorePatterns: [
        "/node_modules/",
        "/tests/functional/"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    }
};
