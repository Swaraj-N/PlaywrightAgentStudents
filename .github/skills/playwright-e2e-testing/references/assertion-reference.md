# Assertion Reference

## Objective

This document defines the standard assertion strategy for the Playwright automation framework.

Purpose:

- Developer reference
- AI generation reference
- Validation standardization
- Stable test verification

Framework:

- Playwright
- JavaScript
- POM

---

# Assertion Responsibility

Assertions belong only in:

✅ Spec/Test layer

Assertions should NOT exist in:

❌ Page classes (POM)

❌ Fixture

❌ Utility

Rule:

**POM performs action. Test performs validation.**

---

# Why Keep Assertions in Spec Layer?

Benefits:

- Better separation of concerns
- Reusable page methods
- Cleaner maintenance
- Flexible validations

Bad Example:

```js
async createContact(lastName) {

await this.latnameEdt.fill(lastName);

await this.saveBtn.click();

expect(
await this.page
.locator("text=success")
)
.toBeVisible();

}
```

Problem:

❌ Assertion inside POM

❌ Method not reusable

---

# Correct Assertion Pattern

Correct:

### POM

```js
async createContact(lastName) {

await this.latnameEdt.fill(lastName);

await this.saveBtn.click();

}
```

### Test

```js
const data =
await contactLastNameElement
.innerText();

await expect(data)
.toContain(lastName);
```

Why correct:

✅ Separation maintained

✅ Reusable page methods

---

# Standard Assertion Flow

Recommended pattern:

```txt
Action
↓
Get UI data
↓
Assert expected result
```

Example:

```js
await createContactPage
.createContact(lastName);

const contactLastNameElement =
await createContactDetailsPage
.conatct_LastName_Element();

const data =
await contactLastNameElement
.innerText();

await expect(data)
.toContain(lastName);
```

---

# Common Assertion Types

## Text Validation

Recommended:

```js
await expect(data)
.toContain(lastName);
```

Alternative:

```js
await expect(locator)
.toHaveText(lastName);
```

Use when exact text required.

---

## URL Validation

Recommended:

```js
await expect(page)
.toHaveURL(/Contacts/);
```

Why:

Page navigation verification.

---

## Visibility Assertion

Recommended:

```js
await expect(locator)
.toBeVisible();
```

Example:

```js
await expect(
this.saveBtn
)
.toBeVisible();
```

---

## Enabled Validation

Recommended:

```js
await expect(locator)
.toBeEnabled();
```

Example:

```js
await expect(
this.saveBtn
)
.toBeEnabled();
```

---

## Disabled Validation

Recommended:

```js
await expect(locator)
.toBeDisabled();
```

---

## Element Count Validation

Recommended:

```js
await expect(locator)
.toHaveCount(5);
```

---

## Attribute Validation

Recommended:

```js
await expect(locator)
.toHaveAttribute(
'type',
'text'
);
```

---

# Soft Assertion

When execution should continue:

```js
expect.soft(data)
.toContain(lastName);
```

Use carefully.

Preferred:

```js
expect()
```

Reason:

Hard assertion catches failure immediately.

---

# Assertion Naming Rule

Assertion message should be meaningful.

Good:

```js
await expect(data)
.toContain(lastName);
```

Bad:

```js
expect(result)
.toBe(true);
```

Reason:

Less readable.

---

# Recommended Validation Pattern

Preferred:

```js
const data =
await locator.innerText();

await expect(data)
.toContain(expectedValue);
```

Why:

Readable debugging.

---

# Avoid Direct Boolean Assertion

Avoid:

```js
expect(true)
.toBe(true);
```

Problem:

❌ No business validation

---

# Multiple Assertion Example

Correct:

```js
await expect(page)
.toHaveURL(/Contacts/);

await expect(
contactLastNameElement
)
.toBeVisible();

await expect(data)
.toContain(lastName);
```

Reason:

Better validation coverage.

---

# Good vs Bad Example

## Good

```js
const data =
await contactLastNameElement
.innerText();

await expect(data)
.toContain(lastName);
```

Why good:

✅ Readable

✅ Business validation

✅ Reusable

---

## Bad

```js
expect(true)
.toBe(true);
```

Why bad:

❌ Weak validation

❌ No business meaning

---

# Common Assertion Mistakes

## Mistake 1

Wrong:

```js
expect()
```

inside POM.

Problem:

Separation violation.

---

## Mistake 2

Wrong:

```js
await page.waitForTimeout(5000);

expect(locator)
.toBeVisible();
```

Problem:

Hard wait unnecessary.

---

## Mistake 3

Wrong:

```js
expect(true)
.toBe(true);
```

Problem:

No UI validation.

---

# Assertion Checklist

Before finalizing assertions verify:

- Assertion in spec?
- No assertion in POM?
- Business validation added?
- URL validation needed?
- Visibility checked?
- No hard waits?
- Meaningful validation?

If YES → valid assertion implementation.

---

# Final Goal

Assertions should provide:

- Strong validation
- Clear failures
- Stable verification
- Readable debugging
- Enterprise quality tests

This document is the master assertion reference.
