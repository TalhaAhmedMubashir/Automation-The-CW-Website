import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class VideoPlayer extends BasePage {
    readonly videoscreen: Locator;
    readonly pauseButton: Locator;
    readonly playButton: Locator;
    readonly forwardtensecondButton: Locator;
    readonly backwordtensecondButton: Locator;
    readonly volumeunmutedButton: Locator;
    readonly volumemutedButton: Locator;
    readonly volumeslider: Locator;
    readonly volumenchangeobserve: Locator;
    readonly playedtime: Locator;
    readonly totalvideotime: Locator;
    readonly screenwiderButton: Locator;
    readonly screenwider_description: Locator;
    readonly screenwiderplayer: Locator;
    readonly captionButton: Locator;
    readonly captiondropdonwButton: Locator; // it will be a list
    readonly settingButton: Locator;
    readonly settingdropdonwButton: Locator; // it will be a list
    readonly settingselecteddropdownvalue: Locator;
    readonly fullscreenButton: Locator;
    readonly advertisementcount: Locator;
    readonly isiframe: Locator;
    readonly advertismentendIn: Locator;
    readonly playbackissue: Locator;



    constructor(page: Page) {
        super(page);
        this.videoscreen = page.locator('//div[@class="videoAdUiClickElement"]');
        this.playButton = page.locator('//*[@class="vjs-play-control vjs-control vjs-button vjs-playing"]');
        this.pauseButton = page.locator('//*[@class="vjs-play-control vjs-control vjs-button vjs-paused"]');
        this.forwardtensecondButton = page.locator('//*[@class="vjs-skip-forward-10 vjs-control vjs-button"]');
        this.backwordtensecondButton = page.locator('//*[@class="vjs-skip-backward-10 vjs-control vjs-button"]');
        this.volumemutedButton = page.locator("//button[contains(@class, 'vjs-mute-control') and @title='Mute']");
        this.volumeunmutedButton = page.locator("//button[contains(@class, 'vjs-mute-control') and @title='Unmute']");
        this.volumeslider = page.locator('//*[@class="vjs-volume-bar vjs-slider-bar vjs-slider vjs-slider-vertical"]');
        this.volumenchangeobserve = page.locator('//div[contains(@class, "vjs-volume-bar")]');
        this.playedtime = page.locator('//span[@class="vjs-current-time-display"]').last();
        this.totalvideotime = page.locator('//span[@class="vjs-duration-display"]').last();
        this.screenwiderplayer = page.locator('//div[@id="player_container"]')
        this.screenwider_description = page.locator('//div[@id="details_container"]')
        this.screenwiderButton = page.locator('//*[@class="vjs-control vjs-button vjs-theatre-view"]');

        this.captionButton = page.locator('//*[@class="vjs-subs-caps-button vjs-menu-button vjs-menu-button-popup vjs-control vjs-button"]');
        this.captiondropdonwButton = page.locator('//div[@class="vjs-menu vjs-lock-showing"]/ul/li');
        this.settingButton = page.locator('//*[@class="vjs-quality-menu-button vjs-menu-button vjs-menu-button-popup vjs-button"]');
        this.settingdropdonwButton = page.locator('//div[@class="vjs-menu vjs-lock-showing"]/ul/li/span[@class="vjs-menu-item-text"]');
        this.settingselecteddropdownvalue = page.locator('//li[@aria-checked="true" and contains(@class, "vjs-menu-item")]')
        this.fullscreenButton = page.locator('//*[@class="vjs-fullscreen-control vjs-control vjs-button"]');
        this.isiframe = page.locator("//iframe[@title='Advertisement'][1]");
        this.advertisementcount = page.locator('//span[@id="pod_count" and contains(.,"1 of 2:")]')
        this.advertismentendIn = page.locator('//p[@id="adOverlay" and contains(.," This ad will end in ")]')
        this.playbackissue = page.locator('//div[@id="videohelp"]')

    }
    async isResolutionChangeWorking() {
        await this.page.waitForSelector("//iframe[@title='Advertisement']");
        if (await this.playvideo() !== true) {
            await EnablePlayerButtonBar(this.page)
        }
        await this.settingButton.click()
        await this.page.waitForTimeout(2000)
        const cogwheeldropdownvalue = await this.getCogList(this.settingdropdonwButton);
        if (cogwheeldropdownvalue) {
            let failed = 0;
            let faileditems: string[] = []; // Explicitly define the array as a string array

            // Use iterate over each element
            for (let i = 0; i < cogwheeldropdownvalue.length; i++) {
                if (await this.settingdropdonwButton.first().isVisible() !== true) {
                    await this.settingButton.click()
                }
                if (await this.settingdropdonwButton.filter({ hasText: `${cogwheeldropdownvalue[i]}` }).isVisible()) {
                    await this.settingdropdonwButton.filter({ hasText: `${cogwheeldropdownvalue[i]}` }).click()
                    await this.page.waitForTimeout(3000)
                    if (await this.settingdropdonwButton.first().isVisible() !== true) {
                        await this.settingButton.click()
                    }
                    if (await this.settingdropdonwButton.first().isVisible()) {
                        const selectedvalue = await this.getCogwheelSelectedValue(this.settingselecteddropdownvalue.filter({ hasText: `${cogwheeldropdownvalue[i]}` }));
                        if (!selectedvalue) {
                            failed++
                            faileditems.push(cogwheeldropdownvalue[i])
                        }
                    } else {
                        await this.settingButton.click()
                        await this.page.waitForTimeout(2000)
                        if (await this.settingdropdonwButton.first().isVisible()) {
                            const selectedvalue = await this.getCogwheelSelectedValue(this.settingselecteddropdownvalue.filter({ hasText: `${cogwheeldropdownvalue[i]}` }));
                            if (!selectedvalue) {
                                failed++
                                faileditems.push(cogwheeldropdownvalue[i])
                            }
                        } else {
                            console.log("Cogwheel dropdown values are not visible to get the selected value.")
                        }
                    }
                } else {
                    failed++
                    faileditems.push(cogwheeldropdownvalue[i])
                }
            }

            if (cogwheeldropdownvalue.length - 1 === failed) {
                return false
            }
            if (failed > 0) {
                console.log("Resolution is failed to select following items : ", faileditems)
            }
            return true
        } else {
            console.error("Cogwheel values from setting are not visible.")
            return false
        }
    }
    async getCogList(locator: Locator) {
        if (await locator.first().isVisible()) {
            // Get all text contents of the matched elements
            const textValues = await locator.allTextContents();
            if (textValues) {
                return textValues;
            } else {
                console.error("Cogwheel list is empty.")
                return null
            }
        } else {
            console.error("Cogwheel values are not visible to get the list.")
            return null
        }
    }

    async getCogwheelSelectedValue(locator: Locator) {
        if (await locator.isVisible()) {

            // Get all text contents of the matched elements
            const textValues = await locator.textContent();
            if (textValues) {
                return textValues;
            } else {
                console.error("Cogwheel list is empty.")
                return null
            }
        } else {
            console.error("Cogwheel values are not visible to get the selected value.")
            return null
        }
    }

    async isAdvertisementDisplaying(adWaitTime = 15) {
        await this.page.waitForLoadState()
        await this.page.waitForSelector("//iframe[@title='Advertisement']");
        if (await this.isiframe.isVisible()) {
            if (await this.playvideo() !== true) {
                await EnablePlayerButtonBar(this.page)
            }

            if (await this.isPlayerReadyToPlay()) {
                if (await this.isVideoPlaying()) {
                    let isAdPlaying = false;

                    while (adWaitTime > -1 && !isAdPlaying) {
                        const totalTime = await this.totalvideotime?.textContent()
                        isAdPlaying = (Number(totalTime?.split(':')[0].trim()) === 0 ? true : false) && (Number(totalTime?.split(':')[1].trim()) > 5 && Number(totalTime?.split(':')[1].trim()) < 31 ? true : false)
                        await delay(1000)
                        if (!isAdPlaying) {
                            adWaitTime--;
                            continue
                        } else {
                            break
                        }
                    }
                    console.log("Is Playing add : ", isAdPlaying)
                    return isAdPlaying;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    }

    async isCWSplash() {
        await this.page.waitForLoadState()
        await this.page.waitForSelector("//iframe[@title='Advertisement']");
        if (await this.isiframe.isVisible()) {
            if (await this.playvideo() !== true) {
                await EnablePlayerButtonBar(this.page)
            }
            if (await this.isPlayerReadyToPlay()) {
                if (await this.isVideoPlaying()) {
                    const totalTime = await this.totalvideotime?.textContent()
                    return ((Number(totalTime?.split(':')[0].trim()) > 0 ? true : false) || (Number(totalTime?.split(':')[1].trim()) < 6 ? true : false))
                } else {
                    return false;
                }
            }
        } else {
            return false
        }
    }

    async isEpisodePlaying() {
        await this.page.waitForLoadState()
        await this.page.waitForSelector("//iframe[@title='Advertisement']");
        if (await this.isiframe.isVisible()) {
            if (await this.playvideo() !== true) {
                await EnablePlayerButtonBar(this.page)
            }
            if (await this.isPlayerReadyToPlay()) {
                if (await this.isVideoPlaying()) {
                    let time = 60;
                    let isEpisodeplay = false;
                    while (time > -1 && !isEpisodeplay) {
                        if (await this.isAdvertisementDisplaying() !== true) {
                            const totalTime = await this.totalvideotime?.textContent()
                            isEpisodeplay = (Number(totalTime?.split(':')[0].trim()) >= 1 ? true : false) && (Number(totalTime?.split(':')[1].trim()) >= 0 ? true : false)
                        }
                        if (!isEpisodeplay) {
                            await delay(3000)
                            time--;
                        } else {
                            break
                        }
                    }
                    console.log("Is Episode playing : ", isEpisodeplay)
                    return isEpisodeplay
                } else {
                    return false;
                }
            } else {
                return false
            }
        } else {
            return false
        }
    }

    async isPlayerReadyToPlay(waittime = 15, timeexceed = false) {
        while (waittime > -1 && !timeexceed) {
            if (await this.playButton.isVisible() || await this.pauseButton.isVisible()) {
                timeexceed = true;
                return true;
            }
            await delay(1000); // Waits for 1 seconds
            waittime -= 1;
        }

        return !timeexceed;
    }

    async isVideoPlaying(waittime = 15, timeexceed = false) {
        let isVideoPlay = false;
        while (waittime > -1 && !timeexceed) {
            const PlayTime = await this.playedtime?.textContent()
            if (await this.playButton.isVisible() || (Number(PlayTime?.trim()) > 0 ? true : false)) {
                timeexceed = true;
                isVideoPlay = true;
                return true;
            }
            await delay(1000); // Waits for 1 seconds
            waittime -= 1;
        }
        if (isVideoPlay) {
            return true
        }
        if (await this.pauseButton.isVisible()) {
            return false;
        } else {
            return false;
        }
    }

    async isPlayButtonWorks() {
        let playbuttonwork = false
        let pausebuttonwork = false;
        await this.page.waitForSelector("//iframe[@title='Advertisement']");
        if (await this.playvideo() !== true) {
            await EnablePlayerButtonBar(this.page)
        }

        if (await this.playButton.isVisible()) {
            playbuttonwork = true;

            if (await this.playvideo() !== true) {
                await EnablePlayerButtonBar(this.page)
            }

            await this.playButton.waitFor({ state: 'visible' });
            await this.playButton.click()

            if (await this.pauseButton.isVisible()) {
                await this.pauseButton.waitFor({ state: 'visible' });
                pausebuttonwork = true;
                await this.pauseButton.click()
            }
        } else {
            if (await this.pauseButton.isVisible()) {
                pausebuttonwork = true;
                await this.pauseButton.waitFor({ state: 'visible' });
                await this.pauseButton.click()

                if (await this.playvideo() !== true) {
                    await EnablePlayerButtonBar(this.page)
                    // await this.isiframe.hover({ force: true })
                }
                if (await this.playButton.isVisible()) {
                    playbuttonwork = true;
                }
            }
        }
        return (playbuttonwork && pausebuttonwork) ? "Both" : playbuttonwork ? "Play" : pausebuttonwork ? "Pause" : "None";
    }
    async isMuteVisible() {
        await this.page.waitForSelector("//iframe[@title='Advertisement']");
        if (await this.playvideo() !== true) {
            await EnablePlayerButtonBar(this.page)
        }
        if (await this.volumemutedButton.isVisible()) {
            return true
        } else {
            if (await this.volumeunmutedButton.isVisible()) {
                await this.volumeunmutedButton.click()
                if (await this.volumemutedButton.isVisible()) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        }
    }
    async isUnMuteVisible() {
        await this.page.waitForSelector("//iframe[@title='Advertisement']");
        if (await this.playvideo() !== true) {
            await EnablePlayerButtonBar(this.page)
        }

        if (await this.volumeunmutedButton.isVisible()) {
            return true
        } else {
            if (await this.volumemutedButton.isVisible()) {
                await this.volumemutedButton.click()
                if (await this.volumeunmutedButton.isVisible()) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        }
    }

    async playvideo() {
        await this.page.waitForSelector("//iframe[@title='Advertisement']");
        await EnablePlayerButtonBar(this.page)
        if (await this.playButton.isVisible()) {
            return true
        } else {
            if (await this.pauseButton.isVisible()) {
                await this.pauseButton.click()
                if (await this.playButton.isVisible()) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        }
    }
    async pausedvideo() {
        await this.page.waitForSelector("//iframe[@title='Advertisement']");
        await EnablePlayerButtonBar(this.page)
        if (await this.pauseButton.isVisible()) {
            return true
        } else {
            if (await this.playButton.isVisible()) {
                await this.playButton.click()
                if (await this.pauseButton.isVisible()) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        }
    }
    async isFullScreenVisible() {
        await this.page.waitForSelector("//iframe[@title='Advertisement']");
        await EnablePlayerButtonBar(this.page)
        if (await this.fullscreenButton.isVisible()) {
            return true
        } else {
            return false;
        }
    }
    async isWideScreenVisibe() {
        await this.page.waitForSelector("//iframe[@title='Advertisement']");
        await EnablePlayerButtonBar(this.page)
        if (await this.screenwiderButton.isVisible()) {
            return true
        } else {
            return false;
        }
    }
    async isAdCountVisible() {
        await this.page.waitForSelector("//iframe[@title='Advertisement']");
        await EnablePlayerButtonBar(this.page)
        if (await this.advertisementcount.isVisible()) {
            return true
        } else {
            return false;
        }
    }

    async isAdEndWithVisible() {
        await this.page.waitForSelector("//iframe[@title='Advertisement']");
        await EnablePlayerButtonBar(this.page)
        if (await this.advertismentendIn.isVisible()) {
            return true
        } else {
            return false;
        }
    }

    async isRewindVisible() {
        await this.page.waitForSelector("//iframe[@title='Advertisement']");
        await EnablePlayerButtonBar(this.page)
        if (await this.backwordtensecondButton.isVisible()) {
            return true
        } else {
            return false;
        }
    }
    async isForwardVisible() {
        await this.page.waitForSelector("//iframe[@title='Advertisement']");
        await EnablePlayerButtonBar(this.page)
        if (await this.forwardtensecondButton.isVisible()) {
            return true
        } else {
            return false;
        }
    }

    async isDurationVisible() {
        await this.page.waitForSelector("//iframe[@title='Advertisement']");

        await EnablePlayerButtonBar(this.page)
        if (await this.totalvideotime.isVisible()) {
            return true
        } else {
            return false;
        }
    }

    async isSettingVisible() {
        await this.page.waitForSelector("//iframe[@title='Advertisement']");
        await EnablePlayerButtonBar(this.page)
        if (await this.settingButton.isVisible()) {
            return true
        } else {
            return false;
        }
    }
    async isVolumeWorking() {
        await this.page.waitForSelector("//iframe[@title='Advertisement']");
        await EnablePlayerButtonBar(this.page)
        let initialValue = await this.volumenchangeobserve.getAttribute('aria-valuenow');
        if (await this.isMuteVisible() || await this.isUnMuteVisible()) {
            await this.volumemutedButton.click()
            if (await this.isUnMuteVisible()) {
                await this.volumeunmutedButton.click()
            }

            if (await this.volumeslider.isVisible()) {
                await this.volumeslider.click()
                //Moving mouse Up
                await this.dragMouse(this.volumenchangeobserve)
                let finalValue = await this.volumenchangeobserve.getAttribute('aria-valuenow');

                if (Number(finalValue) !== Number(initialValue)) {
                    return true
                } else {
                    return false
                }
            } else {
                return false;
            }
        } else {
            return false
        }
    }

    async dragMouse(sliderpath: Locator, dragUp = false) {
        // Get the bounding box of the slider for precise dragging
        const boundingBox = await sliderpath.boundingBox();
        if (!boundingBox) {
            throw new Error('Bounding box not found for the slider.');
        }

        // Calculate the starting position (center of the slider)
        const startX = boundingBox.x + boundingBox.width / 2;
        const startY = boundingBox.y + boundingBox.height / 2;

        // Determine the end position based on drag direction
        const dragDistance = 50; // Adjust based on slider sensitivity
        const endY = !dragUp ? startY - dragDistance : startY + dragDistance;

        // Perform the drag action
        await this.page.mouse.move(startX, startY); // Move to the center of the slider
        await this.page.mouse.down();              // Press the mouse button
        await this.page.mouse.move(startX, endY);  // Drag the slider
        await this.page.mouse.up();                // Release the mouse button
    }

    async clickOnLinkAndMathchUrl(locator: Locator = this.playbackissue, matchurlstring: string = "support.cwtv.com") {
        // Click the link that opens in a new window
        const [newPage] = await Promise.all([
            this.page.waitForEvent('popup'), // Wait for the new window to open
            locator.click() // Replace with your link selector
        ]);
        await newPage.waitForLoadState()
        const isurlmatched = newPage.url().includes(matchurlstring) ? true : false
        await newPage.close();
        return isurlmatched
    }

    async iswiderWorking() {
        await this.page.waitForSelector("//iframe[@title='Advertisement']");
        if (await this.playvideo() !== true) {
            await EnablePlayerButtonBar(this.page)
        }
        const intialvideowidth = await this.screenwiderplayer.evaluate(el => el.getBoundingClientRect().width)
        const initialcontentwidht = await this.screenwider_description.evaluate(el => el.getBoundingClientRect().width)

        await this.screenwiderButton.click()

        const finalvideowidth = await this.screenwiderplayer.evaluate(el => el.getBoundingClientRect().width)
        const finalcontentwidht = await this.screenwider_description.evaluate(el => el.getBoundingClientRect().width)

        const isVideoWider = (intialvideowidth !== finalvideowidth) ? true : false
        const isContentWider = (initialcontentwidht !== finalcontentwidht) ? true : false

        return (isVideoWider === isContentWider) ? true : false
    }

    async isForwardWorking() {
        await this.page.waitForSelector("//iframe[@title='Advertisement']");

        let beforevalue_string = await this.playedtime?.textContent()
        let beforevalue = Number(beforevalue_string?.split(':')[1].trim())

        if (await this.playvideo() !== true) {
            await EnablePlayerButtonBar(this.page)
        }
        await this.forwardtensecondButton.click()
        await this.page.waitForTimeout(1000)

        let aftervalue_string = await this.playedtime?.textContent()
        let aftervalue = Number(aftervalue_string?.split(':')[1].trim())

        return ((beforevalue !== aftervalue) && (aftervalue - beforevalue >= 10)) ? true : false
    }

    async isBackwordWorking() {
        await this.page.waitForSelector("//iframe[@title='Advertisement']");

        let beforevalue_string = await this.playedtime?.textContent()
        let beforevalue = Number(beforevalue_string?.split(':')[1].trim())

        if (await this.playvideo() !== true) {
            await EnablePlayerButtonBar(this.page)
        }
        await this.backwordtensecondButton.click()
        await this.page.waitForTimeout(1000)

        let aftervalue_string = await this.playedtime?.textContent()
        let aftervalue = Number(aftervalue_string?.split(':')[1].trim())

        return ((beforevalue !== aftervalue) && (beforevalue - aftervalue <= 11)) ? true : false
    }
}

async function EnablePlayerButtonBar(page: Page) {
    const videoElement = page.locator('//video-js[@id="vjs_video_3"]');

    // Check if the class exists and remove it
    await videoElement.evaluate((element) => {
        if (element.classList.contains('vjs-user-inactive')) {
            element.classList.remove('vjs-user-inactive');
            console.log('Class "vjs-user-inactive" removed');
        } else {
            console.log('Class "vjs-user-inactive" not found');
        }
    });
}

async function delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, milliseconds);
    });
}