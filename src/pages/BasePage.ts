import { Page, Locator } from '@playwright/test';

export class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to a specific URL path
     * @param path - The URL path to navigate to
     */
    async goto(path: string) {
        await this.page.goto(path);
    }

    /**
     * Wait for page load state
     */
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Get text content from a locator
     * @param locator - The element locator
     */
    async getTextContent(locator: Locator): Promise<string | null> {
        return await locator.textContent();
    }

    /**
     * Check if element is visible
     * @param locator - The element locator
     */
    async isVisible(locator: Locator): Promise<boolean> {
        return await locator.isVisible();
    }
}