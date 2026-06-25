# Wait Reference

## Objective

This document defines the standard waiting strategy for the Playwright automation framework.

Purpose:

- Developer reference
- AI generation reference
- Stable synchronization
- Flaky test prevention

Framework:

- Playwright
- JavaScript
- Playwright Auto-Waiting

---

# Waiting Strategy Goal

Wait strategy should ensure:

✅ Stable execution

✅ Proper synchronization

✅ Faster execution

✅ Reduced flaky failures

Avoid:

❌ Hard waits

❌ Unnecessary delays

❌ Timing failures

---

# Playwright Auto Wait

Playwright automatically waits for:

- Element visible
- Element enabled
- Element stable
- Navigation complete
- Actionability check

Example:

```js
await this.saveBtn.click();
```

No need:

```js
await page.waitForTimeout(5000);
```

Reason:

Playwright already waits internally.

---

# Golden Rule

Never use:

```js
waitForTimeout()
```

Wrong:

```js
await page.waitForTimeout(5000);
```

Problems:

❌ Slow execution

❌ Unstable

❌ Environment dependent

❌ Not scalable

Rule:

Hard wait is last option only.

---

# Preferred Wait Priority

Always follow:

```txt
1. Auto wait
2. expect()
3. locator.waitFor()
4. waitForLoadState()
5. waitForResponse()
6. Hard wait (rare)
```

---

# Auto Wait Example

Correct:

```js
await this.saveBtn.click();
```

Why:

Playwright waits automatically.

---

# Expect-Based Wait

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

Why:

Stable validation + waiting.

Benefits:

✅ Readable

✅ Reliable

---

# locator.waitFor()

Use when explicit wait needed.

Correct:

```js
await locator.waitFor();
```

Alternative:

```js
await locator.waitFor({

state: 'visible'

});
```

States:

```txt
attached
detached
visible
hidden
```

Example:

```js
await this.saveBtn
.waitFor({
state: 'visible'
});
```

---

# waitForLoadState()

Recommended for:

- Navigation
- Popup
- Heavy pages

Correct:

```js
await page.waitForLoadState();
```

Popup Example:

```js
await popup
.waitForLoadState();
```

Alternative:

```js
await page.waitForLoadState(
'domcontentloaded'
);
```

Options:

```txt
load
domcontentloaded
networkidle
```

---

# waitForURL()

Recommended for navigation validation.

Correct:

```js
await page.waitForURL(
/Contacts/
);
```

Example:

```js
await contactsPage
.clickCreateContact();

await page.waitForURL(
/CreateContact/
);
```

Why:

Ensures page loaded.

---

# waitForResponse()

Recommended for API synchronization.

Correct:

```js
await page.waitForResponse(
response =>
response.url()
.includes('/api')
&& response.status() === 200
);
```

Use when:

- API-based page
- Async save

---

# waitForSelector()

Allowed but not preferred.

Correct:

```js
await page.waitForSelector(
"#search_txt"
);
```

Preferred:

```js
await locator.waitFor();
```

Reason:

Locator approach cleaner.

---

# Popup Wait Strategy

Correct:

```js
const [popup] =
await Promise.all([

page.context()
.waitForEvent('page'),

clickAction()

]);

await popup.waitForLoadState();
```

Why:

Stable popup execution.

---

# Avoid Arbitrary Wait

Wrong:

```js
await page.waitForTimeout(
10000
);
```

Problem:

❌ Slower test

❌ Not scalable

❌ Timing issue still possible

---

# Conditional Wait Example

Recommended:

```js
if (
await locator.isVisible()
) {

await locator.click();

}
```

Use carefully.

---

# Loader Wait Pattern

Correct:

```js
await loader.waitFor({

state: 'hidden'

});
```

Example:

```js
await page.locator(
'.loader'
)
.waitFor({
state: 'hidden'
});
```

Why:

Avoid loading race condition.

---

# Wait in Assertion

Recommended:

```js
await expect(locator)
.toHaveText(
"Success"
);
```

Why:

Playwright retries automatically.

---

# Good vs Bad Example

## Good

```js
await expect(locator)
.toBeVisible();
```

Why good:

✅ Auto retry

✅ Stable

---

## Bad

```js
await page.waitForTimeout(
5000
);
```

Why bad:

❌ Slow

❌ Flaky

❌ Environment dependent

---

# Common Waiting Mistakes

## Mistake 1

Wrong:

```js
waitForTimeout()
```

Problem:

Hard wait.

---

## Mistake 2

Wrong:

```js
click();

wait();
```

Problem:

Incorrect synchronization.

---

## Mistake 3

Wrong:

```js
await popup.click();
```

without:

```js
waitForLoadState()
```

Problem:

Timing failure.

---

# Wait Checklist

Before finalizing wait strategy verify:

- Auto wait enough?
- expect() used?
- locator.waitFor() needed?
- waitForLoadState() added?
- Popup synchronized?
- No unnecessary timeout?
- No hard waits?

If YES → valid wait implementation.

---

# Final Goal

Wait strategy should provide:

- Stable execution
- Faster test run
- Minimal flaky tests
- Reliable synchronization
- Enterprise-grade automation

This document is the master wait reference.
