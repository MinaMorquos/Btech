import {When, Given, Then, setDefaultTimeout} from "@cucumber/cucumber";
import {RunnerProp} from "../../RunnerProp";
import {CustomWorld} from "../Support/CustomWorld";
import {ITranslation} from "../Utils/ITranslation";

setDefaultTimeout(RunnerProp.DefaultStepTimeout);




Given(`User Clicks on {string} Text`,async function (this:CustomWorld,text:string) {
    await this.pages.homePage!.clickOnElementWithText(this,text);

});
When(`User Searches for {string} from {string}`,async function (this:CustomWorld,key:string,jsonObject:string) {
    await this.pages.homePage!.searchForItemFromJson(this,key,jsonObject);
});
Then(`User Asserts That the {string} from {string} is Displayed with image`,async function (this:CustomWorld,key:string,jsonObject:string) {
    await this.pages.homePage!.assertOnItemDisplayedWithImage(this,key,jsonObject);
});
When(`User Adds First {string} to Cart from {string}`,async function (this:CustomWorld,key:string,jsonObject:string) {
    await this.pages.homePage!.addFirstItemToCart(this,key,jsonObject);
});
Then(`User Asserts That the {string} from {string} is Displayed in Cart Page with image`,async function (this:CustomWorld,key:string,jsonObject:string) {
    await this.pages.homePage!.assertOnItemDisplayedInCart(this,key,jsonObject);
});