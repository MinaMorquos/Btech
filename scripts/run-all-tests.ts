import { spawn } from "child_process";

const environments = ["QA", "STG", "DEV", "TEST"];

// Search for an environment argument in process.argv and set "QA" as a default if not found
process.env.ENV = process.argv.find(arg => environments.includes(arg.toUpperCase())) || "QA";

const distCommand = `tsc ./RunnerProp.ts --outDir ./dist`;
const cucumberCommand = `npx cucumber-js src/Features/*.feature`;
const combinedCommand = `${distCommand} && ${cucumberCommand}`;
const childProcess = spawn(combinedCommand, { stdio: "inherit", shell: true });

childProcess.on("error", (err) => {
  console.error(`Error executing command: ${err}`);
});

// childProcess.on("exit", (code) => {
//   if (code === 0) {
//     //console.log("Process completed successfully.");
//   } else {
//     console.error(`Process exited with code: ${code}. Check the logs above for details.`);
//   }
// });