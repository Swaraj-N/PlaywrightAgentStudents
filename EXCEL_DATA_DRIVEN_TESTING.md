# Excel Data-Driven Testing Guide

## Overview
This document explains how the test framework now reads test data from Excel files (`testdata.xlsx`) instead of using hardcoded values.

## Components Created

### 1. Excel Utility (`utility/excelUtility.js`)
A comprehensive utility class for reading and retrieving data from Excel files.

**Key Methods:**

```javascript
// Read all data from a sheet
ExcelUtility.getAllData(filePath, sheetName)

// Get a complete row by testID
ExcelUtility.getDataByTestID(filePath, testID, sheetName)

// Get a specific column value by testID
ExcelUtility.getColumnDataByTestID(filePath, testID, columnName, sheetName)

// Get multiple column values by testID
ExcelUtility.getMultipleColumnDataByTestID(filePath, testID, columnNames, sheetName)

// Get sheet names from Excel file
ExcelUtility.getSheetNames(filePath)

// Read raw Excel data
ExcelUtility.readExcel(filePath, sheetName)
```

### 2. Sample Data Generator (`utility/createSampleTestData.js`)
Generates sample test data Excel file with proper structure.

**Usage:**
```bash
npm run generate:testdata
```

### 3. Excel Inspector (`utility/inspectExcel.js`)
Helper utility to inspect and debug Excel file structure.

## Modified Test Files

### CreateContact.spec.js
Now reads contact data from Excel file based on `testID` and uses the `contactName` column.

**Example:**
```javascript
const testID = 't_01'; // From Excel file
const testData = ExcelUtility.getDataByTestID(EXCEL_FILE_PATH, testID, SHEET_NAME);
const lastName = testData.contactName;
```

### CreateContactwithNum.spec.js
Reads contact data and mobile number from Excel file.

**Example:**
```javascript
const testData = ExcelUtility.getDataByTestID(EXCEL_FILE_PATH, testID, SHEET_NAME);
const lastName = testData.contactName;
const mobileNumber = testData.__EMPTY; // Mobile number from Excel
```

## Excel File Structure

**File Location:** `testdata/testdata.xlsx`

**Sheet Name:** `contact`

**Required Columns:**
- `testID`: Unique test identifier (e.g., 't_01')
- `testName`: Test description (e.g., 'CreateContact')
- `contactName`: Contact's name (e.g., 'deepak')
- Additional columns for specific test data

**Example Data:**
```
| testID | testName                | contactName | __EMPTY    |
|--------|------------------------|-------------|-----------|
| t_01   | CreateContact          | deepak      |           |
| t_01   | CreateContactwithNum   | deepak      | 9887776654|
```

## How to Use

### 1. Prepare Your Excel File
Create or update `testdata/testdata.xlsx` with:
- Sheet name: `contact`
- Required columns: testID, testName, contactName
- Add additional columns as needed for your tests

### 2. Update Tests
Modify your test files to:
1. Import ExcelUtility
2. Define Excel file path and sheet name
3. Use `ExcelUtility.getDataByTestID()` to retrieve test data
4. Use the retrieved data in your test

**Example:**
```javascript
import { ExcelUtility } from '../../utility/excelUtility.js';

const EXCEL_FILE_PATH = 'testdata/testdata.xlsx';
const SHEET_NAME = 'contact';

test('my test', async ({ page, homePage }) => {
  const testData = ExcelUtility.getDataByTestID(EXCEL_FILE_PATH, 't_01', SHEET_NAME);
  const contactName = testData.contactName;
  
  // Use contactName in your test...
});
```

### 3. Run Tests
```bash
# Run all contact tests
npm run test:contacts

# Run specific test
npm run test:createContact
npm run test:createContactwithNum

# Run all tests
npm test

# Run with UI
npm run test:ui
```

## Available NPM Scripts

```bash
npm run test                    # Run all tests
npm run test:enhanced           # Run enhanced contact tests
npm run test:createContact      # Run CreateContact tests
npm run test:createContactwithNum # Run CreateContactwithNum tests
npm run test:contacts           # Run all contact tests
npm run test:ui                 # Run tests in UI mode
npm run generate:testdata       # Generate sample test data
```

## Error Handling

The ExcelUtility provides helpful error messages:

```
Error: Sheet "contact" not found in workbook. Available sheets: Sheet1, Sheet2
Error: No data found for testID: invalid_id
Error: Column "mobileNumber" not found. Available columns: testID, testName, contactName
```

## Benefits of Data-Driven Testing

1. **Maintainability**: Update test data without modifying code
2. **Reusability**: Use same test with multiple data sets
3. **Scalability**: Easily add more test cases
4. **Flexibility**: Separate data from test logic
5. **Collaboration**: Non-technical team members can update test data

## Troubleshooting

### Test Data Not Found
- Verify the testID exists in your Excel file
- Check the sheet name matches (case-sensitive)
- Ensure column names are correct

### Excel File Not Found
- Verify file path is correct: `testdata/testdata.xlsx`
- Check file exists in the workspace

### Missing Column Values
- Some columns might be empty - use `|| fallbackValue` to provide defaults
- Check Excel file formatting and cell values

## Advanced Usage

### Get Multiple Columns
```javascript
const data = ExcelUtility.getMultipleColumnDataByTestID(
  EXCEL_FILE_PATH, 
  'T_001', 
  ['firstName', 'lastName', 'email'],
  SHEET_NAME
);
console.log(data); // { firstName: 'John', lastName: 'Doe', email: '...' }
```

### Get All Sheet Data
```javascript
const allData = ExcelUtility.getAllData(EXCEL_FILE_PATH, SHEET_NAME);
allData.forEach(row => {
  console.log(row.testID, row.testName);
});
```

### Dynamically Get Sheet Names
```javascript
const sheets = ExcelUtility.getSheetNames(EXCEL_FILE_PATH);
console.log(sheets); // ['contact', 'organization', ...]
```
