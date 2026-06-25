// pages/ContactsPage.js
export class ContactsPage {
  constructor(page) {
    this.page = page;
  }

  async clickCreateContact() {
    await this.page.locator("//img[@title='Create Contact...']").click();
  }
}