
const fs = require('fs');
const path = require('path');

// File paths for reading and writing the JSON file
const filePath = path.resolve(__dirname, 'src/Reports/Cucumber-Reporter.json');

// Function to read, modify, and write JSON data
function processAndModifyJson() {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        try {
            // Parse JSON data
            const jsonData = JSON.parse(data);

            // Step 1: Filter out 'Before' and 'After' steps
            const filteredJsonData = jsonData.map(feature => ({
                ...feature,
                elements: feature.elements.map(scenario => ({
                    ...scenario,
                    steps: scenario.steps.filter(step => step.keyword !== 'Before' && step.keyword !== 'After')
                }))
            }));

            // Step 2: Duplicate each scenario for each tag with one tag per scenario
            filteredJsonData.forEach(feature => {
                const newElements = []; // Array to hold new scenarios with individual tags

                feature.elements.forEach(scenario => {
                    if (scenario.tags && scenario.tags.length > 0) {
                        // Filter tags that start with "@testcasekey="
                        const testcaseTags = scenario.tags.filter(tag => tag.name.startsWith("@testcasekey="));

                        if (testcaseTags.length > 0) {
                            // Create a separate copy for each matching tag
                            testcaseTags.forEach(tag => {
                                const scenarioCopy = { ...scenario, tags: [tag] }; // Copy scenario with only this tag
                                newElements.push(scenarioCopy);
                            });
                        } else {
                            // If no matching tags, keep the scenario as-is
                            newElements.push(scenario);
                        }
                    } else {
                        // If no tags, keep scenario as-is
                        newElements.push(scenario);
                    }
                });

                feature.elements = newElements; // Replace elements with the new list
            });

            // Write the modified data back to the JSON file
            fs.writeFile(filePath, JSON.stringify(filteredJsonData, null, 2), err => {
                if (err) {
                    console.error('Error writing the file:', err);
                    return;
                }
                //console.log('Processed and modified JSON data has been written to the file.');
            });

        } catch (error) {
            console.error('Error parsing JSON data:', error);
        }
    });
}

// Execute the function
processAndModifyJson();