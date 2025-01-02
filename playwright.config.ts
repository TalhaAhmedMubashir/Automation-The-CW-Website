import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  timeout: 90 * 1000,
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // reporter: [
  //   ['html'],
  //   ['allure-playwright']
  // ],
  use: {
    baseURL: 'https://www.cwtv.com',
    viewport: { width: 1280, height: 720 },
    // trace: 'on-first-retry',
    // screenshot: 'only-on-failure',
    // video: 'retain-on-failure',
    headless: true,
    channel: 'chrome',

    // Additional permissions and features
    contextOptions: {
      reducedMotion: 'no-preference',  // Don't reduce animations
    },
    launchOptions: {
      args: [
        '--disable-web-security',
        '--use-fake-ui-for-media-stream'
      ],
    },

  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // }
  ],
});