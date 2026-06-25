// Inlcude playwright module
import { expect } from '@playwright/test';

// create class
export class LoginPage {

    /**
     * @param {import ('@playwright/test').Page} page 
     */
    constructor (page) {
        this.page = page;

    }

    // async goto() {
        // await this.page.setViewportSize({ width: 1366, height: 728 })
        
        // await this.page.goto('/'); // uses baseURL from config
    // }

    async login(username, password) { 
        await this.page.locator("//input[@name='user_name']").fill(username); 
        await this.page.locator("//input[@name='user_password']").fill(password);
        await this.page.locator("#submitButton").click();
    }
}