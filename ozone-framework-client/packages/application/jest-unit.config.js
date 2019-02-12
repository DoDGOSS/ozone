module.exports = {
    collectCoverage: true,
    coverageDirectory: "coverage/unit/",
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
        "**/?(*.)+(spec).(ts|tsx|js)"
    ],
    testPathIgnorePatterns: [
        "/node_modules/",
        "/tests/functional/"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    }
};
