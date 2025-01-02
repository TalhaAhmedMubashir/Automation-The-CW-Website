import { expect, Page, test } from '@playwright/test';

const baseURL = "https://www.cwtv.com";

test.describe('Search Test', () => {
  const searchbar = '//input[@id="search"]';
  let searchbardata = '';

  const imagesrc =
    '//li[1][contains(@class, "matched")]//a//img[contains(@class, "lazyloaded")]';

  const iframeLocator =
    "//iframe[@title='Advertisement' and not(contains(@style, 'display: none'))]";

  test('Search Function Test', async ({ page }) => {
    test.slow();

    await test.step('Point 2 : Verify Placeholder value', async () => {
      await page.goto(baseURL);
      await page.waitForLoadState();

      // Locate the search input
      const searchInput = page.locator(searchbar);

      await searchInput.click();
      await page.waitForTimeout(2000);

      // Get the placeholder attribute
      const placeholderValue = await searchInput.getAttribute('placeholder');

      // Assert the placeholder value
      expect
        .soft(
          placeholderValue,
          'Search bar placeholder value does not matched. Test failed.'
        )
        .toBe('Search for a series or movie...');
    });

    await test.step('Point 4 : Type 2 letter result in thumbnails', async () => {
      searchbardata = 'Su';

      const issearchcountVisible = '//div[@id="search-header-cw"]//li[1]//span';

      await page.goto(baseURL);
      await page.waitForLoadState();

      await page.locator(searchbar).fill(searchbardata);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(10000);

      expect
        .soft(
          await page.locator(issearchcountVisible).isVisible(),
          'Result in thumbnails is not being displayed on Two letter. Test Failed'
        )
        .toBeTruthy();
    });

    await test.step('Point 9 : Search and Open Show', async () => {
      await page.goto(baseURL);
      await page.waitForLoadState();

      searchbardata = 'Superman & Lois';

      const searchresulthastitle = `//div[@class="titles" and contains(., "${searchbardata}")]`;
      const searchresulthastype = `//div[@class="titles" and (contains(., "Series") or contains(., "Movies") or contains(., "Episodes"))]`;
      const matchurl = 'superman-and-lois/?viewContext=Search+Page';

      await page.locator(searchbar).fill(searchbardata);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(5000);

      expect
        .soft(
          await page.locator(searchresulthastitle).first().isVisible(),
          `Title "${searchbardata}" does not matched.`
        )
        .toBeTruthy();
      if (await page.locator(searchresulthastitle).first().isVisible()) {
        expect
          .soft(await IsImagebroken(page, imagesrc), 'Image link is broken')
          .toBeTruthy();
      }

      //match serices/movies/episode
      expect
        .soft(
          await page.locator(searchresulthastype).isVisible(),
          `Type "serices/movies/episode" does not matched.`
        )
        .toBeTruthy();

      //Open and match url by clicking serices/movies/episode
      expect
        .soft(
          await isDetailPageOpened(page, searchresulthastype, matchurl),
          `Failed to open detail page. Expected URL: ${matchurl}`
        )
        .toBeTruthy();
      await page.goBack();

      await page.waitForLoadState();
      //Open and match url by clicking on image
      expect
        .soft(
          await isDetailPageOpened(page, imagesrc, matchurl),
          `Failed to open detail page. Expected URL: ${matchurl}`
        )
        .toBeTruthy();
    });

    await test.step('Point 10 : Search episode and Check image', async () => {
      await page.goto(baseURL);
      await page.waitForLoadState();

      searchbardata = 'Always My Hero';

      const searchresulthastitle = `//div[@class="titles" and contains(., "${searchbardata}")]`;

      await page.locator(searchbar).fill(searchbardata);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(5000);

      expect
        .soft(
          await page.locator(searchresulthastitle).first().isVisible(),
          `Title "${searchbardata}" does not matched.`
        )
        .toBeTruthy();
      if (await page.locator(searchresulthastitle).first().isVisible()) {
        expect
          .soft(await IsImagebroken(page, imagesrc), 'Image link is broken')
          .toBeTruthy();
      }
    });

    await test.step('Point 11 : Search episode and Check image', async () => {
      await page.goto(baseURL);
      await page.waitForLoadState();

      searchbardata = "NFL's Greatest Games";
      const matchurl = 'nfls-greatest-games/?viewContext=Search+Page';
      const searchresulthastitle = `//div[@class="titles" and contains(., "${searchbardata}")]`;
      const similaritempath_ondetailpage =
        '//div[@id="touchcarousel_1"]//ul//li';

      await page.locator(searchbar).fill(searchbardata);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(5000);
      expect
        .soft(
          await page.locator(searchresulthastitle).first().isVisible(),
          `Title "${searchbardata}" does not matched.`
        )
        .toBeTruthy();
      if (await page.locator(searchresulthastitle).first().isVisible()) {
        expect
          .soft(await IsImagebroken(page, imagesrc), 'Image link is broken')
          .toBeTruthy();

        await page.waitForTimeout(2000);
        const isDetailPageDisplaying = await isDetailPageOpened(
          page,
          imagesrc,
          matchurl
        );
        expect
          .soft(
            isDetailPageDisplaying,
            `Failed to open detail page. Expected URL: ${matchurl}`
          )
          .toBeTruthy();

        if (isDetailPageDisplaying) {
          let iframeVisible = await isiframeVisible(page, iframeLocator);
          expect
            .soft(iframeVisible, `Video Player is not visible.`)
            .toBeTruthy();

          if (await isiframeVisible(page, iframeLocator)) {
            const hasmorevideos = await isSimilarEpisodesVisible(
              page,
              similaritempath_ondetailpage
            );
            expect
              .soft(hasmorevideos, `Does not have more episodes.`)
              .toBeTruthy();

            if (hasmorevideos) {
              await page.locator(similaritempath_ondetailpage).last().click();
              iframeVisible = await isiframeVisible(page, iframeLocator);
              expect
                .soft(iframeVisible, `Video Player is not visible.`)
                .toBeTruthy();
            }
          } else {
            console.log('Video is being loaded or displayed...');
          }
        }
      }
    });
  });

  test('Remove character from search', async ({ page }) => {
    let searchbardata = 'Van Helsing';
    const searchbarrandomdata = 'Big Bang theory';

    const initiallenght = searchbardata.length - 1;
    let differenceOccurance = 0;
    let currentrecords = '';

    const searchcountpath = '//div[@id="search-header-cw"]//li[1]//span';
    const noresultfoundpath = '//div[@id="no-matches-message"]';

    await test.step('Point 7 : Enter Random Characters in Search', async () => {
      // Navigate to the website
      await page.goto(baseURL);
      await page.waitForLoadState();

      // Perform the initial search
      await page.locator(searchbar).fill(searchbarrandomdata);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(5000);

      expect
        .soft(
          await page.locator(noresultfoundpath).isVisible(),
          'Randon character in search field, test failed.'
        )
        .toBeTruthy();
    });

    await test.step('Point 8 : Remove characters and identify the count change in search result.', async () => {
      // Navigate to the website
      await page.goto(baseURL);
      await page.waitForLoadState();

      // Perform the initial search
      await page.locator(searchbar).fill(searchbardata);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(5000);

      // Iterate through the search string characters, removing one character at a time
      for (let i = searchbardata.length - 1; i > 0; i--) {
        const rawText = await page
          .locator(searchcountpath)
          .first()
          .textContent();
        const searchcount = rawText ? extractSubstring(rawText) : null;

        if (i === initiallenght) {
          currentrecords = searchcount || ''; // Save initial search results
        } else {
          if (currentrecords !== searchcount) {
            differenceOccurance++;
          }
        }

        searchbardata = removeCharacterAtIndex(searchbardata, i);
        await page.locator(searchbar).fill(searchbardata);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000); // Adjust delay as needed
      }

      // Verify the results
      expect
        .soft(
          differenceOccurance !== 0,
          'Remove characters and identify the count change in search result. Test Failed.'
        )
        .toBeTruthy();
    });
  });
});

