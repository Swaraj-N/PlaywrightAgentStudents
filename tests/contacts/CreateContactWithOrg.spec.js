// tests/contacts/CreateContact.spec.js
import { test, expect } from '../../baseFixture/fixture.js';
import { ContactsPage } from '../../pages/ContactsPage.js';
import { CreateContactPage } from '../../pages/CreateContactPage.js';
import { CreateContactDetailsPage } from '../../pages/CreateContactDetailsPage.js';
import { ExcelUtility } from '../../utility/ExcelUtility.js';

// Sheet name in the Excel file
const EXCEL_FILE_PATH = 'testdata/testdata.xlsx';
const SHEET_NAME = 'contact'; 
const TEST_NAME = 'CreateContact';

 //test : create conatct with mandate details 
test.describe('create contact with mandatory details ',  () => {

test('create contact with mandatory details ', async ({ page, homePage }) => {
  const contactsPage = new ContactsPage(page);
  const createContactPage = new CreateContactPage(page);
    const createContactDetailsPage = new CreateContactDetailsPage(page);


    // Read test data from Excel based on testID
    const testID = 't_04'; // testID from Excel file
    const name = "testlastname_";
    const orgName = "sprider20123";


    
    // add synthatic data data contactname 
    const lastName = `${name}_${Math.floor(Math.random() * 1000)}`;  

    // Go to contact page 
    await homePage.goToContacts();
        
    // Go to create contact page 
    await contactsPage.clickCreateContact();

    //create a new conatct with 
    await createContactPage.createContactwithOrgnazationLookUp(lastName, orgName);

    // Verify contact name and successfull message
    const contactLastNameElement = await createContactDetailsPage.conatct_LastName_Element();
    const data = await contactLastNameElement.innerText();
    console.log("==========>"+data)
    await expect(data).toContain(lastName);

     //optional page validation
    await expect(page).toHaveURL(/Contacts/);
        ExcelUtility.upsertRow(EXCEL_FILE_PATH,SHEET_NAME,[testID,TEST_NAME,lastName,orgName]);
    
 
});
 });