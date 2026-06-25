# Playwright Automation Framework Instructions

## Objective

This document defines the mandatory standards, conventions, architecture, and implementation rules for the Playwright automation framework.

This framework follows:

- Playwright with JavaScript
- Page Object Model (POM)
- Fixture-Based Execution
- Excel Driven Test Data
- Environment Variable Configuration
- Reusable Page Methods
- Scalable Test Design
- Stable and Maintainable Automation

These instructions must be followed by:

- Developers
- QA Engineers
- AI Code Generators (ChatGPT, Copilot, Claude)

---

# Framework Architecture

Framework Structure:

```txt
project-root/
│
├── baseFixture/
│   └── fixture.js
│
├── pages/
│   ├── LoginPage.js
│   ├── HomePage.js
│   ├── ContactsPage.js
│   ├── CreateContactPage.js
│   └── CreateContactDetailsPage.js
│
├── tests/
│   ├── contacts/
│   │   └── CreateContact.spec.js
│
├── utility/
│   ├── ExcelUtility.js
│   └── JavaUtility.js
│
├── testdata/
│   └── testdata.xlsx
│
├── .env
│
├── playwright.config.js
│
└── package.json
```

Folder Responsibility:

| Folder | Responsibility |
|--------|----------------|
| pages | UI locators + reusable methods |
| tests | Test validations and business flow |
| baseFixture | Login/logout and reusable fixtures |
| utility | Common reusable utility methods |
| testdata | Externalized test data |
| .env | Credentials and environment config |

---

# Core Framework Principles

The framework must follow these principles:

1. Reusability
2. Readability
3. Maintainability
4. Stability
5. Separation of Concerns
6. Minimal Code Duplication

---

# Separation of Responsibility

## Page Classes (POM)

Page classes should contain:

- Locators
- UI interaction methods
- Reusable actions

Page classes should NOT contain:

- Assertions
- Test validations
- Test business logic
- Hardcoded test data

Correct Example:

```js
async createContact(lastName) {
    await this.latnameEdt.fill(lastName);
    await this.saveBtn.click();
}
```

Wrong Example:

```js
async createContact(lastName) {
    await this.latnameEdt.fill(lastName);
    await this.saveBtn.click();

    expect(await this.page.locator("text=Success")).toBeVisible();
}
```

Reason:
Assertions belong in Spec Layer.

---

## Test Class Responsibility

Test classes should contain:

- Business flow
- Assertions
- Navigation
- Test orchestration
- Data retrieval

Correct Flow:

```js
await homePage.goToContacts();

await contactsPage.clickCreateContact();

await createContactPage.createContact(lastName);

const data =
await createContactDetailsPage
.contact_LastName_Element()
.innerText();

await expect(data).toContain(lastName);
```

---

## Fixture Responsibility

Fixture should manage:

- Login
- Logout
- Browser preparation
- Shared setup
- Shared teardown

Correct:

```js
forEachTest: [
async ({ page, loginPage, homePage }, use) => {

    await page.goto(baseURL);

    await loginPage.login(
        process.env.APP_USERNAME,
        process.env.APP_PASSWORD
    );

    await use();

    await homePage.logout();

}, { auto: true }]
```

Do NOT write login code inside tests.

Wrong:

```js
test('create contact', async ({ page }) => {

await page.goto(url);

await page.fill('#username','admin');
await page.fill('#password','admin');
await page.click('button');

});
```

---

# Naming Convention Rules

## File Naming

Page Files:

Format:

```txt
<PageName>.js
```

Examples:

```txt
LoginPage.js
HomePage.js
ContactsPage.js
CreateContactPage.js
```

Test File Naming:

Format:

```txt
FeatureName.spec.js
```

Example:

```txt
CreateContact.spec.js
```

---

## Class Naming

Always use PascalCase.

Correct:

```js
export class CreateContactPage
```

Wrong:

```js
export class createContactPage
```

---

## Method Naming

Always use camelCase.

Correct:

```js
createContact()
createContactWithDepartment()
createContactWithFax()
clickCreateContact()
```

Wrong:

```js
Create_Contact()
create_contact()
CreateContact()
```

---

## Locator Variable Naming

Locator variables should end with:

| Type | Naming |
|------|--------|
| button | Btn |
| textbox | Edt |
| dropdown | Dd |
| checkbox | Chk |
| label | Lbl |
| link | Lnk |

Correct:

```js
saveBtn
latnameEdt
orglookUP
```

Wrong:

```js
saveButtonLocator
lastnametextbox
element1
```

---

# Locator Strategy

Preferred Locator Order:

1. id
2. name
3. role
4. label
5. CSS
6. XPath

