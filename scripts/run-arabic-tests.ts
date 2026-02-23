
import { spawn } from "child_process";
import {RunnerProp} from "../RunnerProp";
import fs from "fs";

const environments = ["QA", "STG", "DEV", "TEST"];

// Search for an environment argument in process.argv and set "QA" as a default if not found
process.env.ENV = process.argv.find(arg => environments.includes(arg.toUpperCase())) || "QA";

const distCommand = `tsc ./RunnerProp.ts --outDir ./dist`;

const arabicSeqCommand = `npx cucumber-js src/Features/*.feature --tags "@Arabic and @seq" --parallel ${RunnerProp.sequentiallyThreads} --format json:src/Reports/Sequence_Report.json`;
const arabicParallelCommand = `npx cucumber-js src/Features/*.feature --tags "@Arabic and not @seq" --parallel ${RunnerProp.parallelThreads} --format json:src/Reports/Parallel_Report.json`;

function runCommand(command: string): Promise<void> {
    return new Promise<void>((resolve) => {
        const child = spawn(command, { stdio: "inherit", shell: true });

        child.on("exit", (code) => {
            // if (code === 0) {}
            // else {
            //   console.error(`⚠️ Command failed with code ${code}`);
            // }
            resolve(); // Continue even if it fails
        });
    });
}

async function runAll(): Promise<void> {
    await runCommand(distCommand);
    await runCommand(arabicSeqCommand);
    await runCommand(arabicParallelCommand);

    mergeReports();
}


function mergeReports() {
    const seq = JSON.parse(fs.readFileSync("src/Reports/Sequence_Report.json", "utf-8"));
    const parallel = JSON.parse(fs.readFileSync("src/Reports/Parallel_Report.json", "utf-8"));

    // Combine both arrays
    const combined = [...seq, ...parallel];

    // Map to merge features by URI
    const featureMap = new Map();

    for (const feature of combined) {
        if (!featureMap.has(feature.uri)) {
            // First time seeing this feature
            featureMap.set(feature.uri, { ...feature });
        } else {
            // Merge scenarios (elements)
            const existingFeature = featureMap.get(feature.uri);
            existingFeature.elements.push(...feature.elements);
        }
    }

    // Convert Map back to Array
    const mergedReport = Array.from(featureMap.values());

    fs.writeFileSync("src/Reports/Cucumber-Reporter.json", JSON.stringify(mergedReport, null, 2));
    console.log("✅  Both Reports are Merged Successfully");
}

runAll();
