import {setWorldConstructor, World} from "@cucumber/cucumber";
import {BrowserContext, firefox, Page} from "@playwright/test";
import {findJsonFile, loadJson} from "./JsonUtils";
import {LoginPage} from "../Pages/LoginPage";
import {RunnerProp} from "../../RunnerProp";
import {Browser, chromium} from "playwright";
import {HomePage} from "../Pages/HomePage";

class CustomWorld extends World {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;
    projectData!: any;
    outputData: any;
    usersData: any;
    currentLanguage:string="";

    pages: {
        loginPage?: LoginPage;
        homePage?:HomePage

    };

    constructor(options: any) {
        super(options); // 👈 Call super correctly
        this.pages = {}; // Store page objects here
        this.outputData = loadJson(findJsonFile(`OutputData.json`));
        this.usersData = loadJson(findJsonFile(`Users.json`));

    }

    async loadTestData(lang: string) {
        this.projectData = loadJson(findJsonFile(`ProjectData_${lang}.json`));
    }



    public get projectFilePath(): string {
        return findJsonFile(`ProjectData_${this.currentLanguage}.json`);
    }

    async switchToNewPage(clickAction: () => Promise<void>): Promise<Page> {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'), // Wait for the new page to open
            clickAction(), // Perform the click action dynamically
        ]);

        this.page = newPage; // Store new page instance
        // Update all page objects with the new page instance
        this.initiatePages(this.page);

        return newPage;
    }

    // Dynamic getter for project file data

    // User file path and data (assuming it does not change based on language)
    readonly userFilePath = findJsonFile("Users.json");
    // User file path and data (assuming it does not change based on language)
    readonly outputFilePath = findJsonFile("OutputData.json");

    async captureScreenshotOnFailure() {
        try {
            const pages = this.page.context().pages();
            const currentPage = pages[pages.length - 1];

            const screenshot = await currentPage.screenshot({
                path: `src/ScreenShots/${Date.now()}.jpeg`,
                quality: 15,
                fullPage: false,
                type: 'jpeg'
            });
            this.attach(screenshot, 'image/jpeg');
        }

        catch (error) {
            console.error('Error capturing screenshot:', error);
        }

    }
    async logExecutionStatus(result: any): Promise<void> {
        if (this.context) {
            const statusIcon = result?.status.toLowerCase() === 'failed' ? '❌' : '✅';
            console.log(`${statusIcon} Execution finished with Status: ${result?.status}`);

            if (result?.status.toLowerCase() === 'failed') {
                const nowDate = new Date();
                const currentDate = nowDate.toISOString().split('T')[0];
                const currentTime = nowDate.toISOString().split('T')[1].split('.')[0];

                console.log(`TCs Failed at: ${currentDate} ${currentTime} in UTC`);
            }
        } else {
            console.error('Context is undefined. Tracing could not be stopped.');
        }
    }


    async init() {

        switch (RunnerProp.browser) {
            case 'firefox':
                this.browser = await firefox.launch({
                    headless: RunnerProp.headlessMode,
                    args: ['--start-maximized']
                });
                break;
            case 'edge':
                this.browser = await chromium.launch({
                    channel: 'msedge',
                    headless: RunnerProp.headlessMode,
                    args: ['--start-maximized']
                });
                break;
            case 'chromium':
            default:
                this.browser = await chromium.launch({
                    headless: RunnerProp.headlessMode,
                    args: ['--start-maximized']

                });
                break;
        }
        this.context = await this.browser.newContext({
            viewport: null,

            recordVideo: {
                dir: './videos/',
                size: {width: 1920, height: 1080},
            }

        });
        this.context = await this.browser.newContext({
            viewport: RunnerProp.headlessMode ? {width: 1920, height: 1080} : null,
            ...(RunnerProp.recordVideo ? {
                recordVideo: {
                    dir: './videos/',
                    size: {width: 1920, height: 1080},
                }
            } : {})
        });

        this.page = await this.context.newPage();
        this.initiatePages(this.page);

    }

    private initiatePages(page: Page) {
        this.pages.loginPage = new LoginPage(page);
        this.pages.homePage= new HomePage(page);
    }

    async close() {

        RunnerProp.debugMode ? await this.page.pause() :
            await this.page?.close();
        await this.context?.close();
        await this.browser?.close();
    }

    getCurrentPage(): Page {
        return this.page;
    }
}

setWorldConstructor(CustomWorld); // 👈 Ensure this is present
export {CustomWorld};