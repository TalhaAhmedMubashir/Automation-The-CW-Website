// src/pages/CWHomepage543.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CWHomepage543 extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async visitHomepage() {
        await this.page.goto('https://cwtv.com');
        // await this.page.waitForLoadState('domcontentloaded', {timeout: 10000});
    }

    async verifyHomepageElements() {
        console.log('Verifying homepage elements...');
        await expect(this.page.locator('#nav-wrap div').filter({ hasText: 'The CW Series Movies CW' })).toBeVisible();
        await expect(this.page.locator('#swiper-pagination-wrapper div')).toBeVisible();
        await expect(this.page.locator('#cw-main-footer-1 div').filter({ hasText: 'The CW Series Movies CW' })).toBeVisible();
        await expect(this.page.locator('#cw-main-footer-1 div').filter({ hasText: 'Primetime Schedule Where to' })).toBeVisible();
        await expect(this.page.locator('#cw-main-footer-1 div').filter({ hasText: 'Closed Captioning' })).toBeVisible();
        await expect(this.page.locator('#cw-main-footer-1 div').filter({ hasText: 'About The CW Nexstar Media' })).toBeVisible();
        console.log('Homepage elements verified successfully.');
    }

    async navigateToInsideNFL() {
        console.log('Clicking "Inside the NFL" link...');
        await this.page.getByLabel('See It First on The CW').getByRole('link', { name: 'Inside the NFL' }).click();
        await expect(this.page.getByText('New Episodes Stream Thursdays')).toBeVisible();
        await expect(this.page.getByText('By using this site, you agree')).toBeVisible();
        console.log('"Inside the NFL" content verified successfully.');
    }

    async verifyFooterLinks() {
        const footerLinks = [
            'Series',
            'Movies',
            'CW Sports',
            'Channels',
            'Support',
            'Primetime Schedule',
            'Where to Stream',
            'Find Your Channel',
            'Closed Captioning',
            'Accessibility',
            'Ad Choices',
            'Ratings Guidelines',
            'About The CW',
            'Nexstar Media Group, Inc.',
            'Careers at Nexstar',
            'Sitemap',
            'Privacy Policy New',
        ];

        for (const linkText of footerLinks) {
            console.log(`Interacting with the footer link: "${linkText}"...`);
            await this.visitHomepage();
            const link = this.page.getByRole('link', { name: linkText, exact: true });
            await expect(link).toBeVisible({ timeout: 5000 });
            await link.click();
            await this.page.waitForLoadState('domcontentloaded');
            console.log(`Clicked "${linkText}" and navigated to: ${this.page.url()}`);
        }

        console.log('All footer links interacted with successfully.');
    }

    async verifyDoNotSellLink() {
        console.log('Verifying "Do Not Sell or Share My Personal Information"...');
        await this.visitHomepage();
        await this.page.locator('#cw-main-footer-1').getByText('Do Not Sell or Share My').click();
        await expect(this.page.getByRole('button', { name: 'Confirm My Choice' })).toBeVisible();
        console.log('"Do Not Sell or Share My Personal Information" verified successfully.');
    }

    async verifyBannerLink(linkText: string, expectedTextOnTargetPage: string) {
        console.log(`Verifying "${linkText}" link...`);
        
        // Click on the link by its text
        await this.page.locator(`text=${linkText}`).click();
    
        // Verify if expected content (e.g., button, text) is visible on the target page
        await expect(this.page.locator(`text=${expectedTextOnTargetPage}`)).toBeVisible();
    
        console.log(`"${linkText}" link verified successfully.`);
      }
    
      // Method to verify the "Privacy Policy" link
      async verifyPrivacyPolicyLink() {
        await this.verifyBannerLink('Privacy Policy', 'Privacy Policy');
      }
    
}
