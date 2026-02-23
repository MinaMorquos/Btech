export interface ITranslation {
    English: string;
    Arabic: string;
}

export interface Translations {
    [key: string]: ITranslation; // Index signature for translations
}

export const translations: Translations = {
    "Cart": {
        English: "Cart",
        Arabic: "عربة التسوق",
    }, "Got it": {
        English: "Got it",
        Arabic: "Got it",
    }, "My items": {
        English: "My items",
        Arabic: "مشترياتي",
    }

};
