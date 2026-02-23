const { RunnerProp } = require('./dist/RunnerProp'); // Use appropriate path

module.exports = {
    default: {
        "require": [
            "src/StepDefinitions/*.ts",
            "src/Support/Hooks.ts"
        ],
        "format":
            [
                "progress-bar",
                ["json", "src/Reports/Cucumber-Reporter.json"]
            ],
        "retry": RunnerProp.retry,
        requireModule: ['ts-node/register'],
        "parallel":RunnerProp.parallelThreads
    },
};