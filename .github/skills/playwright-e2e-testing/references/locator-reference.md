# Locator Reference

## Objective

This document defines the standard locator strategy for the Playwright automation framework.

Purpose:

- Developer reference
- AI generation reference
- Stable locator guideline
- Flaky test prevention

Framework:

- Playwright
- JavaScript
- Page Object Model

---

# Locator Priority Rule

Always prefer stable locators.

Recommended order:

```txt
1. id
2. name
3. role
4. label
5. css
6. xpath
```

Rule:

Choose the most stable locator available.

---

# Preferred Locator Strategy

## 1. ID Locator (Best)

Preferred:

```js
page.locator("#search_txt")
```

Alternative:

```js
page.locator("[id='search_txt']")
```

Reason:

✅ Fastest

✅ Stable

✅ Unique

---

## 2. Name Locator

Recommended:

```js
page.locator(
"input[name='lastname']"
)
```

Example:

```js
this.latnameEdt =
page.locator(
"input[name='lastname']"
);
```

Reason:

✅ Stable

✅ Readable

---

## 3. Role Locator

Recommended:

```js
page.getByRole(
'button',
{ name: 'Save' }
);
```

Example:

```js
page.getByRole(
'textbox',
{ name: 'Last Name' }
);
```

Reason:

✅ User-centric

✅ Readable

✅ Playwright recommended

---

## 4. Label Locator

Recommended:

```js
page.getByLabel(
'Last Name'
);
```

Reason:

✅ Stable

✅ Semantic

---

## 5. CSS Locator

Recommended:

```js
page.locator(
".save-btn"
)
```

Example:

```js
page.locator(
"button.save-contact"
)
```

Reason:

✅ Cleaner than XPath

⚠ Use when id/name unavailable

---

## 6. XPath Locator (Last Option)

Allowed only if needed.

Correct:

```js
//*[normalize-space(.)='Organization Name']/..//img
```

Your framework example:

```js
this.orglookUP =
page.locator(
"//*[normalize-space(.)='Organization Name']/..//img"
);
```

Reason:

Acceptable when unique locator unavailable.

---

# Avoid Fragile XPath

Wrong:

```js
(//div)[4]/div[3]/table/tr[2]
```

Problems:

❌ Highly unstable

❌ Breaks on UI changes

❌ Hard maintenance

---

# Constructor Locator Rule

Static locators belong in constructor.

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

}
```

Wrong:

```js
async createContact() {

await this.page
.locator(
"input[name='lastname']"
)
.fill(name);

}
```

Rule:

Reusable locator → constructor

---

# Dynamic Locator Rule

Dynamic locator allowed in method.

Correct:

```js
await popup
.locator(
`//a[text()='${orgName}']`
)
.click();
```

Reason:

Runtime-dependent locator.

Rule:

Dynamic value = method locator.

---

# Meaningful Locator Naming

Naming standard:

| Element Type | Suffix |
|--------------|--------|
| Button | Btn |
| Textbox | Edt |
| Dropdown | Dd |
| Checkbox | Chk |
| Label | Lbl |
| Link | Lnk |

Correct:

```js
saveBtn

latnameEdt

contactsLnk

countryDd
```

Wrong:

```js
button1

textbox

abc

element123
```

Reason:

Meaningful locator names improve readability.

---

# Playwright Locator Examples

Textbox:

```js
page.locator(
"input[name='lastname']"
)
```

Button:

```js
page.getByRole(
'button',
{ name: 'Save' }
)
```

Dropdown:

```js
page.locator(
"select[name='country']"
)
```

Checkbox:

```js
page.locator(
"input[type='checkbox']"
)
```

Link:

```js
page.locator(
"a:text('Contacts')"
)
```

---

# Multiple Matching Element Rule

Avoid:

```js
page.locator("button")
```

Preferred:

```js
page.getByRole(
'button',
{ name: 'Save' }
)
```

Reason:

Avoid ambiguity.

---

# Wait + Locator Best Practice

Correct:

```js
await expect(
this.saveBtn
).toBeVisible();
```

or

```js
await this.saveBtn
.waitFor();
```

Wrong:

```js
await page.waitForTimeout(5000);
```

Reason:

Locator-based waiting is stable.

---

# Good vs Bad Locator Example

## Good

```js
this.latnameEdt =
page.locator(
"input[name='lastname']"
);
```

Why good:

✅ Stable

✅ Readable

✅ Maintainable

---

## Bad

```js
page.locator(
"(//div)[5]/table/tr[2]/td[1]"
)
```

Why bad:

❌ Fragile

❌ Hard maintenance

❌ Flaky execution

---

# Locator Checklist

Before finalizing locator verify:

- Stable locator used?
- ID/name preferred?
- XPath avoided?
- Dynamic locator handled?
- Reusable locator in constructor?
- Meaningful naming?
- No ambiguous locator?

If YES → valid locator implementation.

---

# Final Goal

Locator strategy should provide:

- Stability
- Readability
- Reusability
- Low maintenance
- Minimal flaky tests

This document is the master locator reference.
