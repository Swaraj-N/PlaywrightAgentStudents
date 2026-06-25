# Dynamic Data Reference

## Objective

This document defines the standard implementation pattern for dynamic test data generation in the Playwright automation framework.

Purpose:

- Developer reference
- AI generation reference
- Duplicate data prevention
- Parallel-safe execution
- Stable automation execution

Framework:

- Playwright
- JavaScript
- Excel Driven Testing

---

# Why Dynamic Data?

Static test data causes:

❌ Duplicate record failures

❌ Parallel execution conflicts

❌ Unstable automation

❌ Environment pollution

Wrong:

```js
const lastName = "John";
```

Problem:

If record already exists,
test may fail.

Correct:

```js
const lastName =
`${contactName}_${Math.floor(Math.random()*1000)}`;
```

Benefits:

✅ Unique data

✅ Parallel-safe

✅ Stable execution

---

# Dynamic Data Rule

Always generate unique values for:

- Contact names
- Organization names
- Email
- Phone
- Username
- Account name
- Lead name

Rule:

**Reusable test input from Excel + dynamic suffix**

---

# Standard Dynamic Pattern

Recommended:

```js
const lastName =
`${contactName}_${Math.floor(Math.random()*1000)}`;
```

Example output:

```txt
John_341
David_882
Test_109
```

Why recommended:

- Simple
- Fast
- Stable
- Readable

---

# Random Number Pattern

Correct:

```js
const randomNumber =
Math.floor(
Math.random() * 10000
);

const lastName =
`${contactName}_${randomNumber}`;
```

Why:

Improves uniqueness.

---

# Timestamp Pattern

Recommended for uniqueness.

Correct:

```js
const timestamp =
Date.now();

const orgName =
`${baseName}_${timestamp}`;
```

Example output:

```txt
Google_1716519212231
Amazon_1716519213301
```

Benefits:

✅ Highly unique

✅ Better for CI/CD

---

# Date-Time Pattern

Recommended for readable data.

Correct:

```js
const date =
new Date()
.getTime();

const contactName =
`${baseName}_${date}`;
```

Example:

```txt
John_1716519212231
```

---

# UUID Pattern (Advanced)

Recommended for enterprise scale.

Install:

```bash
npm install uuid
```

Usage:

```js
import { v4 as uuidv4 }
from 'uuid';

const uniqueName =
`${contactName}_${uuidv4()}`;
```

Example:

```txt
John_0d3a9f87-xyz
```

Best for:

- High parallel execution
- Cloud execution
- Enterprise CI

---

# Combining Excel + Dynamic Data

Recommended pattern:

```js
const contactName =
ExcelUtility.getCellValue(
EXCEL_FILE_PATH,
SHEET_NAME,
4,
3
);

const lastName =
`${contactName}_${Math.floor(Math.random()*1000)}`;
```

Why:

Excel = reusable business data

Dynamic = uniqueness

Best combination.

---

# Reusable Utility Pattern

Recommended:

## JavaUtility.js

```js
export class JavaUtility {

static getRandomNumber(
max = 10000
) {

return Math.floor(
Math.random() * max
);

}

}
```

Usage:

```js
const lastName =
`${contactName}_${JavaUtility.getRandomNumber()}`;
```

Benefits:

✅ Reusable

✅ Cleaner code

✅ Framework consistency

---

# Dynamic Email Pattern

Correct:

```js
const email =
`test${Date.now()}@gmail.com`;
```

Example:

```txt
test1716519212231@gmail.com
```

Why:

Avoid duplicate email issue.

---

# Dynamic Phone Number Pattern

Correct:

```js
const phone =
`98765${Math.floor(
10000 + Math.random()*90000
)}`;
```

Example:

```txt
9876512384
```

---

# Dynamic Username Pattern

Correct:

```js
const username =
`user_${Date.now()}`;
```

Example:

```txt
user_1716519212231
```

---

# Wrong Dynamic Pattern

Wrong:

```js
Math.random();
```

without storing.

Problem:

❌ No reuse

❌ Poor readability

---

# Good vs Bad Example

## Good

```js
const lastName =
`${contactName}_${Math.floor(Math.random()*1000)}`;
```

Why good:

✅ Unique

✅ Readable

✅ Stable

---

## Bad

```js
const lastName =
"John";
```

Why bad:

❌ Duplicate issue

❌ Parallel conflict

❌ Unstable

---

# Common Dynamic Data Mistakes

## Mistake 1

Wrong:

```js
const email =
"test@gmail.com";
```

Problem:

Duplicate failure.

---

## Mistake 2

Wrong:

```js
const name =
Math.random();
```

Problem:

Unreadable data.

---

## Mistake 3

Wrong:

Generate dynamic data inside POM.

Problem:

Business logic misplaced.

Rule:

Dynamic data belongs in test layer.

---

# Dynamic Data Checklist

Before finalizing verify:

- Dynamic data added?
- Excel combined?
- No hardcoded value?
- Utility reusable?
- Parallel-safe?
- Readable generated data?

If YES → valid implementation.

---

# Final Goal

Dynamic data should provide:

- Unique execution
- Stable automation
- Parallel-safe tests
- Reusable framework pattern
- Enterprise-grade scalability

This document is the master dynamic data reference.
