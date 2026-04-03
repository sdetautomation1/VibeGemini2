import { defineConfig } from '@playwright/test';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';
import { config } from './src/support/config';

/**
 * Playwright + BDD Configuration
 * 
 * This config integrates playwright-bdd with Playwright's test runner.
 * - `defineBddConfig()` tells the framework where to find features & steps
 * - Standard Playwright config handles browser settings, reporters, etc.
 */

const testDir = defineBddConfig({
  features: 'src/features/**/*.feature',
  steps: 'src/steps/**/*.ts',
  importTestFrom: 'src/support/fixtures.ts',
});

export default defineConfig({
  testDir,

  /* Maximum time a single test can run */
  timeout: 60_000,

  /* Expect timeout */
  expect: {
    timeout: 10_000,
  },

  /* Fail the build on CI if test.only is left in source code */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : config.retries,

  /* Parallel workers */
  workers: config.workers,

  /* Reporter configuration */
  reporter: [
    ['html', { open: 'never', outputFolder: 'reports/playwright-html' }],
    ['list'],
    cucumberReporter('html', {
      outputFile: 'reports/cucumber-report.html',
    }),
  ],

  use: {
    /* Base URL for navigations */
    baseURL: config.baseUrl,

    /* Capture screenshot on failure */
    screenshot: config.screenshotOnFailure ? 'only-on-failure' : 'off',

    /* Record trace on first retry */
    trace: 'on-first-retry',

    /* Record video on failure */
    video: config.recordVideo ? 'on-first-retry' : 'off',

    /* Viewport */
    viewport: config.viewport,

    /* Action timeout */
    actionTimeout: config.actionTimeout,

    /* Navigation timeout */
    navigationTimeout: config.navigationTimeout,
  },

  /* Configure projects for cross-browser testing */
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        headless: !config.headed,
        launchOptions: {
          slowMo: config.slowMo,
        },
      },
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        headless: !config.headed,
      },
    },
    {
      name: 'webkit',
      use: {
        browserName: 'webkit',
        headless: !config.headed,
      },
    },
  ],
});
