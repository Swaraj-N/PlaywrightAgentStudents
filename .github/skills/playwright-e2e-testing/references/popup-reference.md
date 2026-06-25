# Popup Reference

## Objective

This document defines the standard implementation pattern for popup/window handling in the Playwright automation framework.

Purpose:

- Developer reference
- AI generation reference
- Stable popup handling
- Flaky test prevention

Framework:

- Playwright
- JavaScript
- POM

---

# Popup Handling Rule

Always handle popup using:

```js
Promise.all()
```

Rule:

Popup handling must avoid race conditions.

Wrong popup handling creates flaky tests.

---

# Why Promise.all()?

When clicking popup link:

```js
await this.orglookUP.click();
```

the popup opens immediately.

If Playwright starts waiting after click,
it may miss the popup event.

Wrong:

```js
await this.orglookUP.click();

const popup =
await this.page
.context()
.waitForEvent('page');
```

Problem:

❌ Race condition

❌ Popup may already open

❌ Flaky execution

---

# Standard Popup Pattern

Always use:

```js
const [popup] =
await Promise.all([

this.page
.context()
.waitForEvent('page'),

this.orglookUP.click()

]);
```

Why correct:

✅ No race condition

✅ Stable

✅ Playwright recommended

---

# Full Popup Example

## Organization Lookup

Correct:

```js
async createContactwithOrgnazationLookUp(
lastName,
orgName
) {

    await this.latnameEdt.fill(lastName);

    // Wait popup + click
    const [popup] =
    await Promise.all([

        this.page
        .context()
        .waitForEvent('page'),

        this.orglookUP.click()

    ]);

    // Wait for popup load
    await popup.waitForLoadState();

    // Search organization
    await popup
    .locator("#search_txt")
    .fill(orgName);

    await popup
    .locator(
        "input[name='search']"
    )
    .click();

    // Dynamic selection
    await popup
    .locator(
        `//a[text()='${orgName}']`
    )
    .click();

    // Return focus
    await this.page.bringToFront();

    // Save
    await this.saveBtn.click();
}
```

Why correct:

✅ Stable popup handling

✅ Dynamic locator

✅ Proper wait

✅ Returns to parent page

---

# Popup Wait Strategy

Always wait for popup load.

Correct:

```js
await popup.waitForLoadState();
```

Alternative:

```js
await popup.waitForLoadState(
'domcontentloaded'
);
```

Avoid immediate interaction.

Wrong:

```js
await popup
.locator("#search_txt")
.fill(orgName);
```

before load.

Problem:

❌ Element not found

❌ Timing failure

---

# Parent Page Focus Rule

After popup action:

Always return focus.

Correct:

```js
await this.page.bringToFront();
```

Reason:

Ensures interaction resumes in parent page.

Without it:

❌ Parent page interaction may fail

---

# Dynamic Locator in Popup

Dynamic locator allowed.

Correct:

```js
await popup
.locator(
`//a[text()='${orgName}']`
)
.click();
```

Reason:

Runtime-dependent data.

Rule:

Dynamic locator → method

Static locator → constructor

---

# Popup Search Pattern

Recommended flow:

```txt
Open popup
↓
Wait for load
↓
Search data
↓
Select record
↓
Return to parent page
↓
Continue workflow
```

Example:

```js
await popup
.locator("#search_txt")
.fill(orgName);

await popup
.locator(
"input[name='search']"
)
.click();

await popup
.locator(
`//a[text()='${orgName}']`
)
.click();
```

---

# Multiple Popup Rule

For multiple windows:

Correct:

```js
const [popup] =
await Promise.all([
context.waitForEvent('page'),
clickAction()
]);
```

Avoid:

```js
context.pages()[1]
```

Problem:

❌ Index unreliable

❌ Flaky execution

---

# Common Popup Mistakes

## Mistake 1

Wrong:

```js
await click();

await waitForEvent('page');
```

Problem:

Popup already opened.

---

## Mistake 2

Wrong:

```js
const popup =
context.pages()[1];
```

Problem:

Unstable.

---

## Mistake 3

Wrong:

```js
await popup.click();
```

without load wait.

Problem:

Timing issue.

---

# Good vs Bad Example

## Good

```js
const [popup] =
await Promise.all([

this.page
.context()
.waitForEvent('page'),

this.orglookUP.click()

]);

await popup.waitForLoadState();
```

Why good:

✅ Stable

✅ Reliable

✅ No race condition

---

## Bad

```js
await this.orglookUP.click();

const popup =
this.page
.context()
.pages()[1];
```

Why bad:

❌ Timing issue

❌ Unstable

❌ Flaky

---

# Popup Checklist

Before finalizing popup handling verify:

- Promise.all() used?
- waitForEvent('page') used?
- waitForLoadState() added?
- Parent focus returned?
- Dynamic locator handled?
- No pages()[1] usage?
- No hard wait?

If YES → valid popup implementation.

---

# Final Goal

Popup handling should provide:

- Stability
- Reliable execution
- No race conditions
- Low flaky failures
- Enterprise-ready implementation

This document is the master popup reference.
