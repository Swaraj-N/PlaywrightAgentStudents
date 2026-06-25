# Playwright Automation Framework Skill File

## Objective

This skill file defines how developers and AI code generators must understand, generate, and maintain automation code for this Playwright framework.

This document acts as:

1. Developer implementation guide
2. AI coding behavior standard
3. Framework consistency rulebook

Framework Stack:

- Playwright
- JavaScript
- Page Object Model (POM)
- Fixture-Based Framework
- Excel Data Driven Testing
- Environment Configuration
- Reusable Utilities

---

# AI/Developer Role

The developer or AI must behave as:

- Senior Automation Engineer
- Framework Maintainer
- Reusability-focused engineer
- Stability-focused engineer

Generated code must always prioritize:

1. Stability
2. Readability
3. Reusability
4. Maintainability
5. Enterprise scalability

---

# Framework Understanding Skill

Must understand framework architecture.

Framework Structure:

```txt
project-root/
│
├── baseFixture/
├── pages/
├── tests/
├── utility/
├── testdata/
└── .env
```

Responsibilities:

| Folder | Responsibility |
|--------|----------------|
| pages | Page locators and actions |
| tests | Assertions and flow |
| utility | Common reusable logic |
| fixture | Login/logout setup |
| testdata | Excel data |

---

# POM Understanding Skill

Must understand Page Object Model.

Page class responsibilities:

- Locators
- Actions
- Reusable methods

Spec responsibilities:

- Assertions
- Validation
- Navigation
- Business flow

Correct POM:

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
}

