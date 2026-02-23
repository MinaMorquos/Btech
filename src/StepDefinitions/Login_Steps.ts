import {When, Given, Then, setDefaultTimeout} from "@cucumber/cucumber";
import {RunnerProp} from "../../RunnerProp";
import {ITranslation} from "../Utils/ITranslation";
import {CustomWorld} from "../Support/CustomWorld";
import {findJsonFile, loadJson} from "../Support/JsonUtils";

setDefaultTimeout(RunnerProp.DefaultStepTimeout);


Given('Navigate to B.tech System in {string}', async function (this:CustomWorld,lang:string) {

    if (this.projectData === undefined) {
        this.currentLanguage= lang;
        this.projectData = loadJson(findJsonFile(`ProjectData_${this.currentLanguage}.json`));
    }
    await this.pages.loginPage!.pageNavigation(this,this.usersData[RunnerProp.env].url);
});
