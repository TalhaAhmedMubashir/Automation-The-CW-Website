import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class channel extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  //Go to Channels section
  async findChannle() {
    const channelHeading = await this.page.getByRole('menuitem', {
      name: 'Channels',
    });
    await expect(channelHeading).toBeVisible();
    await channelHeading.click();
    await this.page.waitForLoadState();
    await this.verifyChannelNAviagtion();
  }
  //Verify that the user is taken to the FAST Channels page
  private async verifyChannelNAviagtion() {
    const channelPage = this.page.url();
    expect(channelPage).toContain('https://www.cwtv.com/channels/');
  }

  async channelPageContentVerifiction() {
    const firstChannel = await this.page
      .locator('#channelsContainer div')
      .first();
    expect(firstChannel).toBeVisible();
    // Channel logo/art
    const channelLogo = this.page.locator('#showcase-channel-icon');
    expect(channelLogo).toBeVisible();
    // Channel Name
    const channleName = this.page.locator('#showcase-info #showcase-title');
    expect(channleName).toBeVisible();
    //  - Duration remaining
    const channelPageDuration = this.page.locator(
      '#showcase-metadata span[class="time_left"]'
    );
    expect(channelPageDuration).toBeVisible();
    // Synopsis
    const channelSynopsis = this.page.locator(
      '#showcase-info #showcase-description'
    );
    expect(channelSynopsis).toBeVisible();
  }
  async synopsisTimeFrame() {
    const synopsisCurrentTime = this.page.locator(
      '#current-time-container #current-time'
    );
    console.log(synopsisCurrentTime);
    const currentProgression = this.page.locator('.time-block div').first();
    expect(currentProgression).toBeVisible();
  }

  async scrollPage() {
    // scroll to bottom and scroll to top
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    console.log('Scrolled to the bottom');
    // Wait for a while to see the bottom
    await this.page.waitForTimeout(1000);
    // Scroll back to the top of the page
    await this.page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    console.log('Scrolled back to the top');
  }

  async visible12hours() {
    const farward12Hours = this.page.locator('#time-schedule-container li');
    const count = await farward12Hours.count();
    if (count === 10) {
      console.log('There are 10 items as expected.');
    } else {
      console.log(`Expected 10 items, but found ${count} items.`);
      throw new Error('Locator does not return exactly 10 items.');
    }
  }

  async scrollnSelectChannel() {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  async futureTimeSelection() {
    const futureTimeChannel = this.page
      .locator('li.channel-program[tabindex="0"]')
      .last();
    // await expect(futureTimeChannel).toBeVisible()
    await futureTimeChannel.click();
    const backToguide = this.page.locator('#return-to-guide');
    await this.page.waitForTimeout(1000);
    await expect.soft(backToguide).toBeVisible();
    console.log('back to guide click');
    await backToguide.click();
    // Wait for the page to load (adjust the timeout as needed)
    await this.page.waitForTimeout(1000);
  }

  async SelectlastChannel() {
    // Define the locator for the element with the class .channel-name.last
    const channelLocator = this.page.locator('.channel-name').last();

    // Ensure the element is visible
    const isVisible = await channelLocator.isVisible();

    if (isVisible) {
      console.log('Element is visible, clicking now...');
      // Click the element
      await channelLocator.click();
    } else {
      console.log('Element is not visible.');
    }
  }

  async findChannelandZipCode() {
    const findyChannel = this.page.getByRole('link', {
      name: 'Find Your Channel',
    });
    await findyChannel.click();
    await this.page.waitForLoadState();
    // type zip code
    const zipCode = this.page
      .locator('iframe[name="stations-frame"]')
      .contentFrame()
      .getByPlaceholder('ex.');
    await zipCode.fill('90210');
    await this.page.keyboard.press('Enter');
    // verify result through headings
    const overAir = this.page
      .locator('iframe[name="stations-frame"]')
      .contentFrame()
      .getByRole('heading', { name: 'Over the Air' });
    await expect(overAir).toBeVisible();

    const service = this.page
      .locator('iframe[name="stations-frame"]')
      .contentFrame()
      .getByRole('heading', { name: 'Service Providers' });
    await expect(service).toBeVisible();
  }

}