async createContact(lastName) {

    await this.latnameEdt.fill(lastName);

    await this.saveBtn.click();
}

}
```

Wrong:

```js
async createContact(lastName) {

await this.latnameEdt.fill(lastName);

await this.saveBtn.click();

expect(await this.page
.locator("text=Success"))
.toBeVisible();
}
```

Reason:

Assertions belong in test layer.

---

# Constructor Skill

Must understand constructor design.

Constructor should contain:

✅ Common reusable locators of same page

Correct:

```js
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
```

Wrong:

```js
async createContact() {

await this.page
.locator("input[name='lastname']")
.fill(lastName);

}
```

Rule:

Reusable static locators belong inside constructor.

Dynamic locators belong inside methods.

Correct Dynamic Locator:

```js
popup.locator(
`//a[text()='${orgName}']`
);
```

---

# Locator Skill

Must know locator priority.

Preferred order:

1. id
2. name
3. role
4. label
5. css
6. xpath

Best:

```js
page.locator("#search_txt")
```

Good:

```js
page.locator(
"input[name='lastname']"
)
```

Avoid fragile XPath:

Wrong:

```js
(//div)[4]/div[3]
```

Allowed XPath:

```js
//*[normalize-space(.)='Organization Name']/..//img
```

Locator strategy must prioritize stability.

---

# Method Design Skill

Methods must be:

- Small
- Reusable
- Single responsibility

Good:

```js
createContact()

createContactWithDepartment()

createContactWithFax()
```

Bad:

```js
createEverything()
```

Rule:

One method = one business action.

---

# Fixture Understanding Skill

Must understand fixture lifecycle.

Login/logout handled automatically.

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

Never generate login code in tests.

Wrong:

```js
await page.fill('#username','admin');
await page.fill('#password','admin');
```

inside test.

---

# Test Data Skill

Must use externalized data.

Preferred:

- Excel
- .env

Correct:

```js
ExcelUtility.getCellValue(
EXCEL_FILE_PATH,
SHEET_NAME,
4,
2
);
```

Wrong:

```js
const name = "John";
```

Dynamic test data preferred.

Correct:

```js
const lastName =
`${contactName}_${Math.floor(Math.random()*1000)}`;
```

Reason:

Avoid duplicate failures.

# Popup Handling Skill

Must know popup handling pattern.

Correct:

```js
const [popup] = await Promise.all([
this.page.context().waitForEvent('page'),
this.orglookUP.click()
]);

await popup.waitForLoadState();

await popup
.locator("#search_txt")
.fill(orgName);

await popup
.locator("input[name='search']")
.click();

await popup
.locator(`//a[text()='${orgName}']`)
.click();

await this.page.bringToFront();
```

Wrong:

```js
await this.orglookUP.click();

const popup =
this.page.context().pages()[1];
```

Reason:

Unstable popup handling.

---

# Assertion Skill

Assertions belong only in spec layer.

Correct:

```js
const contactLastNameElement =
await createContactDetailsPage
.conatct_LastName_Element();

const data =
await contactLastNameElement
.innerText();

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

# Test Structure Skill

Must generate tests in this structure.

Step 1: Initialize Page Objects

```js
const contactsPage =
new ContactsPage(page);

const createContactPage =
new CreateContactPage(page);
```

Step 2: Read Test Data

```js
const contactName =
ExcelUtility.getCellValue(
EXCEL_FILE_PATH,
SHEET_NAME,
4,
3
);
```

Step 3: Generate Dynamic Data

```js
const lastName =
`${contactName}_${Math.floor(Math.random()*1000)}`;
```

Step 4: Navigation

```js
await homePage.goToContacts();

await contactsPage
.clickCreateContact();
```

Step 5: Action

```js
await createContactPage
.createContact(lastName);
```

Step 6: Verification

```js
await expect(data)
.toContain(lastName);
```

---

# Wait Handling Skill

Must avoid hard waits.

Wrong:

```js
await page.waitForTimeout(5000);
```

Correct:

```js
await locator.waitFor();
```

or

```js
await popup.waitForLoadState();
```

or

```js
await expect(locator)
.toBeVisible();
```

Rule:

Prefer Playwright auto waiting.

---

# Environment Variable Skill

Credentials must come from `.env`.

Correct:

```env
APP_USERNAME=admin
APP_PASSWORD=admin
```

Access:

```js
process.env.APP_USERNAME
process.env.APP_PASSWORD
```

Wrong:

```js
login("admin","admin")
```

Reason:

Security and maintainability.

---

# Naming Convention Skill

Must follow naming conventions.

Page Class:

```js
CreateContactPage
```

Method:

```js
createContact()
```

Locator:

```js
saveBtn
latnameEdt
orglookUP
```

Test File:

```txt
CreateContact.spec.js
```

Wrong:

```js
create_contact()

SAVEBUTTON

createContactpage
```

---

# Code Reusability Skill

Must avoid duplicate logic.

Wrong:

```js
await page.fill(
"input[name='lastname']",
name
);

await page.click("button");
```

repeated in tests.

Correct:

```js
await createContactPage
.createContact(lastName);
```

Rule:

Duplicate logic → reusable method.

---

# Error Handling Skill

Avoid unnecessary try-catch.

Wrong:

```js
try {

await locator.click();

} catch(e) {

}
```

Correct:

```js
await locator.click();
```

Playwright already retries automatically.

Use try-catch only when recovery logic exists.

---

# Logging Skill

Logs should be meaningful.

Correct:

```js
console.log(
"Contact created successfully"
);
```

Wrong:

```js
console.log("1");
console.log("hello");
console.log("done");
```

---

# Enterprise Automation Skill

Generated automation must be:

- Stable
- Readable
- Reusable
- Scalable
- Maintainable

Code should support:

- Multiple modules
- Parallel execution
- CI/CD execution
- Data-driven testing

---

# AI Generation Rules

When AI generates code:

AI MUST:

✅ Follow POM

✅ Use constructor locators

✅ Use fixture login

✅ Use reusable methods

✅ Use Excel utility

✅ Generate dynamic data

✅ Put assertions in spec

✅ Use Promise.all() for popup

✅ Follow naming convention

✅ Prefer stable locators

AI MUST NOT:

❌ Add waitForTimeout()

❌ Add assertions in page class

❌ Hardcode credentials

❌ Duplicate locator logic

❌ Create massive methods

❌ Generate unstable XPath

❌ Ignore fixture architecture

❌ Put static locator inside methods

---

# Quality Checklist

Before finalizing code verify:

- Is POM followed?
- Are locators inside constructor?
- Is test data externalized?
- Is fixture used?
- Are assertions in spec?
- Is dynamic data added?
- Is popup handling correct?
- Are waits optimized?
- Are methods reusable?
- Are naming conventions followed?

If answer is YES to all,
implementation is valid.

---

# Final Objective

Every generated automation code must look like:

- Senior automation engineer implementation
- Enterprise framework standard
- Maintainable long-term code
- Team-friendly implementation
- AI-consistent implementation

Framework consistency is mandatory.
