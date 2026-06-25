// tests/contacts/CreateContactWithFax.spec.js
import { test, expect } from '../../baseFixture/fixture.js';
import { ContactsPage } from '../../pages/ContactsPage.js';
import { CreateContactPage } from '../../pages/CreateContactPage.js';
import { ExcelUtility } from '../../utility/ExcelUtility.js';

const EXCEL_FILE_PATH = 'testdata/testdata.xlsx';
const SHEET_NAME = 'contact'; 
const TEST_NAME = 'CreateContactWithFaxNumber';


test.describe('create contact with fax', () => {
  test('create contact with fax number', async ({ page, homePage }) => {
    const contactsPage = new ContactsPage(page);
    const createContactPage = new CreateContactPage(page);

  
      // Read test data from Excel
      const testID = "tc_03";
      const name = "test_lastname"
      const lastName = `${name}_${Math.floor(Math.random() * 1000)}`;
      const fax = '+1-555-123-4567'; // Example fax number

      console.log(`Creating contact with lastName: ${lastName}, fax: ${fax}`);

      await homePage.goToContacts();
      await contactsPage.clickCreateContact();
      await createContactPage.createContactWithFax(lastName, fax);

      // Verify contact was created
      expect(page).toBeTruthy();
      ExcelUtility.upsertRow(EXCEL_FILE_PATH,SHEET_NAME,[testID,TEST_NAME,lastName,fax]);
    
  });

 
});
