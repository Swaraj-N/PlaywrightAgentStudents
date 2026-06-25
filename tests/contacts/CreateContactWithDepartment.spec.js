// tests/contacts/CreateContact.spec.js
import { test, expect } from '../../baseFixture/fixture.js';
import { ContactsPage } from '../../pages/ContactsPage.js';
import { CreateContactPage } from '../../pages/CreateContactPage.js';
import { ExcelUtility } from '../../utility/ExcelUtility.js';

const EXCEL_FILE_PATH = 'testdata/testdata.xlsx';
const SHEET_NAME = 'contact'; 
const TEST_NAME = 'CreateContactWithDepartment';


 test.describe('create contact with mandatory details and department ', () => {

test('create contact with mandatory details and department', async ({ page, homePage }) => {
  const contactsPage = new ContactsPage(page);
  const createContactPage = new CreateContactPage(page);


    // Read test data from Excel based on testID
    const testID = 't_02'; // testID from Excel file
    const name = "test_"
    const department = "IT";

    const lastName = `${name}_${Math.floor(Math.random() * 1000)}`;  

    console.log(`Running test with testID: ${testID}`);
    console.log(`Test Data: name=${name}, department=${department}`);
    await homePage.goToContacts();
    await contactsPage.clickCreateContact();

    // Use the new method that fills department
    await createContactPage.createContactWithDepartment(lastName, department);
    ExcelUtility.upsertRow(EXCEL_FILE_PATH,SHEET_NAME,[testID,TEST_NAME,lastName,department]);

  
});
});