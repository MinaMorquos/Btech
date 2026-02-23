import fs, {readFileSync, writeFileSync} from 'fs';
import path from 'path';

// Function to find the JSON file by name in the utils directory
function findJsonFile(fileName: string): string {
    const dir = path.join(__dirname, '..', 'TestData'); // Directory containing the JSON file
    const filePath = path.join(dir, fileName);
    if (!fs.existsSync(filePath)) {
        throw new Error(`JSON file ${fileName} not found in directory ${dir}`);
    }
    return filePath;
}

// Function to load the JSON file
function loadJson(filePath: string) {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
}

// Function to get the value from JSON by path
function getValueByPath(json: any, path: string) {
    const keys = path.split('.');
    return keys.reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : "invalid json path", json);
}

export function modifyAndWriteJsonObject(filePath: string,jsonData:any, key: string, value: any): void {
    setNestedValue(jsonData, key, value);
    try {
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing data to JSON file:', error);
    }
}

//Load Json then Modify the JSON data
function modifyAndWriteJson(filePath: string, key: string, value: any): void {
    let jsonData: any = {};
    try {
        const data = fs.readFileSync(filePath, 'utf8').trim();
        if (data) {
            jsonData = JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading JSON file:', error);
    }

    setNestedValue(jsonData, key, value);

    try {
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing data to JSON file:', error);
    }
}

// Helper function to set a nested value based on a path
function setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.'); // Split the path into keys
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
            current[keys[i]] = {}; // Ensure the path exists
        }
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value; // Set the final value
}

//Read Case Number From Json File then Remove Extracted Case Number
function extractAndRemoveFirstObject(objectKey: string): string | null {
    let jsonData: any = {};

    // Construct the file path
    const filePath = path.join(__dirname.substring(0, __dirname.indexOf("Support")), "TestData", "CasesIDs.json");

    try {
        // Read and parse the JSON data from the file
        const data = fs.readFileSync(filePath, 'utf8').trim();

        if (data) {
            jsonData = JSON.parse(data);

            const targetData = jsonData.stg[objectKey];

            if (targetData) {
                // Get the first key in the target object
                const firstKey = Object.keys(targetData)[0];

                if (!firstKey) {
                    return null; // Return null if the target object is empty
                }

                const firstValue = targetData[firstKey];

                console.log("The Case ID Used during Run is:" + " " + firstValue);

                // Delete the first key-value pair from the target object
                delete targetData[firstKey];

                // Write the modified JSON back to the file
                fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');

                return firstValue;
            } else {
                console.error(`The object key "${objectKey}" does not exist in the JSON data.`);
                return null;
            }
        } else {
            console.error('The JSON file is empty or not properly formatted.');
            return null;
        }
    } catch (error) {
        console.error('Error reading or writing JSON file:', error);
        return null;
    }
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


export {findJsonFile, loadJson, getValueByPath, modifyAndWriteJson, extractAndRemoveFirstObject};