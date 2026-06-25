import ExcelJS from 'exceljs';

const fileName = 'Vtiger_Create_Contact_Test_Cases.xlsx';

const functional = [
  {
    id: 'TC-001',
    module: 'Create Contact',
    scenario: 'Create contact with mandatory fields',
    title: 'Create a new contact using mandatory fields',
    type: 'Positive',
    preconditions: 'User is authenticated and has contact create permission',
    steps: '1. Navigate to CRM Home → Contacts → Create New Contact\n2. Enter Last Name = Smith\n3. Select Assigned To = Sales User\n4. Click Save',
    data: 'Last Name: Smith\nAssigned To: Sales User',
    expected: 'Contact saves successfully, Contact ID auto-generated',
    priority: 'High',
    severity: 'Critical',
    reference: 'FR-01, VAL-01, FR-08, AC-01',
    status: 'Draft',
    author: 'Auto Generated',
  },
  {
    id: 'TC-002',
    module: 'Create Contact',
    scenario: 'Create contact with full optional details',
    title: 'Create contact with organization lookup, title, email, phone, and notify owner',
    type: 'Positive',
    preconditions: 'Authenticated user with creation rights',
    steps: '1. Open Create New Contact page\n2. Enter Last Name = Patel\n3. Enter First Name = Asha\n4. Enter Title = Business Analyst\n5. Select Organization Name via lookup\n6. Select Assigned To = Manager\n7. Enter Email = asha.patel@example.com\n8. Enter Mobile = 9876543210\n9. Check Notify Owner\n10. Click Save',
    data: 'Organization Name: Acme Corp\nEmail: asha.patel@example.com\nMobile: 9876543210\nNotify Owner: Checked',
    expected: 'Contact saves successfully and notify owner setting is saved',
    priority: 'Medium',
    severity: 'Major',
    reference: 'FR-01, FR-05, FR-07, FR-08, AC-01, AC-05',
    status: 'Draft',
    author: 'Auto Generated',
  },
  {
    id: 'TC-003',
    module: 'Create Contact',
    scenario: 'Reports To lookup',
    title: 'Select Reports To contact using lookup and save',
    type: 'Positive',
    preconditions: 'User authenticated and contact records exist for lookup',
    steps: '1. Open Create New Contact page\n2. Enter required Last Name and Assigned To\n3. Use Reports To lookup and select an existing contact\n4. Click Save',
    data: 'Reports To: Existing Contact',
    expected: 'Lookup selection works and contact saves successfully with Reports To relation',
    priority: 'Medium',
    severity: 'Major',
    reference: 'FR-06, AC-05',
    status: 'Draft',
    author: 'Auto Generated',
  },
  {
    id: 'TC-009',
    module: 'Create Contact',
    scenario: 'Cancel action discards data',
    title: 'Cancel contact creation and verify no record is saved',
    type: 'Positive',
    preconditions: 'User authenticated',
    steps: '1. Open Create New Contact page\n2. Enter Last Name, Assigned To, and other fields\n3. Click Cancel',
    data: 'Last Name: Patel\nAssigned To: Sales User',
    expected: 'User returns to previous page and contact is not saved',
    priority: 'Medium',
    severity: 'Major',
    reference: 'FR-10, AC-04',
    status: 'Draft',
    author: 'Auto Generated',
  },
];

const negative = [
  {
    id: 'TC-004',
    module: 'Create Contact',
    scenario: 'Last Name missing validation',
    title: 'Prevent save when Last Name is blank',
    type: 'Negative',
    preconditions: 'Authenticated user with create access',
    steps: '1. Open Create New Contact page\n2. Leave Last Name empty\n3. Select Assigned To\n4. Click Save',
    data: 'Last Name: (blank)',
    expected: 'Save is blocked and error shown: Last Name cannot be empty.',
    priority: 'High',
    severity: 'Critical',
    reference: 'VAL-01, FR-02, AC-02',
    status: 'Draft',
    author: 'Auto Generated',
  },
  {
    id: 'TC-005',
    module: 'Create Contact',
    scenario: 'Assigned To missing validation',
    title: 'Prevent save when Assigned To is not selected',
    type: 'Negative',
    preconditions: 'Authenticated user',
    steps: '1. Open Create New Contact page\n2. Enter Last Name = Kumar\n3. Leave Assigned To blank\n4. Click Save',
    data: 'Assigned To: (blank)',
    expected: 'Save is blocked and error shown: Please assign the contact to User or Group.',
    priority: 'High',
    severity: 'Critical',
    reference: 'VAL-05, FR-02, AC-02',
    status: 'Draft',
    author: 'Auto Generated',
  },
  {
    id: 'TC-006',
    module: 'Create Contact',
    scenario: 'Invalid email format',
    title: 'Validate email format before allowing save',
    type: 'Negative',
    preconditions: 'User is authenticated',
    steps: '1. Open Create New Contact page\n2. Enter Last Name and Assigned To\n3. Enter Email = nguyen[at]example\n4. Click Save',
    data: 'Email: nguyen[at]example',
    expected: 'Save is blocked and error shown: Please enter a valid email address.',
    priority: 'High',
    severity: 'Major',
    reference: 'VAL-02, FR-03, AC-02',
    status: 'Draft',
    author: 'Auto Generated',
  },
  {
    id: 'TC-007',
    module: 'Create Contact',
    scenario: 'Phone numeric validation',
    title: 'Prevent non-numeric characters in phone fields',
    type: 'Negative',
    preconditions: 'Authenticated user',
    steps: '1. Open Create New Contact page\n2. Enter Last Name and Assigned To\n3. Enter Mobile = 123-abc-4567\n4. Click Save',
    data: 'Mobile: 123-abc-4567',
    expected: 'Save is blocked and error shown: Please enter valid phone number.',
    priority: 'Medium',
    severity: 'Major',
    reference: 'VAL-03, FR-04, AC-02',
    status: 'Draft',
    author: 'Auto Generated',
  },
  {
    id: 'TC-008',
    module: 'Create Contact',
    scenario: 'Invalid birthdate format',
    title: 'Reject invalid or malformed birthdate values',
    type: 'Negative',
    preconditions: 'Authenticated user',
    steps: '1. Open Create New Contact page\n2. Enter required fields\n3. Enter Birthdate = 31/02/2025 or invalid format\n4. Click Save',
    data: 'Birthdate: 31/02/2025',
    expected: 'Save is blocked and invalid date error is shown.',
    priority: 'Medium',
    severity: 'Major',
    reference: 'VAL-04',
    status: 'Draft',
    author: 'Auto Generated',
  },
  {
    id: 'TC-010',
    module: 'Create Contact',
    scenario: 'Unauthorized access restriction',
    title: 'Verify user without create permission cannot open Create Contact page',
    type: 'Negative',
    preconditions: 'User authenticated without create permission',
    steps: '1. Attempt to navigate to CRM Home → Contacts → Create New Contact',
    data: 'User role: no create permission',
    expected: 'Access is denied and authorization error or no create option is displayed.',
    priority: 'High',
    severity: 'Critical',
    reference: 'FR-01, AC-01',
    status: 'Draft',
    author: 'Auto Generated',
  },
];

