import { Page, Locator } from '@playwright/test';
import { logger } from '../utils/logger';

/**
 * BasePage — Abstract base class for all Page Objects.
 * 
 * Encapsulates common browser interactions and provides a consistent
 * interface for derived page classes. All page objects should extend this class.
 * 
 * Design Principles:
 * - No assertions inside page objects (keep them in step definitions)
 * - Methods return data or perform actions only
 * - Use Playwright's user-facing locators (getByRole, getByLabel, getByTestId)
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  // ─── Navigation ───────────────────────────────────────────

  /** Navigate to a specific path relative to the base URL */
  async navigate(path: string): Promise<void> {
    const url = path.startsWith('http') ? path : path;
    logger.step(`Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /** Wait for page to reach a stable load state */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /** Get the current page title */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /** Get the current page URL */
  getCurrentUrl(): string {
    return this.page.url();
  }

  // ─── Element Interactions ─────────────────────────────────

  /** Click on an element */
  async clickElement(locator: Locator): Promise<void> {
    logger.debug(`Clicking element`);
    await locator.click();
  }

  /** Fill a text input with a value */
  async fillInput(locator: Locator, value: string): Promise<void> {
    logger.debug(`Filling input with: ${value}`);
    await locator.clear();
    await locator.fill(value);
  }

  /** Get visible text from an element */
  async getText(locator: Locator): Promise<string> {
    return (await locator.textContent()) || '';
  }

  /** Check if an element is visible */
  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /** Wait for an element to be visible */
  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  // ─── Dropdown / Select ────────────────────────────────────

  /** Select an option from a dropdown by its visible text */
  async selectByText(locator: Locator, text: string): Promise<void> {
    logger.debug(`Selecting option: ${text}`);
    await locator.selectOption({ label: text });
  }

  /** Select an option from a dropdown by its value attribute */
  async selectByValue(locator: Locator, value: string): Promise<void> {
    await locator.selectOption({ value });
  }

  // ─── Keyboard & Mouse ────────────────────────────────────

  /** Press a keyboard key */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /** Hover over an element */
  async hoverElement(locator: Locator): Promise<void> {
    await locator.hover();
  }

  // ─── Screenshots ──────────────────────────────────────────

  /** Take a screenshot of the current page */
  async takeScreenshot(name: string): Promise<Buffer> {
    logger.info(`Taking screenshot: ${name}`);
    return await this.page.screenshot({
      path: `reports/screenshots/${name}.png`,
      fullPage: true,
    });
  }
}
