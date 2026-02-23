import {Locator, Page} from 'playwright';
import {ITranslation} from "../Utils/ITranslation";
import {clickOnElementWithLocator, getTextFromITranslation} from "../Utils/CommonTsFunctions";
import { RunnerProp } from '../../RunnerProp';
import {CustomWorld} from "../Support/CustomWorld";


class LoginPage {
    private page:Page;
    userNameTextBox!: Locator;
    passwordTextBox!: Locator;
    languageIcon!: Locator;
    logoutIcon!: Locator;
    RVSLanguageIcon!:Locator;
    private closePopupButton!: Locator;


    constructor(page: Page) {
        this.page=page;
        this.initializeLocators();
    }

    initializeLocators() {
        this.userNameTextBox = this.page.locator('//input[contains(@id,"Username")]').first();
        this.passwordTextBox = this.page.locator('//input[contains(@id,"Password")]').first();
        this.languageIcon = this.page.locator(`//*[@alt="change language"]/following-sibling::p`);
        this.logoutIcon = this.page.locator('//li[contains(@class, "nav-item")]/a[contains(@href, "User/Logout")]').first();
        this.RVSLanguageIcon = this.page.locator('//li[contains(@class, "nav-item")]/a[contains(@href, "Home/ChangeLanguage")]').first();
        this.closePopupButton = this.page.locator(`//*[@data-name="close-popup"]`);

    }
    async closeWelcomePopUp(world:CustomWorld){
        const translatedText = getTextFromITranslation("Got it", world.currentLanguage as keyof ITranslation);
        await clickOnElementWithLocator(
            this.page.locator(`//button[normalize-space()='${translatedText}']`).first()
        )

    }
    async closePopUp() {
        await this.closePopupButton.waitFor({ state: 'visible', timeout: RunnerProp.DefaultTimeout });
        await clickOnElementWithLocator(this.closePopupButton);
    }
    async pageNavigation(world:CustomWorld, url: string) {
        try {
            await this.page.goto(url, {timeout: 240000});
            await this.closeWelcomePopUp(world);
            if (world.currentLanguage === "Arabic") {
                await this.languageIcon.waitFor({state: 'visible'});
                await this.languageIcon.click();
                //Simple Solution to put timeout
                await this.assertLanguageChanged();
            }
        } catch (error) {
            throw new Error(`Error during page navigation to ${url} with language ${world.currentLanguage}`);
        }
    }

    async assertLanguageChanged(){
        try {
            const currentText = await this.languageIcon.textContent();
            let isLanguageChanged = false;
            let attempts = 0;
            const maxAttempts = 10;

            while (!isLanguageChanged && attempts < maxAttempts) {
                const newText = await this.languageIcon.textContent();
                if (currentText?.trim() != newText) {
                    isLanguageChanged = true;
                    break;
                }
                await clickOnElementWithLocator(this.languageIcon);
                await this.page.waitForTimeout(500);
                attempts++;
            }

            if (!isLanguageChanged) {
                throw new Error("Language did not change to 'عربي' after maximum attempts");
            }
        } catch (error) {
            throw new Error(`Error asserting language change: ${error}`);
        }
    }

}

export {LoginPage};