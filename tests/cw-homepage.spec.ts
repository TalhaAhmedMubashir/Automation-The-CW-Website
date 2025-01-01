// tests/cw-homepage.spec.ts
import { test } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { CWHomepage543 } from '../src/pages/CWHomepage543';

test.describe('CW Homepage and Footer Tests', () => {
    let homePage: HomePage;
    let homepage543: CWHomepage543;

    test('TEST-543: Verify Homepage Elements and Footer Links', async ({ page }) => {
        homePage = new HomePage(page);
        homepage543 = new CWHomepage543(page);

        await page.pause()

        // Step 1: Navigate to the homepage and handle the banner
        await test.step('Navigate to the homepage and handle the banner', async () => {
            await homePage.visitHome();
        });

        // Step 2: Verify homepage elements
        await test.step('Verify homepage elements', async () => {
            await homepage543.verifyHomepageElements();
        });

        // Step 3: Navigate to "Inside the NFL" link and verify content
        await test.step('Navigate to "Inside the NFL" and verify content', async () => {
            await homepage543.navigateToInsideNFL();
        });

        // Step 4: Verify all footer links
        await test.step('Verify all footer links', async () => {
            await homepage543.verifyFooterLinks();
        });

        // Step 5: Verify "Do Not Sell or Share My Personal Information" link
        await test.step('Verify "Do Not Sell or Share My Personal Information" link', async () => {
            await homepage543.verifyDoNotSellLink();
        });


    });
});
