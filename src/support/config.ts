/**
 * Environment Configuration
 * 
 * Centralizes all environment-specific settings.
 * Values can be overridden via environment variables.
 */

export const config = {
  /** Base URL of the application under test */
  baseUrl: process.env.BASE_URL || 'https://the-internet.herokuapp.com',

  /** Browser to use: 'chromium' | 'firefox' | 'webkit' */
  browser: (process.env.BROWSER || 'chromium') as 'chromium' | 'firefox' | 'webkit',

  /** Run tests in headed mode (visible browser window) */
  headed: process.env.HEADED === 'true',

  /** Default navigation timeout in milliseconds */
  navigationTimeout: Number(process.env.NAVIGATION_TIMEOUT) || 30000,

  /** Default action timeout in milliseconds */
  actionTimeout: Number(process.env.ACTION_TIMEOUT) || 15000,

  /** Slow down actions by this many milliseconds (useful for debugging) */
  slowMo: Number(process.env.SLOW_MO) || 0,

  /** Viewport dimensions */
  viewport: {
    width: Number(process.env.VIEWPORT_WIDTH) || 1280,
    height: Number(process.env.VIEWPORT_HEIGHT) || 720,
  },

  /** Screenshot on failure */
  screenshotOnFailure: process.env.SCREENSHOT_ON_FAILURE !== 'false',

  /** Record video */
  recordVideo: process.env.RECORD_VIDEO === 'true',

  /** Number of retries on failure */
  retries: Number(process.env.RETRIES) || 0,

  /** Number of parallel workers */
  workers: Number(process.env.WORKERS) || 1,
};
