# Debug Reference

## Objective

This document defines the standard debugging strategy for the Playwright automation framework.

Purpose:

- Developer reference
- AI generation reference
- Failure troubleshooting
- Faster root cause analysis
- Stable automation debugging

Framework:

- Playwright
- JavaScript

---

# Debugging Goal

Debugging should help identify:

✅ Locator failures

✅ Timing issues

✅ Popup failures

✅ Navigation failures

✅ Assertion failures

✅ Flaky execution

✅ Environment issues

---

# Debug Priority Order

When test fails investigate in order:

```txt
1. Screenshot
2. Video
3. Trace Viewer
4. Console Logs
5. Playwright Inspector
6. Locator Validation
```

Rule:

Never guess failures.

Always debug systematically.

---

# Playwright Inspector

Best for interactive debugging.

Usage:

```js
await page.pause();
```

Example:

```js
await homePage
.goToContacts();

await page.pause();

await contactsPage
.clickCreateContact();
```

What it helps:

- Validate locator
- Inspect UI
- Run selector check
- Verify visibility
- Observe execution

Benefits:

✅ Fast debugging

✅ Visual inspection

✅ Locator validation

---

# Run Test in Debug Mode

Recommended:

```bash
npx playwright test --debug
```

Benefits:

- Slow execution
- Inspector enabled
- Easier troubleshooting

---

# Headed Mode

Run browser visible.

Command:

```bash
npx playwright test --headed
```

Why:

Better UI visibility.

Useful for:

- Popup debugging
- Locator issue
- Animation issue

---

# Screenshot Debugging

Take screenshot during failure.

Recommended:

```js
await page.screenshot({
path: 'debug.png'
});
```

Example:

```js
await createContactPage
.createContact(lastName);

await page.screenshot({
path: 'contact-page.png'
});
```

Why:

Helps inspect UI state.

Benefits:

✅ Fast diagnosis

✅ Visual evidence

---

# Element Screenshot

Recommended:

```js
await locator.screenshot({
path: 'element.png'
});
```

Example:

```js
await this.saveBtn
.screenshot({
path: 'saveBtn.png'
});
```

Use when:

Specific element issue.

---

# Console Logging

Recommended:

```js
console.log(
"Created Contact =>",
data
);
```

Good for:

- Dynamic values
- Debugging data
- Runtime validation

Avoid excessive logging.

Bad:

```js
console.log("1");
console.log("2");
console.log("3");
```

---

# Trace Viewer

Best for failure analysis.

Enable in config:

```js
use: {

trace:
'on-first-retry'

}
```

Alternative:

```js
trace: 'on'
```

for debugging.

Run trace:

```bash
npx playwright show-trace trace.zip
```

Why:

Shows:

- Timeline
- Screenshots
- Network
- Actions
- Errors

Benefits:

✅ Enterprise debugging

✅ Best root cause analysis

---

# Video Recording

Enable:

```js
use: {

video:
'on-first-retry'

}
```

Alternative:

```js
video: 'on'
```

Why:

Visual replay of failure.

Useful for:

- Flaky tests
- Popup issue
- Unexpected UI behavior

---

# Slow Motion Debugging

Recommended:

```js
launchOptions: {

slowMo: 1000

}
```

Example:

```js
use: {

launchOptions: {

slowMo: 1000

}

}
```

Why:

Observe execution step-by-step.

---

# Locator Debugging

Validate locator:

```js
await locator.highlight();
```

Example:

```js
await this.saveBtn
.highlight();
```

Why:

See exact targeted element.

---

# Count Locator Matches

Recommended:

```js
const count =
await locator.count();

console.log(count);
```

Why:

Check duplicate locator issue.

---

# Popup Debugging

Recommended:

```js
const [popup] =
await Promise.all([

page.context()
.waitForEvent('page'),

clickAction()

]);

console.log(
popup.url()
);
```

Why:

Validate popup opened.

---

# Network Failure Debugging

Capture request:

```js
page.on(
'request',
request => {

console.log(
request.url()
);

});
```

Response:

```js
page.on(
'response',
response => {

console.log(
response.status()
);

});
```

Useful for:

- API failures
- Navigation issue

---

# Common Failure Root Cause

## Locator Failure

Symptoms:

```txt
locator not found
```

Fix:

- Validate locator
- Use Inspector
- Check iframe

---

## Timing Failure

Symptoms:

```txt
Timeout exceeded
```

Fix:

Use:

```js
await locator.waitFor();
```

Avoid:

```js
waitForTimeout()
```

---

## Popup Failure

Symptoms:

```txt
popup undefined
```

Fix:

Use:

```js
Promise.all()
```

---

## Assertion Failure

Symptoms:

```txt
Expected vs Actual mismatch
```

Fix:

Log actual value.

Example:

```js
console.log(actual);
```

---

# Recommended Debug Flow

```txt
Failure
↓
Screenshot
↓
Trace Viewer
↓
Inspector
↓
Locator Validation
↓
Fix Root Cause
```

---

# Good vs Bad Example

## Good

```js
await page.pause();
```

Why good:

✅ Interactive debugging

---

## Bad

```js
await page.waitForTimeout(
100000
);
```

Why bad:

❌ Waste time

❌ Not debugging

❌ Slows suite

---

# Debug Checklist

Before debugging verify:

- Screenshot checked?
- Trace reviewed?
- Locator validated?
- Inspector used?
- Popup flow validated?
- Logs reviewed?
- Root cause identified?

If YES → debugging complete.

---

# Final Goal

Debugging strategy should provide:

- Fast failure analysis
- Reliable troubleshooting
- Stable automation
- Low flaky tests
- Enterprise-grade diagnosis

This document is the master debug reference.
