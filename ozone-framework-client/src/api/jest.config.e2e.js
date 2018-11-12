module.exports = {
    testEnvironment: "node",
    roots: [
        "<rootDir>"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    testMatch: [
        "**/?(*.)+(e2e-spec).(ts|tsx|js)"
    ],
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js"
    ],
    globals: {
        "ts-jest": {
            tsConfig: "tsconfig.test.json"
        }
    },
    collectCoverage: true
};
