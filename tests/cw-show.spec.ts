import { test } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { ShowDetailsPage } from '../src/pages/ShowDetailsPage';
import { CWHomepage543 } from '@pages/CWHomepage543';

test.describe('CW Show Tests', () => {
    let homePage: HomePage;
    let showDetailsPage: ShowDetailsPage;

    test('TEST-544: Show Details Page Test', async ({ page }) => {
        homePage = new HomePage(page);
        showDetailsPage = new ShowDetailsPage(page);

        await test.step('Navigate to CW Homepage', async () => {
            await homePage.visitHome();
        });

        await test.step('Search and Navigate to Inside the NFL', async () => {
            await showDetailsPage.searchAndNavigateToShow('inside the nfl');
        });

        await test.step('Verify Show Details Page Elements', async () => {
            await showDetailsPage.verifyTabs();
            await showDetailsPage.verifyEpisodeDetails();
        });

        await test.step('Test Video Playback', async () => {
            await showDetailsPage.selectAndPlayEpisode();
        });

        await test.step('Test Video Playback', async () => {
            await showDetailsPage.selectAndPlayEpisode();
        });

        // await test.step('On Banner Make sure the hyperlinks are functional Privacy Policy and Terns of Use', async ()=>
        // {
        //     await CWHomepage543.verifyBannerLink()
        // });
        
    });
});