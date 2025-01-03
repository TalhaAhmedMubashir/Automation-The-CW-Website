import { expect, test } from '@playwright/test';
import { channel } from '../pages/ChannelPage';

test.describe('CW', () => {


    test('TEST-633: CW channel', async ({ page }) => {
        const channelPage = new channel(page);
        await page.goto('https://www.cwtv.com/');
        await page.waitForLoadState();

        await test.step('Go to Channels section', async () => {
            await channelPage.findChannle();
        });

        await test.step('Channle Page assertions', async () => {
            await channelPage.channelPageContentVerifiction();
        })

        await test.step('Is synopsis visible according to current time', async () => {
            await channelPage.synopsisTimeFrame();
        })

        await test.step('Channle page scroll', async () => {
            await channelPage.scrollPage()
        })

        await test.step('user can only go forward 12hrs and cannot go backwards', async () => {
            await channelPage.visible12hours()
        })

        await test.step('scroll down and select last channle', async () => {
            await channelPage.scrollnSelectChannel()
        })

        await test.step('Select a channel at a future time andSelect a channel at a future time and verify that an overlay appears with a "Back to Channel Guide', async () => {
            await channelPage.futureTimeSelection()
        })

        await test.step('Select Last channel', async () => {
            await channelPage.SelectlastChannel()
        })

        await test.step('find your channle and search with zip code', async () => {
            await channelPage.findChannelandZipCode()
        })

    });
});
