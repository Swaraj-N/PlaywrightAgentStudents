// pages/HomePage.js
export class HomePage {
  constructor(page) {
    this.page = page;
  }

  async goToContacts() {
    await this.page.locator("//a[text()='Contacts']").click();
  }

   async goToOrganization() {
    await this.page.locator("//a[text()='Organizations']").click();
  }
  
  async goToCampaigns() {
    await this.page.locator("//a[text()='Campaigns']").click();
  }

  async logout() {
    
    await this.page.locator("//img[@src='themes/softed/images/user.PNG']").hover();
    await this.page.locator('text=Sign Out').click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await this.page.close();
  }
}