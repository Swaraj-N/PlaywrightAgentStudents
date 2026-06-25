import dotenv from 'dotenv';
import path from 'path';

import { test as base, expect } from '@playwright/test';

import { LoginPage } from '../pages/Loginpage.js';
import { HomePage } from '../pages/HomePage.js';

dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});

const test = base.extend({
page: async ({ page }, use) => {
    await use(page);
  },
  loginPage: async ({ page }, use) => {
    console.log("=== Base extend Loginpage ===");
 
    await use(new LoginPage(page));
  },

  homePage: async ({ page }, use) => {
    console.log("=== Base extend Homepage ===");

    await use(new HomePage(page));
  },

  forEachTest: [async ({baseURL, page, loginPage, homePage }, use) => {
    // This code runs before every test.
    console.log("=== BEFORE EACH STARTED ===");
    await page.goto(baseURL);
    await loginPage.login(
    process.env.APP_USERNAME,
    process.env.APP_PASSWORD
  );
    await use();
    // This code runs after every test.
    await homePage.logout();
  }, { auto: true }],

}, { auto: true });


export { test, expect };