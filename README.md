# 🎭 Playwright TypeScript Cucumber Automation Framework

## 📌 Overview

This project is a robust test automation framework built with:

* [Playwright](https://playwright.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [Cucumber](https://cucumber.io/)
* [Page Object Model (POM)](https://www.toolsqa.com/selenium-webdriver/page-object-model/)
* BDD (Behavior-Driven Development) approach

## 📁 Project Structure

```
project-root/
│
├── scripts/  
│    └── run-all-tests       # Executes the full test suite in both English and Arabic
│    └── run-arabic-tests    # Executes only the scenarios using Arabic test data
│    └── run-english-tests   # Executes only the scenarios using English test data
│    └──run-tests           # Generic test runner for executing scenarios based on tags or filters
├── src/  
│    ├── features/                 # Cucumber feature files
│    │   └── *.feature             # Gherkin scenarios
│    ├── pages/                    # Page Object Model files
│    ├── Reports/                  # reports files
│    ├── ScreenShots/              # Saving ScreenShots of failed Steps
│    ├── StepDefinitions/          # Step definitions linked to Gherkin steps
│    ├── Supprot/                  # Supprot files
│    │   └── APIUtils              # Project-specific API utility functions
│    │   └── CustomWorld           # Shared context for scenarios; stores browser, page, and custom data
│    │   └── Hooks                 # Manages test lifecycle events (Before, After) for initializing and cleaning up test context
│    │   └── JsonUtils             # JSON functions
│    ├── TestData/                 # TestData warehous
│    │   └── OutputJson            # Stores generated test output, such as dynamic values
│    │   └── ProjectData_English   # Contains English test data used across scenarios
│    │   └── ProjectData_Arabic    # Contains Arabic test data used across scenarios
│    │   └── Users                 # Stores user credentials and role-specific data
│    └── utils/                    # utility for the project
│        └── CommonTsFunctions     # Reusable TypeScript utility functions shared across the framework
│        └── ITranslation          # Interface and structure for handling multi-language translations
│        └── OracleDbConnection    # Handles Oracle database connection and query execution logic for specific project
│
├── playwright.config.ts      # Playwright config
├── cucumber.js               # Cucumber config
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies and scripts
```

## ⚙️ Installation

```bash
# Clone the repository
git clone <repo-url>

# Navigate to the folder
cd project-root

# Install dependencies
npm init playwright@latest --yes -- --quiet --browser=chromium --browser=firefox --browser=webkit --gha
npm i @cucumber/cucumber -D
npm i ts-node -D
npm install multiple-cucumber-html-reporter --save-dev

**Mandatory**  to run the project:  
npm run test

```

## 🚀 Running Tests

### Compiles RunnerProp.js to Be Able to Run

```bash
npm run test
```

### Run with tags

```bash
npx cucumber-js --tags "@regression"
```

### Generate HTML Report

```bash
npm run report
```

## 🧪 Sample Scripts

### Example Feature

```gherkin
Feature: Login functionality

  Scenario: Valid login
    Given I navigate to the login page
    When I enter valid credentials
    Then I should be redirected to the dashboard
```

### Example Step Definition

```ts
import { Given, When, Then } from '@cucumber/cucumber';

Given('I navigate to the login page', async function (this:CustomWorld) {
  await this.pages.pageViewName.anyFunction();
});
```


### Example Page View

```ts
export class pageName {
    private page:Page;
    locator !: Locator;

    constructor(page: Page) {
        this.page = page;
        this.initializeLocators(); // Initialize locators when the class is instantiated
    }

    initializeLocators() {
        this.locator = this.page.locator('xpath');
   
    }
}
```

### Example CustomWorld

```ts
Add Page Name In Page List
pages: {
        pageName?: PageName;
    };
And   
private initiatePages(page: Page) {
        this.pages.pageName = new PageName(page);
    }      
```


## 🧾 JSON files

### Read From JSON File

```bash
Prerequisite - You have to pass the CustomWorld like in PageView Section-
world.outputData --- > this line of code loads the outputData.json file
world.projectData --- > this line of code loads the ProjectData file in current language

```

### Write In JSON File

```bash
  modifyAndWriteJsonObject(world.outputFilePath, world.outputData,key, value);
```


## 🧰 Scripts

| Script                | Description                                             |
| --------------------- | ------------------------------                          |
| `npm run test`        | Run specific test based on RunnerProp                   |
| `onlyEnglishTests`    | Executes only the scenarios using English test data     |
| `onlyArabicTests`     | Executes only the scenarios using Arabic test data      |

## 📌 Naming Conventions

To maintain consistency across the test automation framework, follow the naming conventions below:

### 🧱 Project Structure

| Item                   | Convention   | Example                         |
| ---------------------- | ------------ | ------------------------------- |
| Folder names           | `kebab-case` | `page-objects`, `test-data`     |
| File names             | `kebab-case` | `login-page.ts`, `user-data.ts` |
| Feature files          | `PascalCase` | `CreateUser.feature`            |
| Step definitions files | `kebab-case` | `create-user-steps.ts`          |


### 📄 Feature Files (Cucumber)

| Item         | Convention          | Example                                    |
| ------------ | ------------------- | ------------------------------------------ |
| Feature name | Title Case          | `Feature: Create New User`                 |
| Scenario     | Title Case          | `Scenario: Successfully create a new user` |
| Tags         | `@lower_snake_case` | `@smoke_test`, `@regression_suite`         |


### 🧪 Test Steps (Step Definitions)

| Item          | Convention         | Example                       |
| ------------- | ------------------ | ----------------------------- |
| Function name | `camelCase`        | `fillUserForm()`              |
| Variable name | `camelCase`        | `userName`, `emailAddress`    |
| Constants     | `UPPER_SNAKE_CASE` | `MAX_WAIT_TIME`, `ADMIN_ROLE` |


### 📄 Page Objects

| Item         | Convention   | Example                        |
| ------------ | ------------ | ------------------------------ |
| Class name   | `PascalCase` | `LoginPage`, `DashboardPage`   |
| Method name  | `camelCase`  | `clickLoginButton()`           |
| Locator name | `camelCase`  | `loginButton`, `usernameField` |

## ⚙️ Configuration - RunnerProp

The RunnerProp class is responsible for managing runtime configuration using environment variables. Below is a list of supported properties and their default values:

| Property                   | Type      | Env Variable                 | Default Value           | Description                                                                   |
| -------------------------- | --------- | ---------------------------- | ----------------------- | ----------------------------------------------------------------------------- |
| `env`                      | `string`  | `ENV`                        | `QA`                    | Target environment to run the tests on. (e.g., QA, STG, UAT)                  |
| `browser`                  | `string`  | `BROWSER`                    | `chromium`              | Browser to execute tests on. (e.g., chromium, firefox, webkit)                |
| `DefaultTimeout`           | `number`  | `DEFAULT_TIMEOUT`            | `120000`                | Default timeout in milliseconds for general operations.                       |
| `DefaultStepTimeout`       | `number`  | `DEFAULT_STEP_TIMEOUT`       | `120000`                | Timeout specifically for individual steps.                                    |
| `DefaultNavigationTimeout` | `number`  | `DEFAULT_NAVIGATION_TIMEOUT` | `120000`                | Timeout for page navigation events.                                           |
| `tags`                     | `string`  | `TAGS`                       | `testcasekey=SPRDC-788` | Cucumber tags to filter test scenarios.                                       |
| `retry`                    | `number`  | `RETRY`                      | `1`                     | Number of retry attempts for failed scenarios.                                |
| `parallelThreads`          | `number`  | *(hardcoded)*                | `5`                     | Number of threads used for parallel execution.                                |
| `recordVideo`              | `boolean` | `RECORD_VIDEO`               | `false`                 | Whether to record test execution video.                                       |
| `headlessMode`             | `boolean` | `HEADLESS_MODE`              | `true`                  | Whether to run tests in headless mode.                                        |
| `debugMode`                | `boolean` | `HEADLESS_MODE`              | `false`                 | Used for debugging purposes (overlaps with `headlessMode`, update if needed). |
| `PRIME_LANGUAGE`           | `string`  | *(hardcoded)*                | `English`               | The primary test language.                                                    |
| `SECONDARY_LANGUAGE`       | `string`  | *(hardcoded)*                | `Arabic`                | The secondary language used for bilingual testing.                            |

💡 Boolean values like RECORD_VIDEO and HEADLESS_MODE must be set as "true" or "false" (case-insensitive).


## 🛠 Configuration

* Modify base URL in Users.json
* Add new environment variables or constants in Users.json
* Page objects should follow the naming convention `*Page.ts`
* StepsPage objects should follow the naming convention \*\_Steps.ts

## 👥 Contributing

Please follow naming conventions and maintain modularity. Submit PRs with appropriate tags and documentation.