const edge = [
  {
    id: 'TC-011',
    module: 'Create Contact',
    scenario: 'Page load performance',
    title: 'Verify Create Contact page loads within 3 seconds',
    type: 'Edge / Non-functional',
    preconditions: 'User authenticated and system ready',
    steps: '1. Navigate to CRM Home → Contacts → Create New Contact',
    data: 'N/A',
    expected: 'Create Contact page loads in 3 seconds or less.',
    priority: 'Low',
    severity: 'Minor',
    reference: 'Non-Functional Requirements',
    status: 'Draft',
    author: 'Auto Generated',
  },
];

const traceability = [
  { requirement: 'FR-01', testCase: 'TC-001, TC-002', description: 'Create Contact functionality' },
  { requirement: 'FR-02', testCase: 'TC-004, TC-005', description: 'Mandatory validation for required fields' },
  { requirement: 'FR-03', testCase: 'TC-006', description: 'Email validation rule' },
  { requirement: 'FR-04', testCase: 'TC-007, TC-008', description: 'Phone and birthdate validation' },
  { requirement: 'FR-05', testCase: 'TC-002', description: 'Organization lookup handling' },
  { requirement: 'FR-06', testCase: 'TC-003', description: 'Reports To lookup' },
  { requirement: 'FR-07', testCase: 'TC-001, TC-002', description: 'Assigned To mandatory selection' },
  { requirement: 'FR-08', testCase: 'TC-001, TC-002', description: 'Auto-generated Contact ID' },
  { requirement: 'FR-09', testCase: 'TC-001, TC-002, TC-003', description: 'Save action' },
  { requirement: 'FR-10', testCase: 'TC-009', description: 'Cancel action' },
  { requirement: 'AC-01', testCase: 'TC-001, TC-010', description: 'Successful creation and authorization' },
  { requirement: 'AC-02', testCase: 'TC-004, TC-005, TC-006, TC-007', description: 'Mandatory and format validations' },
  { requirement: 'AC-04', testCase: 'TC-009', description: 'Cancel functionality' },
  { requirement: 'AC-05', testCase: 'TC-002, TC-003', description: 'Lookup field behavior' },
];

function addSheet(workbook, name, rows) {
  const sheet = workbook.addWorksheet(name);
  const header = [
    'Test Case ID',
    'Module',
    'Test Scenario',
    'Test Case Title',
    'Test Type',
    'Preconditions',
    'Test Steps',
    'Test Data',
    'Expected Result',
    'Priority',
    'Severity',
    'Requirement Reference',
    'Status',
    'Author',
  ];
  sheet.addRow(header);
  rows.forEach((item) => {
    sheet.addRow([
      item.id,
      item.module,
      item.scenario,
      item.title,
      item.type,
      item.preconditions,
      item.steps,
      item.data,
      item.expected,
      item.priority,
      item.severity,
      item.reference,
      item.status,
      item.author,
    ]);
  });
  sheet.columns.forEach((col) => {
    col.width = 18;
    col.alignment = { wrapText: true, vertical: 'top' };
  });
  sheet.getRow(1).font = { bold: true };
}

function addTraceabilitySheet(workbook, rows) {
  const sheet = workbook.addWorksheet('Traceability Matrix');
  sheet.addRow(['Requirement Reference', 'Test Case(s)', 'Description']);
  rows.forEach((item) => sheet.addRow([item.requirement, item.testCase, item.description]));
  sheet.columns.forEach((col) => {
    col.width = 25;
    col.alignment = { wrapText: true, vertical: 'top' };
  });
  sheet.getRow(1).font = { bold: true };
}

async function createWorkbook() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Auto Generated';
  workbook.created = new Date();
  addSheet(workbook, 'Functional Test Cases', functional);
  addSheet(workbook, 'Negative Test Cases', negative);
  addSheet(workbook, 'Edge Cases', edge);
  addTraceabilitySheet(workbook, traceability);
  await workbook.xlsx.writeFile(fileName);
  console.log(`Created ${fileName}`);
}

createWorkbook().catch((error) => {
  console.error(error);
  process.exit(1);
});
