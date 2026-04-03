import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/fixtures';
import { logger } from '../utils/logger';

/**
 * Login Step Definitions
 * 
 * These steps implement the Gherkin steps defined in login.feature.
 * 
 * Key points:
 * - `loginPage` is injected automatically via Playwright fixtures
 * - `page` is also available as a built-in Playwright fixture
 * - Assertions live HERE, not in the Page Object
 * - Each step should be atomic and reusable
 */

// ─── Given Steps ────────────────────────────────────────────

Given('I am on the login page', async ({ loginPage }) => {
  logger.step('Navigating to login page');
  await loginPage.navigateToLogin();
});

// ─── When Steps ─────────────────────────────────────────────

When('I enter username {string}', async ({ loginPage }, username: string) => {
  await loginPage.enterUsername(username);
});

When('I enter password {string}', async ({ loginPage }, password: string) => {
  await loginPage.enterPassword(password);
});

When('I click the login button', async ({ loginPage }) => {
  await loginPage.clickLogin();
});

When('I click the logout button', async ({ loginPage }) => {
  await loginPage.clickLogout();
});

// ─── Then Steps ─────────────────────────────────────────────

Then('I should see the secure area', async ({ page }) => {
  logger.step('Verifying secure area is displayed');
  await expect(page).toHaveURL(/\/secure/);
});

Then('I should see a success flash message', async ({ loginPage }) => {
  const message = await loginPage.getFlashMessageText();
  logger.info(`Flash message: ${message}`);
  expect(message).toContain('You logged into a secure area!');
});

Then(
  'I should see an error flash message containing {string}',
  async ({ loginPage }, expectedMessage: string) => {
    const message = await loginPage.getFlashMessageText();
    logger.info(`Flash message: ${message}`);
    expect(message).toContain(expectedMessage);
  }
);

Then('I should be on the login page', async ({ page }) => {
  logger.step('Verifying redirect to login page');
  await expect(page).toHaveURL(/\/login/);
});
