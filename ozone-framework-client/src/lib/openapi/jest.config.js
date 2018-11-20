module.exports = {
    testEnvironment: "node",
    roots: [
        "<rootDir>"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    testMatch: [
        "**/?(*.)+(spec|test).(ts|tsx|js)"
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
    collectCoverage: true,
    coveragePathIgnorePatterns: [
        ".*/__test__/.*\.ts$",
    ],
};