test.afterAll('Closing .. ', () => {
  console.log('Closing browser...');
});

async function isiframeVisible(page: Page, iframelocator: string) {
  // Locate the iframe with the specified conditions
  const adFrame = page.locator(iframelocator).contentFrame();
  await page.waitForTimeout(5000);

  // Check if the iframe is visible
  return adFrame ? true : false;
}

async function isSimilarEpisodesVisible(page: Page, similarlistpath: string) {
  return (await page.locator(similarlistpath).count()) > 1;
}

async function isDetailPageOpened(
  page: Page,
  sourcetoclick: string,
  matched_substring_url: string
) {
  await page.locator(sourcetoclick).click();
  await page.waitForLoadState();
  return page.url().includes(matched_substring_url) ? true : false;
}

async function IsImagebroken(page: Page, imageLocator: string) {
  // Check if the image is visible
  const isVisible = await page.locator(imageLocator).first().isVisible();
  console.log(`Image is visible: ${isVisible}`);

  if (isVisible) {
    // Get the src attribute of the image
    const imageSrc = await page.getAttribute(imageLocator, 'src');

    // Check if the image URL is valid
    if (imageSrc) {
      const response = await page.goto(imageSrc, { waitUntil: 'networkidle' });
      await page.goBack();
      if (response && response.ok()) {
        console.log('Image is valid and loaded successfully.');
        return true;
      } else {
        console.log('Image is broken or not found.');
        return false;
      }
    } else {
      console.log('Image source is empty');
      return false;
    }
  } else {
    console.log('Image is not visible on the page.');
    return false;
  }
}

function extractSubstring(input: string): string | null {
  const match = input.match(/\(([^)]+)\)/); // Regex to capture text inside parentheses
  return match ? match[1] : null;
}
function removeCharacterAtIndex(input: string, index: number): string {
  if (index < 0 || index >= input.length) {
    throw new Error('Index out of bounds');
  }
  return input.substring(0, index) + input.substring(index + 1);
}