Preferred:

```js
page.locator("#search_txt")
```

Good:

```js
page.locator("input[name='lastname']")
```

Avoid unstable XPath:

Wrong:

```js
(//div)[4]/table/tbody/tr[2]
```

Allowed XPath:

```js
//*[normalize-space(.)='Organization Name']/..//img
```

XPath should be meaningful.

---

# Page Object Model Rules

Each page must contain:

### Constructor

```js
constructor(page) {
    this.page = page;
}
```

### Locators

```js
this.saveBtn =
page.locator("(//input[@title='Save [Alt+S]'])[1]");
```

### Methods

```js
async createContact(lastName) {
    await this.latnameEdt.fill(lastName);
    await this.saveBtn.click();
}
```

One reusable business action per method.

Avoid massive methods.

Bad:

```js
async createEverything() {
 // 100+ lines
}
```

Good:

```js
createContact()
createContactWithDepartment()
createContactWithFax()
```

---

# Test Design Rules

Each test must follow:

Arrange → Act → Assert

Example:

```js
// Arrange
const lastName =
`${contactName}_${Math.floor(Math.random()*1000)}`;

// Act
await homePage.goToContacts();
await contactsPage.clickCreateContact();

await createContactPage
.createContact(lastName);

// Assert
await expect(data)
.toContain(lastName);
```

Never mix assertions inside Arrange.

---

# Dynamic Test Data

Always avoid hardcoded data.

Correct:

```js
const lastName =
`${contactName}_${Math.floor(Math.random()*1000)}`;
```

Wrong:

```js
const lastName = "John";
```

Reason:
Avoid duplicate record failures.
# Excel Data Handling Rules

Test data must be externalized.

Preferred Source:

- Excel File
- Environment Variables

Never hardcode reusable test data.

Correct:

```js
const contactName = ExcelUtility.getCellValue(
    EXCEL_FILE_PATH,
    SHEET_NAME,
    4,
    3
);
```

Wrong:

```js
const contactName = "sprider20123";
```

---

## Excel Naming Convention

Excel sheet names must be feature-based.

Correct:

```txt
contact
organization
campaign
lead
```

Wrong:

```txt
sheet1
data
test
```

---

## Excel Utility Usage

Always use reusable utility.

Correct:

```js
ExcelUtility.getCellValue(
EXCEL_FILE_PATH,
SHEET_NAME,
row,
column
);
```

Avoid duplicate Excel code.

Wrong:

```js
const workbook = XLSX.readFile(file);
const sheet = workbook.Sheets["Sheet1"];
```

Use utility instead.

---

# Environment Variable Rules

Sensitive data must go inside `.env`

Allowed:

```env
APP_USERNAME=admin
APP_PASSWORD=admin
BASE_URL=https://app.com
```

Wrong:

```js
await login("admin","admin")
```

Access Environment Variables:

```js
process.env.APP_USERNAME
process.env.APP_PASSWORD
```

Dotenv configuration:

```js
dotenv.config({
path: path.resolve(process.cwd(), '.env')
});
```

---

# Fixture Standards

Framework must use fixture-driven execution.

Login/logout must be centralized.

Correct:

```js
forEachTest: [
async ({
page,
loginPage,
homePage
}, use) => {

await page.goto(baseURL);

await loginPage.login(
process.env.APP_USERNAME,
process.env.APP_PASSWORD
);

await use();

await homePage.logout();

},
{ auto: true }]
```

Benefits:

- No duplicate login
- Faster maintenance
- Cleaner tests
- Centralized control

---

# Popup Handling Rules

Use Promise.all()

Correct:

```js
const [popup] = await Promise.all([
this.page.context().waitForEvent('page'),
this.orglookUP.click()
]);
```

Wait for popup load:

```js
await popup.waitForLoadState();
```

After popup:

```js
await this.page.bringToFront();
```

Wrong:

```js
await this.orglookUP.click();

const popup =
this.page.context().pages()[1];
```

Reason:
Unstable.

---

# Wait Handling Rules

Avoid:

```js
waitForTimeout()
```

Wrong:

```js
await page.waitForTimeout(5000);
```

Preferred:

```js
await locator.waitFor();
```

Or:

```js
await popup.waitForLoadState();
```

Or:

```js
await expect(locator).toBeVisible();
```

---

# Assertion Rules

Assertions belong only in:

- Spec Layer

Never in Page Layer.

Correct:

```js
const data =
await contactLastNameElement.innerText();

await expect(data)
.toContain(lastName);
```

Wrong:

```js
expect(await locator.textContent())
.toContain(lastName);
```

inside page class.

---

# Logging Rules

