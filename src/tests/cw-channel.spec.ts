import {  expect, test } from '@playwright/test';

test.describe('CW Show Tests', () => {

test('TEST-633: CW channel', async ({ page }) => {
        await page.goto('https://www.cwtv.com/channels/')
        await page.waitForLoadState()
        // await page.waitForTimeout(10000)
        //Go to Channels section
                const channel = await page.getByRole('menuitem', { name: 'Channels' })
                await expect(channel).toBeVisible()
                await channel.click()
                await page.waitForLoadState()
        //Verify that the user is taken to the FAST Channels page
                const channelPage = page.url()
                expect(channelPage).toContain('https://www.cwtv.com/channels/')
        //The first channel listed should be automatically selected
                const firstChannel = await page.locator('#channelsContainer div').first();
                expect(firstChannel).toBeVisible()
        // Channel logo/art 
                const channelLogo = page.locator('#showcase-channel-icon')
                expect(channelLogo).toBeVisible()
        // Channel Name
                const channleName = page.locator('#showcase-info #showcase-title')
                expect(channleName).toBeVisible()
        //  - Duration remaining
                const channelPageDuration = page.locator('#showcase-metadata span[class="time_left"]')
                expect(channelPageDuration).toBeVisible()
        // Synopsis
                const channelSynopsis = page.locator('#showcase-info #showcase-description')
                expect(channelSynopsis).toBeVisible()

        // Verify under the synopsis you see the current time and the current progression of the currently selected show
            const synopsisCurrentTime = page.locator('#current-time-container #current-time')
            console.log(synopsisCurrentTime)

            const currentProgression = page.locator('.time-block div').first()
            expect(currentProgression).toBeVisible()

        // scroll to bottom and scroll to top
            // Scroll to the bottom of the page using page.evaluate
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
            console.log("Scrolled to the bottom");
            // Wait for a while to see the bottom
            await page.waitForTimeout(1000);
            // Scroll back to the top of the page
            await page.evaluate(() => {
                    window.scrollTo(0, 0);
            });
            console.log("Scrolled back to the top");

        //Verify that the user can only go forward 12hrs and can't go backwards
            const farward12Hours = page.locator('#time-schedule-container li')
            const count= await farward12Hours.count()
            if (count === 10) {
                console.log('There are 10 items as expected.');
              } else {
                console.log(`Expected 10 items, but found ${count} items.`);
                throw new Error('Locator does not return exactly 10 items.');
              }

        // scroll down and select last channle
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });

        // Wait for the page to load (adjust the timeout as needed)
        await page.waitForTimeout(1000); 

        // Define the locator for the element with the class .channel-name.last
        const channelLocator = page.locator('.channel-name').last();

        // Ensure the element is visible
        const isVisible = await channelLocator.isVisible();

        if (isVisible) {
            console.log("Element is visible, clicking now...");
            // Click the element
            await channelLocator.click();
        } else {
            console.log("Element is not visible.");
        }

// fid yuor channle and search with zip code
    const findyChannel = page.getByRole('link', { name: 'Find Your Channel' })
    await findyChannel.click()
    await page.waitForLoadState()

    // type zip code
    const zipCode = page.locator('iframe[name="stations-frame"]').contentFrame().getByPlaceholder('ex.')
    await zipCode.fill('90210')
    await page.keyboard.press('Enter');

    // verify result through headings

    const overAir = page.locator('iframe[name="stations-frame"]').contentFrame().getByRole('heading', { name: 'Over the Air' })
    await expect(overAir).toBeVisible()

    const service = page.locator('iframe[name="stations-frame"]').contentFrame().getByRole('heading', { name: 'Service Providers' });
    await expect(service).toBeVisible()

//Select a channel at a future time and verify that an overlay appears with a "Back to Channel Guide"
    const futureTimeChannel = page.locator('li.channel-program[tabindex="0"]').last()
    // await expect(futureTimeChannel).toBeVisible()
    await futureTimeChannel.click()

    const backToguide = page.locator('#return-to-guide')
    await page.waitForTimeout(1000)
    await expect.soft(backToguide).toBeVisible()
    console.log('back to guide eclick')
    await backToguide.click()



    })


});