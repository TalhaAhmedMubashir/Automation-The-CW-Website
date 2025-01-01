import { expect, test } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { ShowDetailsPage } from '../src/pages/ShowDetailsPage';
import { VideoPlayer } from '../src/pages/Videoplayer';



test.describe('CW Show Tests', () => {
    let homePage: HomePage;
    let showDetailsPage: ShowDetailsPage;
    let videoplayer: VideoPlayer;

    test('TEST-543: CW Video Player', async ({ page }) => {
        homePage = new HomePage(page);
        showDetailsPage = new ShowDetailsPage(page);


        // Step 1: Navigate to the homepage and handle the banner
        await test.step('Navigate to the homepage and handle the banner', async () => {
            //    await homePage.visitHome();
            await page.goto('https://cwtv.com')
            await page.waitForLoadState('domcontentloaded', { timeout: 10000 });

        });

        // Step 4: Navigate to the homepage and handle the banner
        await test.step('notification bar at the top of the webpage ', async () => {

            const banner = await page.locator('#user_optin_banner')
            expect(banner).toBeVisible()

            const privacyPolicy = await page.getByRole('link', { name: 'Privacy Policy', exact: true }).first()
            //    expect(privacyPolicy).toContainText('Privacy Policy')
            await privacyPolicy.click()
            const newPage = await page.waitForEvent('popup')
            await newPage.bringToFront();
            expect(newPage.url()).toContain('/privacy-policy/');
            newPage.close()

            const termsCondition = await page.locator('#user_optin_banner').getByRole('link', { name: 'Terms of Use' }).first()
            //    expect(termsCondition).toContainText('/Terms of Use/')
            await termsCondition.click()
            const newPage2 = await page.waitForEvent('popup')
            await newPage2.bringToFront();
            expect(newPage2.url()).toContain('/terms-of-use/');
            newPage2.close()

        });

        // step 6 
        await test.step('Test Home Page Main Carousel', async () => {

            const carousel1 = page.locator('.swiper-pagination-bullet').first()
            await carousel1.click()

            //Make sure by clicking on Watch Now/Stream Now, the user is redirected to the Show page and the video starts playing.
            const stremNow = page.getByRole('button', { name: 'BINGE NOW' }).first()
            await stremNow.click();
            await page.waitForLoadState();
            const currentUrl = await page.url();
            console.log(currentUrl)
            // const regex = '/\?viewContext=Home\+Billboard/';
            // await expect.soft(currentUrl).toContain(regex);


            await page.goto('https://cwtv.com')
            await page.waitForLoadState('domcontentloaded', { timeout: 10000 });


            //Trending
            // const trending = await page.locator('xpath=//*[@id="swimlane-1"]/h3').textContent();
            // expect.soft(trending).toBe('Trending Now');



            //comedies
            // const comedies = await page.locator('xpath=//*[@id="swimlane-1"]/h3').textContent();
            // expect.soft(comedies).toBe('Comedies: Laugh, Cry, Repeat');

            //Reality
            const reality = await page.getByRole('heading', { name: 'This is Real Life: Reality &' })
            expect(reality).toBeVisible()

            //Check when clicking on an asset, the user is redirected to the correspondent TV Show/Episode
            //latest episode
            const latestEpisode = await page.getByRole('heading', { name: 'Latest Episodes' })
            expect(latestEpisode).toBeVisible()

            //Under Latest Episodes collecting date
            const latestEpisodes = await page.getByRole('heading', { name: 'Latest Episodes' })
            expect(latestEpisodes).toBeVisible()
            let mTitle = await page.locator("//a[@class='swimlane-content']//p[@class='mtitle']").first();
            let mTitleText = mTitle.textContent()
            console.log(mTitleText)
            // let mTitleTrimmed = mTitleText ? mTitleText.trim() : "";
            let subtitle = await page.locator("//a[@class='swimlane-content']//p[@class='subtitle']").first();
            // let sub = await page.locator("//a[@class='swimlane-content']//p[@class='mtitle']").first();
            let subtitleText = subtitle.textContent()
            console.log(subtitleText)

            //clicking on first episode under latest Episodes
            const firstEpisode = await page.locator('a[data-itemidx="1"]').first();
            // await expect(firstEpisode).toBeVisible({timeout: 10000})
            await firstEpisode.click()


            // verifying page is playing video
            let videoPlayingPage = await page.url()
            // expect(videoPlayingPage).toContain('play');
            // await expect.soft(videoPlayingPage).toMatch('/&viewContext=Home\+Swimlane$/');

        });



    });

    test('TEST-633: CW Video Player', async ({ page }) => {
        await page.goto('https://www.cwtv.com/channels/?channel=cw-forever')
        await page.waitForLoadState()
        // await page.waitForTimeout(10000)
        // //Go to Channels section
        //         const channel = await page.getByRole('menuitem', { name: 'Channels' })
        //         await expect(channel).toBeVisible()
        //         await channel.click()
        //         await page.waitForLoadState()
        // //Verify that the user is taken to the FAST Channels page
        //         const channelPage = page.url()
        //         expect(channelPage).toContain('https://www.cwtv.com/channels/')
        // //Note: The first channel listed should be automatically selected
        //         const firstChannel = await page.locator('#channelsContainer div').getAttribute('class');
        //         expect(firstChannel).toBe('channel-row active');
        // // Channel logo/art 
        //         const channelLogo = page.locator('#showcase-channel-icon')
        //         expect(channelLogo).toBeVisible()
        // // Channel Name
        //         const channleName = page.locator('#showcase-info #showcase-title')
        //         expect(channleName).toBeVisible()
        // //  - Duration remaining
        //         const channelPageDuration = page.locator('#showcase-metadata span[class="time_left"]')
        //         expect(channelPageDuration).toBeVisible()
        // // Synopsis
        //         const channelSynopsis = page.locator('#showcase-info #showcase-description')
        //         expect(channelSynopsis).toBeVisible()

        // // Verify under the synopsis you see the current time and the current progression of the currently selected show
        //     const synopsisCurrentTime = page.locator('#current-time-container #current-time')
        //     console.log(synopsisCurrentTime)

        //     const currentProgression = page.locator('.time-block div').first()
        //     expect(currentProgression).toBeVisible()

        // // scroll to bottom and scroll to top
        //     // Scroll to the bottom of the page using page.evaluate
        //     await page.evaluate(() => {
        //         window.scrollTo(0, document.body.scrollHeight);
        //     });
        //     console.log("Scrolled to the bottom");
        //     // Wait for a while to see the bottom
        //     await page.waitForTimeout(1000);
        //     // Scroll back to the top of the page
        //     await page.evaluate(() => {
        //             window.scrollTo(0, 0);
        //     });
        //     console.log("Scrolled back to the top");

        // //Verify that the user can only go forward 12hrs and can't go backwards
        //     const farward12Hours = page.locator('#time-schedule-container li')
        //     const count= await farward12Hours.count()
        //     if (count === 10) {
        //         console.log('There are 10 items as expected.');
        //       } else {
        //         console.log(`Expected 10 items, but found ${count} items.`);
        //         throw new Error('Locator does not return exactly 10 items.');
        //       }

        // scroll down and select last channle
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });

        // Wait for the page to load (adjust the timeout as needed)
        await page.waitForTimeout(1000);  // Wait for 1 second after scrolling

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
    })

    test('TEST-545 : CW Video Player Functionalities', async ({ page }) => {
        test.slow()
        videoplayer = new VideoPlayer(page)
        await page.goto('https://www.cwtv.com/shows/bloody-bites/?viewContext=Series+Swimlane')
        await page.waitForLoadState();

        await test.step("Test - 3 A :  CW Logo is visible", async () => {
            expect.soft(await videoplayer.isCWSplash()).toBeTruthy()
        })

        await test.step("Test - 3 B : Advertisement is visible", async () => {
            expect.soft(await videoplayer.isAdvertisementDisplaying()).toBeTruthy()
        })

        await test.step("Test - 4 :  Controls are visible during pre-roll", async () => {

            if (await videoplayer.isAdvertisementDisplaying()) {
                const playbuttonstatus = await videoplayer.isPlayButtonWorks()

                if (playbuttonstatus?.includes("Both")) {
                    expect.soft(true).toBeTruthy()
                } else {
                    if (playbuttonstatus?.includes("Play")) {
                        expect.soft(true).toBeTruthy()
                        expect.soft(false, "Pause Button not visible.").toBeTruthy()
                    }
                    if (playbuttonstatus?.includes("Pause")) {
                        expect.soft(true).toBeTruthy()
                        expect.soft(false, "Play Button not visible.").toBeTruthy()
                    }
                    if (playbuttonstatus?.includes("None")) {
                        expect.soft(false, "Play and Pause Button not visible.").toBeTruthy()
                    }
                }

                expect.soft(await videoplayer.isMuteVisible(), "Mute not visible.").toBeTruthy()
                expect.soft(await videoplayer.isUnMuteVisible(), "Unmute not visible.").toBeTruthy()
                expect.soft(await videoplayer.isAdCountVisible(), "Ad Count not visible.").toBeTruthy()
                expect.soft(await videoplayer.isAdEndWithVisible(), "This ad will end in text is not visible.").toBeTruthy()
                expect.soft(await videoplayer.isFullScreenVisible(), "Full screen is not visible.").toBeTruthy()
            } else {
                console.log("Avertisement is not running..")
            }
        })
    })
    test("TEST-545 Sub-Test - 5 : Controls are visible during video", async ({ page }) => {
        test.slow()
        videoplayer = new VideoPlayer(page)
        await page.goto('https://www.cwtv.com/shows/bloody-bites/?viewContext=Series+Swimlane')
        await page.waitForLoadState();

        if (await videoplayer.isEpisodePlaying()) {

            const playbuttonstatus = await videoplayer.isPlayButtonWorks()

            if (playbuttonstatus?.includes("Both")) {
                expect.soft(true).toBeTruthy()
            } else {
                if (playbuttonstatus?.includes("Play")) {
                    expect.soft(false, "Pause Button not visible.").toBeTruthy()
                }
                if (playbuttonstatus?.includes("Pause")) {
                    expect.soft(false, "Play Button not visible.").toBeTruthy()
                }
                if (playbuttonstatus?.includes("None")) {
                    expect.soft(false, "Play and Pause Button not visible.").toBeTruthy()
                }
            }
            expect.soft(await videoplayer.isMuteVisible(), "Mute not visible.").toBeTruthy()
            expect.soft(await videoplayer.isForwardVisible(), "Fast Forward not visible.").toBeTruthy()
            expect.soft(await videoplayer.isRewindVisible(), "Rewind not visible.").toBeTruthy()
            expect.soft(await videoplayer.isForwardVisible(), "Fast Forward not visible.").toBeTruthy()
            expect.soft(await videoplayer.isDurationVisible(), "Episode Duration not visible.").toBeTruthy()
            expect.soft(await videoplayer.isSettingVisible(), "Setting not visible.").toBeTruthy()
            expect.soft(await videoplayer.isWideScreenVisibe(), "WideScreen not visible.").toBeTruthy()
            expect.soft(await videoplayer.isFullScreenVisible(), "Full screen is not visible.").toBeTruthy()
        } else {
            console.error("Player Episode is not running...")
        }
    })

    test("TEST-545 Sub-Test - 6 : Test play and pause video.", async ({ page }) => {
        test.slow()
        videoplayer = new VideoPlayer(page)
        await page.goto('https://www.cwtv.com/series/and-never-let-her-go/?viewContext=Home+Swimlane')
        await page.waitForLoadState();
        if (await videoplayer.isEpisodePlaying()) {
            const playbuttonstatus = await videoplayer.isPlayButtonWorks()

            if (playbuttonstatus?.includes("Both")) {
                expect.soft(true).toBeTruthy()
            } else {
                if (playbuttonstatus?.includes("Play")) {
                    expect.soft(false, "Pause Button not visible.").toBeTruthy()
                }
                if (playbuttonstatus?.includes("Pause")) {
                    expect.soft(false, "Play Button not visible.").toBeTruthy()
                }
                if (playbuttonstatus?.includes("None")) {
                    expect.soft(false, "Play and Pause Button not visible.").toBeTruthy()
                }
            }
        } else {
            console.error("Player Episode is not running...")
        }
    })

    test("TEST-545 Sub-Test - 7 : Test volume.", async ({ page }) => {
        test.slow()
        videoplayer = new VideoPlayer(page)
        await page.goto('https://www.cwtv.com/series/and-never-let-her-go/?viewContext=Home+Swimlane')
        await page.waitForLoadState();

        if (await videoplayer.isEpisodePlaying()) {
            expect(await videoplayer.isVolumeWorking(), "Player Volume is not working.").toBeTruthy()
        } else {
            console.error("Player Episode is not running...")
        }
    })
    test("TEST-545 Sub-Test - 12 : Test report issue.", async ({ page }) => {
        test.slow()
        videoplayer = new VideoPlayer(page)
        await page.goto('https://www.cwtv.com/series/and-never-let-her-go/?viewContext=Home+Swimlane')
        await page.waitForLoadState();

        expect(await videoplayer.clickOnLinkAndMathchUrl(), "playback issue link is not working.").toBeTruthy()
    })

    test("TEST-545 Sub-Test - 13 : Test wide screen functionality.", async ({ page }) => {
        test.slow()
        videoplayer = new VideoPlayer(page)
        await page.goto('https://www.cwtv.com/series/and-never-let-her-go/?viewContext=Home+Swimlane')
        await page.waitForLoadState();
        if (await videoplayer.isEpisodePlaying()) {
            expect(await videoplayer.iswiderWorking(), "Wide screen functionality is not working.").toBeTruthy()
        } else {
            console.log("Episode is not playing.")
        }
    })

    test("TEST-545 Sub-Test - 14 & 15  : Test forward and backword functionality.", async ({ page }) => {
        test.slow()
        videoplayer = new VideoPlayer(page)
        await page.goto('https://www.cwtv.com/series/and-never-let-her-go/?viewContext=Home+Swimlane')
        await page.waitForLoadState();
        if (await videoplayer.isEpisodePlaying()) {
            await page.waitForTimeout(3000)
            expect.soft(await videoplayer.isForwardWorking(), "Forward functionality is not working.").toBeTruthy()
            await page.waitForTimeout(3000)
            expect.soft(await videoplayer.isBackwordWorking(), "Backword functionality is not working.").toBeTruthy()
        } else {
            console.log("Episode is not playing.")
        }
    })
});