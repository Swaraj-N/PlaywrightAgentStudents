// pages/CampaignsPage.js
export class CampaignsPage {
  constructor(page) {
    this.page = page;
  }

  async clickCreateCampaign() {
    await this.page.locator("//img[@title='Create Campaign...']").click();
    
  }
}