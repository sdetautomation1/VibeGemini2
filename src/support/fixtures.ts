import { test as base, createBdd } from 'playwright-bdd';
import { LoginPage } from '../pages/LoginPage';

/**
 * Custom Fixtures
 * 
 * Extends Playwright's base test with custom Page Object fixtures.
 * This is the heart of the playwright-bdd + POM integration.
 * 
 * Each page object is created as a fixture, which means:
 * - It's automatically instantiated when a step needs it
 * - It gets the correct `page` instance via dependency injection
 * - It's properly cleaned up after each scenario
 * 
 * To add a new Page Object:
 *   1. Create the page class in src/pages/
 *   2. Add it to the CustomFixtures type below
 *   3. Add a fixture definition in test.extend()
 *   4. Export the updated Given/When/Then
 */

// ─── Define your custom fixture types ───────────────────────

type CustomFixtures = {
  loginPage: LoginPage;
  // Add more page objects here as your project grows:
  // homePage: HomePage;
  // dashboardPage: DashboardPage;
};

// ─── Extend base test with custom fixtures ──────────────────

export const test = base.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  // Add more fixture definitions here:
  // homePage: async ({ page }, use) => {
  //   await use(new HomePage(page));
  // },
});

// ─── Export BDD keywords tied to custom fixtures ────────────

export const { Given, When, Then } = createBdd(test);
