# Test Reference

## Objective

This document defines the standard implementation pattern for test/spec files in the Playwright framework.

Purpose:

- Developer reference
- AI generation reference
- Spec layer standardization
- Enterprise automation test design

Framework:

- Playwright
- JavaScript
- POM
- Fixture Based

---

# Test Layer Responsibilities

Test/spec files should contain:

✅ Business flow

✅ Navigation

✅ Page object initialization

✅ Assertions

✅ Test data retrieval

✅ Dynamic data generation

✅ Test orchestration

Test/spec files should NOT contain:

❌ Raw locators

❌ Duplicate UI interaction logic

❌ Login logic

❌ Hard waits

❌ Business implementation inside test

---

# Standard Test Structure

Every test must follow:

```txt
Arrange → Act → Assert
```

Flow:

1. Page Initialization
2. Test Data Retrieval
3. Dynamic Data Generation
4. Navigation
5. Action
6. Verification

---

# Standard Test File Structure

Example:

```js
import {
test,
expect
}
from '../../baseFixture/fixture.js';

import {
ContactsPage
}
from '../../pages/ContactsPage.js';

import {
CreateContactPage
}
from '../../pages/CreateContactPage.js';

import {
CreateContactDetailsPage
}
from '../../pages/CreateContactDetailsPage.js';

import {
ExcelUtility
}
from '../../utility/ExcelUtility.js';
```

Purpose:

- Reusable framework imports
- Page objects
- Utility access

---

# Standard Test Example

## CreateContact.spec.js

```js
import {
test,
expect
}
from '../../baseFixture/fixture.js';

import {
ContactsPage
}
from '../../pages/ContactsPage.js';

import {
CreateContactPage
}
from '../../pages/CreateContactPage.js';

import {
CreateContactDetailsPage
}
from '../../pages/CreateContactDetailsPage.js';

import {
ExcelUtility
}
from '../../utility/ExcelUtility.js';

const EXCEL_FILE_PATH =
'testdata/testdata.xlsx';

const SHEET_NAME =
'contact';

test.describe(
'Create Contact Module',
() => {

test(
'Create contact with mandatory details',
async ({
page,
homePage
}) => {

    // Arrange
    const contactsPage =
        new ContactsPage(page);

    const createContactPage =
        new CreateContactPage(page);

    const createContactDetailsPage =
        new CreateContactDetailsPage(page);

    // Test Data
    const contactName =
        ExcelUtility.getCellValue(
            EXCEL_FILE_PATH,
            SHEET_NAME,
            4,
            3
        );

    // Dynamic data
    const lastName =
    `${contactName}_${Math.floor(Math.random()*1000)}`;

    // Act
    await homePage.goToContacts();

    await contactsPage
    .clickCreateContact();

    await createContactPage
    .createContactwithOrgnazationLookUp(
        lastName,
        'sprider20123'
    );

    // Assert
    const contactLastNameElement =
        await createContactDetailsPage
        .conatct_LastName_Element();

    const data =
        await contactLastNameElement
        .innerText();

    await expect(data)
    .toContain(lastName);

    // Optional page validation
    await expect(page)
    .toHaveURL(/Contacts/);

});
});
```

Why correct:

✅ Page objects initialized

✅ Fixture usage

✅ No login duplication

✅ Excel data

✅ Dynamic data

✅ Assertions in spec

✅ Reusable implementation

---

# Arrange → Act → Assert Pattern

Recommended format:

```js
// Arrange
const contactsPage =
new ContactsPage(page);

// Act
await homePage.goToContacts();

await contactsPage
.clickCreateContact();

// Assert
await expect(data)
.toContain(lastName);
```

Benefits:

- Readable
- Maintainable
- Cleaner debugging

---

# Page Object Initialization Rule

Always initialize page objects at start.

Correct:

```js
const contactsPage =
new ContactsPage(page);

const createContactPage =
new CreateContactPage(page);
```

Wrong:

```js
await new CreateContactPage(page)
.createContact(lastName);
```

Reason:

Poor readability.

---

# Test Data Rule

Always externalize test data.

Correct:

```js
const contactName =
ExcelUtility.getCellValue(
EXCEL_FILE_PATH,
SHEET_NAME,
4,
3
);
```

Wrong:

```js
const contactName =
"John";
```

Rule:

Avoid hardcoded test data.

---

# Dynamic Data Rule

Always generate unique records.

Correct:

```js
const lastName =
`${contactName}_${Math.floor(Math.random()*1000)}`;
```

Alternative:

```js
const random =
Math.floor(Math.random()*9999);

const lastName =
`${contactName}_${random}`;
```

Reason:

Avoid duplicate failures.

---

# Navigation Rule

Navigation belongs in test layer.

Correct:

```js
await homePage.goToContacts();

await contactsPage
.clickCreateContact();
```

Wrong:

```js
async createContact() {

await homePage.goToContacts();

}
```

inside page class.

Reason:

Page class should only own page actions.

---

# Assertion Rule

Assertions belong only in spec.

Correct:

```js
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

inside POM.

---

# Wait Strategy

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
await expect(locator)
.toBeVisible();
```

or

```js
await page.waitForLoadState();
```

Rule:

Prefer Playwright auto waiting.

---

# Test Naming Convention

Test file:

```txt
CreateContact.spec.js
```

Describe block:

```js
test.describe(
'Create Contact Module'
)
```

Test name:

```js
'Create contact with mandatory details'
```

Rule:

Names should describe business scenario.

Avoid:

```js
test('test1')
```

Bad naming.

---

# Good vs Bad Example

## Good

```js
test(
'Create contact',
async ({
page,
homePage
}) => {

const contactsPage =
new ContactsPage(page);

await homePage.goToContacts();

});
```

Why good:

✅ Readable

✅ Structured

✅ Reusable

---

## Bad

```js
test('test1', async ({ page }) => {

await page.goto(url);

await page.click("div");

await page.fill("input","John");

});
```

Why bad:

❌ Hardcoded

❌ No POM

❌ No fixture

❌ Poor locator

❌ No structure

---

# Test Checklist

Before finalizing test verify:

- Page objects initialized?
- Fixture used?
- Test data externalized?
- Dynamic data added?
- Assertions in spec?
- Arrange → Act → Assert followed?
- No raw locator?
- No hard waits?
- Reusable methods used?

If YES → valid test implementation.

---

# Final Goal

Every test should look like:

- Senior automation engineer code
- Enterprise framework standard
- Readable structure
- Maintainable implementation
- Reusable framework usage
- AI-consistent pattern

This document is the master test reference.
