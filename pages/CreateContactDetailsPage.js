// pages/CreateContactPage.js
export class CreateContactDetailsPage {
  constructor(page) {
    this.page = page;
  }

    async conatct_LastName_Element() {
   const data =   await this.page.locator("//span[@class='dvHeaderText']");
    console.log("data===>"+data)
    return data
  }

}