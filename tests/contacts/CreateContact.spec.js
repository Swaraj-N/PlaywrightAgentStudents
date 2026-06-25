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

    //prepare synatatic test data only for name 
    const testID = 't_01'; // testID from Excel file
    const name = 'test_'
    
    // add synthatic data data contactname 
    console.log("====>"+name)
    const lastName = `${name}_${Math.floor(Math.random() * 1000)}`;  
    

    // Go to contact page 
    await homePage.goToContacts();
        
    // Go to create contact page 
    await contactsPage.clickCreateContact();

    //create a new conatct with 
    await createContactPage.createContact(lastName);

    // Verify contact name and successfull message
    const contactLastNameElement = await createContactDetailsPage.conatct_LastName_Element();
    const data = await contactLastNameElement.innerText();
    console.log("==========>"+data)
    await expect(data).toContain(lastName);

     //optional page validation
    await expect(page).toHaveURL(/Contacts/);

    ExcelUtility.upsertRow(EXCEL_FILE_PATH,SHEET_NAME,[testID,TEST_NAME,lastName]);
 
});

//test : create contact with mobile field
test('create contact with mobile field', async ({ page, homePage }) => {
  const contactsPage = new ContactsPage(page);
  const createContactPage = new CreateContactPage(page);
  const createContactDetailsPage = new CreateContactDetailsPage(page);

    //prepare test data
    const testID = 'tc_05'; // testID from Excel file
    const name = 'test_'
    const mobile = '9876543210';
    
    // add synthetic data for contact name
    console.log("====>"+name)
    const lastName = `${name}_${Math.floor(Math.random() * 1000)}`;  
    

    // Go to contact page
    await homePage.goToContacts();
        
    // Go to create contact page
    await contactsPage.clickCreateContact();

    //create a new contact with mobile number
    await createContactPage.createContactWithMobile(lastName, mobile);

    // Verify contact name and successful message
    const contactLastNameElement = await createContactDetailsPage.conatct_LastName_Element();
    const data = await contactLastNameElement.innerText();
    console.log("==========>"+data)
    await expect(data).toContain(lastName);

     //optional page validation
    await expect(page).toHaveURL(/Contacts/);

    ExcelUtility.upsertRow(EXCEL_FILE_PATH,SHEET_NAME,[testID,TEST_NAME+'_Mobile',lastName]);
 
});

//test : create contact with mobile number text field
test('create contact with mobile number text field', async ({ page, homePage }) => {
  const contactsPage = new ContactsPage(page);
  const createContactPage = new CreateContactPage(page);
  const createContactDetailsPage = new CreateContactDetailsPage(page);

    //prepare test data
    const testID = 'tc_06'; // testID from Excel file
    const name = 'test_'
    const mobile = '9876543210';
    
    // add synthetic data for contact name
    console.log("====>"+name)
    const lastName = `${name}_${Math.floor(Math.random() * 1000)}`;  
    

    // Go to contact page
    await homePage.goToContacts();
        
    // Go to create contact page
    await contactsPage.clickCreateContact();

    //create a new contact with mobile number
    await createContactPage.createContactWithMobile(lastName, mobile);

    // Verify contact name and successful message
    const contactLastNameElement = await createContactDetailsPage.conatct_LastName_Element();
    const data = await contactLastNameElement.innerText();
    console.log("==========>"+data)
    await expect(data).toContain(lastName);

     //optional page validation
    await expect(page).toHaveURL(/Contacts/);

    ExcelUtility.upsertRow(EXCEL_FILE_PATH,SHEET_NAME,[testID,TEST_NAME+'_MobileField',lastName]);
 
});

//test : create contact with email id field
test('create contact with email id field', async ({ page, homePage }) => {
  const contactsPage = new ContactsPage(page);
  const createContactPage = new CreateContactPage(page);
  const createContactDetailsPage = new CreateContactDetailsPage(page);

    //prepare test data
    const testID = 'tc_07'; // testID from Excel file
    const name = 'test_'
    const email = 'test@example.com';
    
    // add synthetic data for contact name
    console.log("====>"+name)
    const lastName = `${name}_${Math.floor(Math.random() * 1000)}`;  
    

    // Go to contact page
    await homePage.goToContacts();
        
    // Go to create contact page
    await contactsPage.clickCreateContact();

    //create a new contact with email
    await createContactPage.createContactWithEmail(lastName, email);

    // Verify contact name and successful message
    const contactLastNameElement = await createContactDetailsPage.conatct_LastName_Element();
    const data = await contactLastNameElement.innerText();
    console.log("==========>"+data)
    await expect(data).toContain(lastName);

     //optional page validation
    await expect(page).toHaveURL(/Contacts/);

    ExcelUtility.upsertRow(EXCEL_FILE_PATH,SHEET_NAME,[testID,TEST_NAME+'_Email',lastName]);
 
});
 });