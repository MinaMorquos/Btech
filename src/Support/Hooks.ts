import {Before, After, Status, AfterStep, AfterAll, BeforeAll} from '@cucumber/cucumber';
import {RunnerProp} from '../../RunnerProp';
import {CustomWorld} from "./CustomWorld";


BeforeAll(async () => {
    console.log("Launching browser once before all scenarios...");

});

Before(async function (this: CustomWorld, scenario) {
    if (!(this instanceof CustomWorld)) {
        throw new Error("❌ CustomWorld is not being used! Check your setup.");
    }
    console.log("Before Scenario");
    const featureFilePath = scenario.gherkinDocument?.uri;
    const tags = scenario.pickle?.tags || [];
    const testCaseKey = tags.find(tag => tag.name.startsWith('@testcasekey='))?.name.replace('@testcasekey=', '');
    console.log(`Running Test Cases No. ${testCaseKey} from the feature file: ${featureFilePath}`);
    const primeLanguage = RunnerProp.PRIME_LANGUAGE;
    const secondaryLanguage = RunnerProp.SECONDARY_LANGUAGE;
    scenario.pickle.steps.forEach(step => {
        step.text = step.text
            .replace('<prime_language>', primeLanguage)
            .replace('<secondary_language>', secondaryLanguage);
    });
    await this.init();
    this.context.setDefaultTimeout(RunnerProp.DefaultTimeout);
    this.context.setDefaultNavigationTimeout(RunnerProp.DefaultNavigationTimeout);

});

AfterStep(async function ({result}) {
    if (result.status === Status.FAILED) {
        await this.captureScreenshotOnFailure();
    }
});

After(async function (this: CustomWorld, {result}) {
    await this.logExecutionStatus(result);
    await this.close();
});


AfterAll(async () => {
    console.log(`Finished running tests in the ${RunnerProp.env} environment`);

    //console.log('All tests completed. Running npm script...');
    // const ReportPath = __dirname.substring(0, __dirname.indexOf("Support")) + "Reports\\ReportConfig.ts";
    // exec(`npx ts-node ${ReportPath}`, (error, stdout, stderr) => {
    //     if (error) {
    //         console.error(`Error executing command: ${error.message}`);
    //         return;
    //     }
    //     if (stderr) {
    //         console.error(`stderr: ${stderr}`);
    //         return;
    //     }
    //     //console.log(`stdout: ${stdout}`);
    // });
});