// pages/CreateContactPage.js
export class CreateContactPage {

  constructor(page) {
    this.page = page;
    this.saveBtn = page.locator("(//input[@title='Save [Alt+S]'])[1]");
    this.latnameEdt = page.locator("input[name='lastname']");
    this.orglookUP = page.locator("//*[normalize-space(.)='Organization Name']/..//img");

  }


  /**
   *  create conatct with lastname mandate feild
   * @param {*} latnameEdt 
   */
  async createContact(lastName) {
    await this.latnameEdt.fill(lastName);
    await this.saveBtn.click();
  }


/**
 * Create Conatct with organization record
 * @param {*} latnameEdt 
 * @param {*} orgName 
 */
  async createContactwithOrgnazationLookUp(lastName, orgName) {
      await this.latnameEdt.fill(lastName);

    // Click Organization lookup and wait for new page (popup)
    const [popup] = await Promise.all([
        this.page.context().waitForEvent('page'),
        await this.orglookUP.click()
    ]);

    // Wait for popup to load
    await popup.waitForLoadState();

    // Search organization in popup
    await popup.locator("#search_txt").fill(orgName);
    await popup.locator("input[name='search']").click();

    // Click organization name dynamically
    await popup.locator(`//a[text()='${orgName}']`).click();

    // Bring focus back to parent page
    await this.page.bringToFront();

    // Save the contact
    await this.saveBtn.click();
  }

/**
 * Create conatct with Department
 * @param {*} latnameEdt 
 * @param {*} department 
 */
  async createContactWithDepartment(lastName, department) {
      await this.latnameEdt.fill(lastName);
      
      // Try multiple selectors for department field
      const deptSelectors = [
        '#department1',
        '#department',
        "input[name='department']",
        "input[name='department1']",
        "input[id='department']"
      ];
      
      let deptFilled = false;
      for (const sel of deptSelectors) {
        try {
          const count = await this.page.locator(sel).count();
          if (count > 0) {
            await this.page.locator(sel).fill(department);
            deptFilled = true;
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
      
      if (!deptFilled) {
        console.warn('Department field not found with any selector');
      }
      
      await this.saveBtn.click();
  }

/**
 * Create conatct with FaxNumber
 * @param {*} latnameEdt 
 * @param {*} fax 
 */
  async createContactWithFax(lastName, fax) {
      await this.latnameEdt.fill(lastName);
    
    if (fax) {
      const faxSelectors = [
        "input[name='fax1']",
        "input[id='fax1']",
        "input[name='faxnumber1']",
        "input[name='faxnum1']",
        "input[name='fax_number1']",
      ];
      for (const sel of faxSelectors) {
        const count = await this.page.locator(sel).count();
        if (count > 0) {
          await this.page.locator(sel).fill(fax);
          break;
        }
      }
    }
    
    await this.saveBtn.click();
  }

/**
 * Create contact with Title
 * @param {*} lastName 
 * @param {*} title 
 */
  async createContactWithTitle(lastName, title) {
      await this.latnameEdt.fill(lastName);
    
    if (title) {
      const titleSelectors = [
        "input[name='title']",
        "input[id='title']",
        "textarea[name='title']",
        "input[name='jobtitle']",
        "input[name='job_title']",
      ];
      for (const sel of titleSelectors) {
        const count = await this.page.locator(sel).count();
        if (count > 0) {
          await this.page.locator(sel).fill(title);
          break;
        }
      }
    }
    
    await this.saveBtn.click();
  }

/**
 * Create contact with Mobile Number
 * @param {*} lastName 
 * @param {*} mobile 
 */
  async createContactWithMobile(lastName, mobile) {
      await this.latnameEdt.fill(lastName);
    
    if (mobile) {
      const mobileSelectors = [
        "input[name='mobilephone']",
        "input[id='mobilephone']",
        "input[name='mobile']",
        "input[id='mobile']",
        "input[name='mobile1']",
        "input[id='mobile1']",
        "input[name='mobilephone1']",
        "input[id='mobilephone1']",
      ];
      for (const sel of mobileSelectors) {
        const count = await this.page.locator(sel).count();
        if (count > 0) {
          await this.page.locator(sel).fill(mobile);
          break;
        }
      }
    }
    
    await this.saveBtn.click();
  }

/**
 * Create contact with Email
 * @param {*} lastName 
 * @param {*} email 
 */
  async createContactWithEmail(lastName, email) {
      await this.latnameEdt.fill(lastName);
    
    if (email) {
      const emailSelectors = [
        "input[name='emailaddress1']",
        "input[id='emailaddress1']",
        "input[name='email']",
        "input[id='email']",
        "input[name='emailaddress']",
        "input[id='emailaddress']",
        "input[name='email1']",
        "input[id='email1']",
      ];
      for (const sel of emailSelectors) {
        const count = await this.page.locator(sel).count();
        if (count > 0) {
          await this.page.locator(sel).fill(email);
          break;
        }
      }
    }
    
    await this.saveBtn.click();
  }
}