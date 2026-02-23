import {Locator} from "@playwright/test";
import {ITranslation, translations} from './ITranslation'; // Adjust the path as needed
import { findJsonFile, loadJson, modifyAndWriteJson } from "../Support/JsonUtils";
import { RunnerProp } from "../../RunnerProp";
import {CustomWorld} from "../Support/CustomWorld";

// Generate Random Number Between Input Min and Max
export function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



export async function selectOptionFromDropdown(dropdownLocator: Locator, optionValue: string|number) {
    try {
        await dropdownLocator.waitFor({ state: 'visible', timeout: RunnerProp.DefaultTimeout });
        await dropdownLocator.click();
        if (typeof optionValue === 'string') {
            // Handle selection by string value
            await dropdownLocator.selectOption(optionValue);
        }else {
            await dropdownLocator.selectOption({index: optionValue});

        }

    } catch (error) {
        console.error(`Option "${optionValue}" not found in the dropdown "${dropdownLocator.getByLabel}" within the timeout`);
        throw error;
    }
}

export function getTextFromITranslation(key: string, lang: keyof ITranslation): string {
    if (translations[key]) {
        return translations[key][lang]; // Fallback to English if lang not found
    }
    //console.warn(`Translation key "${key}" not found.`);
    return key; // Fallback to the key itself if no translation is found
}

export function getFormattedTodaysDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = today.getFullYear();
    return `${day}/${month}/${year}`; // Format as MM/DD/YYYY
}

export function getFormattedTodaysDateNextMonth(): string {
    const today = new Date();
    today.setMonth(today.getMonth() + 1); // Increment month by 1
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    return `${day}/${month}/${year}`; // Format as MM/DD/YYYY
}

export function addDaysToDate(dateStr: string, daysToAdd: number): string {
    // Parse the input date string
    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-based in JavaScript

    // Add the specified number of days
    date.setDate(date.getDate() + daysToAdd);

    // Format the new date as DD/MM/YYYY
    const formattedDate = [
        String(date.getDate()).padStart(2, '0'), // Day
        String(date.getMonth() + 1).padStart(2, '0'), // Month (0-based)
        date.getFullYear() // Year
    ].join('/');

    return formattedDate;
}

export function extractObjFromJsonFile(key: string, filename: string = "OutputData.json"): Promise<string> {
    const filePath = findJsonFile(filename); // Use provided filename or default
    const jsonData = loadJson(filePath); // Load the JSON data

    const keyValue = key.split('.').reduce((obj, k) => obj?.[k], jsonData);

    if (keyValue !== undefined && keyValue !== null) {
        return Promise.resolve(keyValue.toString()); // Return as a resolved Promise
    } else {
        return Promise.reject(new Error(`Key '${key}' not found in JSON or value is null/undefined.`));
    }
}

export async function clickOnElementWithLocator(locator: Locator) {
 //   try {
        await locator.waitFor({ state: 'attached', timeout: RunnerProp.DefaultTimeout });
        await locator.waitFor({ state: 'visible', timeout: RunnerProp.DefaultTimeout });
        await locator.click({ timeout: RunnerProp.DefaultTimeout});
    // } catch (error) {
    //     throw new Error(`Error while clicking the element with string : ${await locator.textContent()}`);
    // }
}

export async function clickOnFieldByLocator(locator: Locator) {
    try {
        await locator.waitFor({ state: 'attached', timeout: RunnerProp.DefaultTimeout });
        await locator.waitFor({ state: 'visible', timeout: RunnerProp.DefaultTimeout });
        await locator.click({ timeout: RunnerProp.DefaultTimeout, force: false });
    } catch (error) {
        throw new Error(`Error while clicking the element with string : ${await locator.textContent()}`);
    }
}

export function formatDate(inputDate: string): string {
    const [day, month, year] = inputDate.split('/');
    const date = new Date(`${year}-${month}-${day}`);

    if (isNaN(date.getTime())) {
        throw new Error("Invalid date format. Please provide a valid date in MM/DD/YYYY format.");
    }

    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    return date.toLocaleDateString('en-US', options);
}