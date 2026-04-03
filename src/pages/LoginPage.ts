import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

/**
 * LoginPage — Page Object for the Herokuapp Login page.
 * 
 * URL: https://the-internet.herokuapp.com/login
 * 
 * This page object encapsulates all locators and interactions
 * specific to the login page. It uses Playwright's recommended
 * user-facing locators for stability.
 */
export class LoginPage extends BasePage {
  // ─── Locators ─────────────────────────────────────────────
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly flashMessage: Locator;
  readonly logoutButton: Locator;
  readonly pageHeading: Locator;

  constructor(page: Page) {
    super(page);

    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton   = page.getByRole('button', { name: 'Login' });
    this.flashMessage  = page.locator('#flash');
    this.logoutButton  = page.getByRole('link', { name: 'Logout' });
    this.pageHeading   = page.locator('h2');
  }

  // ─── Page URL ─────────────────────────────────────────────

  private readonly LOGIN_PATH = 'https://the-internet.herokuapp.com/login';

  /** Navigate to the login page */
  async navigateToLogin(): Promise<void> {
    logger.step('Navigating to Login page');
    await this.navigate(this.LOGIN_PATH);
  }

  // ─── Actions ──────────────────────────────────────────────

  /** Enter username into the username field */
  async enterUsername(username: string): Promise<void> {
    logger.step(`Entering username: ${username}`);
    await this.fillInput(this.usernameInput, username);
  }

  /** Enter password into the password field */
  async enterPassword(password: string): Promise<void> {
    logger.step('Entering password: ****');
    await this.fillInput(this.passwordInput, password);
  }

  /** Click the Login button */
  async clickLogin(): Promise<void> {
    logger.step('Clicking Login button');
    await this.clickElement(this.loginButton);
  }

  /** Perform a complete login action */
  async login(username: string, password: string): Promise<void> {
    logger.step(`Logging in as: ${username}`);
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  /** Click the Logout button (after successful login) */
  async clickLogout(): Promise<void> {
    logger.step('Clicking Logout button');
    await this.clickElement(this.logoutButton);
  }

  // ─── Data Retrieval (no assertions here!) ─────────────────

  /** Get the flash message text displayed after login attempt */
  async getFlashMessageText(): Promise<string> {
    await this.waitForElement(this.flashMessage);
    const text = await this.getText(this.flashMessage);
    return text.trim();
  }

  /** Get the page heading text */
  async getHeadingText(): Promise<string> {
    return (await this.getText(this.pageHeading)).trim();
  }

  /** Check if the logout button is visible (indicates successful login) */
  async isLoggedIn(): Promise<boolean> {
    return await this.isVisible(this.logoutButton);
  }
}
