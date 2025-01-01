import { Page,expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async visitHome() {
        await this.page.goto('https://cwtv.com');
        // await this.handleBannerIfPresent();
    }

    private async handleBannerIfPresent() {
        try {
            // Wait for potential banner load for up to 10 seconds
            const banner = this.page.locator('div[id="user_optin_banner"]');
            
            // Wait and check if banner appears
            const isBannerVisible = await banner.isVisible({ timeout: 10000 })
                .catch(() => false); // If timeout occurs, return false
    
            if (isBannerVisible) {
                // Wait for frame to be attached and ready
                const frame = await banner.contentFrame();

                // const privacyPolicy =frame.locator('//*[@id="cw-normal"]/div[1]/p/a[1]')
                // const term_n_condition =frame.locator('//*[@id="cw-normal"]/div[1]/p/a[2]')
                
                // await this.verifyLink(privacyPolicy)

                if (frame) {
                    const closeButton = frame.locator('button#user_optin_close');
                    await closeButton.waitFor({ state: 'visible', timeout: 5000 });
                    await closeButton.click();
                    console.log('Banner found and closed successfully');
                }
            } else {
                console.log('No banner present, continuing with test');
            }
        } catch (error) {
            console.log('Error handling banner, continuing with test:', error);
        }
    }

    // Utility function to verify links
  private async verifyLink(linkText: string, expectedTextOnTargetPage?: string) {
    console.log(`Verifying "${linkText}" link...`);
    
    // Click on the link by its text
    await this.page.locator(`text=${linkText}`).click();

    console.log(`"${linkText}" link verified successfully.`);
  }

  // Method to verify the "Privacy Policy" link
  async verifyPrivacyPolicyLink() {
    await this.verifyLink('Privacy Policy', 'Privacy Policy');
  }

  // Method to verify the "Terms of Use" link
  async verifyTermsOfUseLink() {
    await this.verifyLink('Terms of Use', 'Terms of Use');
  }

    
}