Meaningful logs only.

Correct:

```js
console.log(
"Contact created successfully"
);
```

Avoid spam logs.

Wrong:

```js
console.log("1");
console.log("2");
console.log("hello");
```

---

# Error Handling

Prefer Playwright auto waiting.

Avoid excessive try-catch.

Wrong:

```js
try {
await locator.click();
} catch(e) {}
```

Only use try-catch when truly needed.

---

# Code Reusability Standards

Duplicate logic must become reusable methods.

Wrong:

```js
await page.fill("input[name='lastname']",name);
await page.click("button");
```

repeated across tests.

Correct:

```js
await createContactPage
.createContact(lastName);
```

---

# Method Design Standards

Methods must be:

- Small
- Reusable
- Single responsibility

Correct:

```js
createContact()
createContactWithFax()
createContactWithDepartment()
```

Wrong:

```js
createContactWithEverything()
```

---

# Page Validation Rule

Optional page validation allowed.

Example:

```js
await expect(page)
.toHaveURL(/Contacts/);
```

Recommended after navigation.

---
# Common Elements Inside Constructor Rule

## Define Common Page Elements in Constructor

All reusable/common elements belonging to the same page must be initialized inside the constructor.

Purpose:

- Avoid duplicate locator creation
- Improve maintainability
- Better readability
- Faster execution
- Cleaner methods

Correct Example:

```js
export class CreateContactPage {

    constructor(page) {
        this.page = page;

        this.saveBtn =
            page.locator(
                "(//input[@title='Save [Alt+S]'])[1]"
            );

        this.latnameEdt =
            page.locator(
                "input[name='lastname']"
            );

        this.orglookUP =
            page.locator(
                "//*[normalize-space(.)='Organization Name']/..//img"
            );
    }

    async createContact(lastName) {
        await this.latnameEdt.fill(lastName);
        await this.saveBtn.click();
    }
}
```

Benefits:

- Single locator definition
- Easier maintenance
- Reusable across methods
- Cleaner code
- Reduced duplication

---

## Avoid Defining Static Locators Inside Methods

Wrong:

```js
async createContact(lastName) {

    await this.page
        .locator("input[name='lastname']")
        .fill(lastName);

    await this.page
        .locator("(//input[@title='Save [Alt+S]'])[1]")
        .click();
}
```

Problem:

- Duplicate locator creation
- Harder maintenance
- Poor readability
- Difficult debugging

---

## Dynamic Locator Exception

Locators can be created inside methods only if they are dynamic.

Correct:

```js
async selectOrganization(orgName) {

    await this.page
        .locator(`//a[text()='${orgName}']`)
        .click();
}
```

Reason:

`orgName` changes dynamically.

---

## Constructor Best Practice

Constructor should contain:

✅ Static reusable locators

Method should contain:

✅ Dynamic locators only

Golden Rule:

**If locator is reused across methods or static on page → keep in constructor.**

**If locator depends on runtime data → create inside method.**
---

# Test Structure Standard

Each test should contain:

1. Page object initialization
2. Test data retrieval
3. Dynamic test data
4. Navigation
5. Action
6. Verification
7. Cleanup via fixture

Correct Example:

```js
test('create contact',
async ({ page, homePage }) => {

const contactsPage =
new ContactsPage(page);

const createContactPage =
new CreateContactPage(page);

const lastName =
`${contactName}_${Math.floor(Math.random()*1000)}`;

await homePage.goToContacts();

await contactsPage
.clickCreateContact();

await createContactPage
.createContact(lastName);

const data =
await detailsPage
.contact_LastName_Element()
.innerText();

await expect(data)
.toContain(lastName);

});
```

---

# Forbidden Practices

Never do these:

❌ Hardcoded credentials

❌ waitForTimeout()

❌ Assertions inside POM

❌ Duplicate code

❌ Massive methods

❌ Fragile XPath

❌ Static test data

❌ Login inside tests

❌ Direct Excel parsing in test

❌ Business logic inside page class

---

# AI Code Generation Rules

When generating framework code:

AI must:

- Follow POM
- Use reusable methods
- Use fixture login
- Avoid duplicate code
- Use Excel utility
- Use dynamic data
- Follow naming standards
- Put assertions in spec
- Use stable locator strategy
- Follow popup handling pattern

AI must NOT:

- Generate hardcoded waits
- Put expect in page class
- Create monolithic methods
- Duplicate locators
- Hardcode credentials
- Ignore framework naming

---

# Final Goal

The framework must remain:

- Scalable
- Stable
- Readable
- Reusable
- Enterprise-ready
- AI-friendly

Every new automation implementation must follow this instruction document strictly.
