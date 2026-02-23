import {Locator, Page} from 'playwright';
import {clickOnElementWithLocator, getTextFromITranslation} from "../Utils/CommonTsFunctions";
import {CustomWorld} from "../Support/CustomWorld";
import {ITranslation} from "../Utils/ITranslation";
import {getValueByPath} from "../Support/JsonUtils";
import {RunnerProp} from "../../RunnerProp";
import * as sea from "node:sea";
import {expect} from "@playwright/test";


class HomePage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
        this.initializeLocators();
    }

    initializeLocators() {

    }


    async clickOnElementWithText(world: CustomWorld, text: string) {
        const translatedText = getTextFromITranslation(text, world.currentLanguage as keyof ITranslation);
        const element = this.page.locator(`//*[normalize-space(text())='${translatedText}']`).first();
        await clickOnElementWithLocator(element);
    }

    async searchForItemFromJson(world: CustomWorld, key: string, jsonObject: string) {
        const searchItem = getValueByPath(world.projectData, `${RunnerProp.env}.${jsonObject}.${key}`) ?? "Key Not Found";
        const searchBox = this.page.locator('input[data-testid="search-input"]:visible'); // Adjust the selector as needed
        await searchBox.filter().fill(searchItem);
        await searchBox.press('Enter');
    }

    async addFirstItemToCart(world: CustomWorld, key: string, jsonObject: string) {
        const searchItem = getValueByPath(world.projectData, `${RunnerProp.env}.${jsonObject}.${key}`) ?? "Key Not Found";
        const addIconElement = this.page.locator(`(//*[contains(@title,'${searchItem}')])[1]/ancestor::article//img[@alt="plus"]`);
        await clickOnElementWithLocator(addIconElement);

    }

    async assertOnItemDisplayedWithImage(world: CustomWorld, key: string, jsonObject: string) {
        const searchItem = getValueByPath(world.projectData, `${RunnerProp.env}.${jsonObject}.${key}`) ?? "Key Not Found";
        const itemElement = this.page.locator(`(//*[contains(@title,'${searchItem}')])[1]/ancestor::article//img[contains(@alt,'${searchItem}')]`).first();
        await expect(itemElement).toBeVisible({ timeout: RunnerProp.DefaultTimeout });
    }

    async assertOnItemDisplayedInCart(world: CustomWorld, key: string, jsonObject: string) {
        const searchItem = getValueByPath(world.projectData, `${RunnerProp.env}.${jsonObject}.${key}`) ?? "Key Not Found";
        await this.assertOnCartPage(world);
        const itemElement = this.page.locator(`(//*[contains(text(),'${searchItem}')])[1]`);
        await expect(itemElement).toBeVisible({ timeout: RunnerProp.DefaultTimeout });
    }

    async assertOnCartPage(world: CustomWorld){
        const translatedText = getTextFromITranslation("My items", world.currentLanguage as keyof ITranslation);
        const headerElement = this.page.locator(`//*[normalize-space(text())='${translatedText}']`).first();
        await expect(headerElement).toBeVisible({ timeout: RunnerProp.DefaultTimeout });

    }
}

export {HomePage};