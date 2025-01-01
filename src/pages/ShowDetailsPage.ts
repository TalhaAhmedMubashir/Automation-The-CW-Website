import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ShowDetailsPage extends BasePage {
    readonly search: Locator;
    readonly searchInput: Locator;
    readonly insideNFLLink: Locator;
    readonly fullEpisodesTab: Locator;
    readonly extrasTab: Locator;
    readonly aboutTab: Locator;
    readonly playerTopImage: Locator;
    readonly videoThumbnails: Locator;
    readonly playButton: Locator;

    constructor(page: Page) {
        super(page);
        this.search = page.getByPlaceholder('Search', { exact: true });
        this.searchInput = page.getByPlaceholder('Search for a series or movie');
        this.insideNFLLink = page.getByRole('link', { name: 'Inside the NFL Go to Series' });
        this.fullEpisodesTab = page.getByRole('tab', { name: 'Full Episodes' });
        this.extrasTab = page.getByRole('tab', { name: 'Extras' });
        this.aboutTab = page.getByRole('tab', { name: 'About' });
        this.playerTopImage = page.locator('#playertop').getByRole('img');
        this.videoThumbnails = page.locator('#video-thumbs-container ul.touchcarousel-container li');
        this.playButton = page.getByRole('button', { name: '' });
    }

    async searchAndNavigateToShow(showName: string) {
        await this.search.click();
        await this.searchInput.fill(showName);
        await this.page.keyboard.press('Enter');
        await this.insideNFLLink.click();
    }

    async verifyTabs() {
        for (const tab of [this.fullEpisodesTab, this.extrasTab, this.aboutTab, this.fullEpisodesTab]) {
            await expect(tab).toBeVisible();
            await tab.click();
            await expect(tab).toHaveAttribute('aria-selected', 'true');
            const tabText = await tab.textContent();
            console.log(`Tab ${tabText} verified and clicked`);
        }
    }

    async verifyEpisodeDetails() {
        const detailsToVerify = [
            { selector: 'li#recentvid_1_0 img', label: 'Episode Thumbnail Found' },
            { selector: 'li#recentvid_1_0 p.eptitle', label: 'Episode Title' },
            { selector: 'li#recentvid_1_0 p.videoinfo', label: 'Season/Episode #' },
            { selector: 'li#recentvid_1_0 p.videoinfo', label: 'Duration' },
            { selector: 'li#recentvid_1_0 p.videoinfo', label: 'Air Date' },
            { selector: 'li#recentvid_1_0 p.videoinfo', label: 'Rating' },
            { selector: '#details_container p.desc', label: 'Episode Summary' }
        ];
    
        for (const detail of detailsToVerify) {
            const element = this.page.locator(detail.selector);
            try {
                await expect(element).toBeVisible({ timeout: 5000 });
                const text = await element.textContent();
                console.log(`${detail.label}: ${text?.trim()}`);
            } catch (error) {
                console.error(`${detail.label} not found or not visible:`, error);
                throw new Error(`Test failed: ${detail.label} not found or not visible`);
            }
        }
    }

    async selectAndPlayEpisode(index: number = 1) {
        // Click the Full Episodes tab
        await this.fullEpisodesTab.click();
    
        // Select the specified episode thumbnail
        const thumbnail = this.videoThumbnails.nth(index);
        await expect(thumbnail).toBeVisible();
        await thumbnail.click();
        console.log(`Selected episode ${index + 1}`);
    
        // Wait for the player container to be visible
        const playerContainer = this.page.locator('#player_container');
        await expect(playerContainer).toBeVisible({ timeout: 300000 }); // 5-minute timeout
    
    // Click the button using getByRole with name ''
    const playButton = this.page.getByRole('button', { name: '' });
    try {
        await expect(playButton).toBeVisible({ timeout: 300000 }); // 5-minute timeout
        await playButton.click();
        console.log('Interaction with the video bar successful');
    } catch (error) {
        console.error('Play button not found or not clickable:', error);
        throw new Error('Test failed: Play button not found or not clickable');
    }
}
}