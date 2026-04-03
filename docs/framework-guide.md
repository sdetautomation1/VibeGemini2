# 🧪 BDD Cucumber Framework with Playwright + TypeScript + POM

## Complete Framework Guide

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Prerequisites](#2-prerequisites)
3. [Installation & Setup](#3-installation--setup)
4. [Project Structure](#4-project-structure)
5. [Component Deep Dives](#5-component-deep-dives)
   - [What is BDD?](#51-what-is-bdd-behavior-driven-development)
   - [Gherkin Syntax](#52-gherkin-syntax)
   - [playwright-bdd Integration](#53-playwright-bdd-integration)
   - [Playwright Fixtures](#54-playwright-fixtures--custom-fixtures)
   - [Page Object Model (POM)](#55-page-object-model-pom)
   - [Step Definitions](#56-step-definitions)
   - [Configuration](#57-configuration)
6. [Running Tests](#6-running-tests)
7. [Reporting](#7-reporting)
8. [Writing New Tests — Step by Step](#8-writing-new-tests--step-by-step)
9. [Tags & Filtering](#9-tags--filtering)
10. [Best Practices](#10-best-practices)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        Test Execution                            │
│                                                                  │
│  ┌────────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │  Feature Files  │───▶│  playwright-  │───▶│  Playwright     │  │
│  │  (.feature)     │    │  bdd (bddgen)│    │  Test Runner     │  │
│  │  Gherkin syntax │    │  Generates   │    │  Executes tests  │  │
│  └────────────────┘    │  spec files  │    │  in browsers     │  │
│                         └──────────────┘    └────────┬─────────┘  │
│                                                      │            │
│  ┌────────────────┐    ┌──────────────┐              │            │
│  │  Step           │───▶│  Fixtures    │◀─────────────┘            │
│  │  Definitions    │    │  (DI Layer)  │                           │
│  │  (.steps.ts)    │    └──────┬───────┘                           │
│  └────────────────┘           │                                   │
│                                │                                   │
│  ┌────────────────┐    ┌──────▼───────┐    ┌──────────────────┐  │
│  │  Page Objects   │◀───│  Page        │───▶│  Browser         │  │
│  │  (POM classes)  │    │  Instance    │    │  (Chromium/FF/WK)│  │
│  └────────────────┘    └──────────────┘    └──────────────────┘  │
│                                                                  │
│  ┌────────────────┐    ┌──────────────┐                          │
│  │  Config         │    │  Utils       │                          │
│  │  (env settings) │    │  (logger...) │                          │
│  └────────────────┘    └──────────────┘                          │
└──────────────────────────────────────────────────────────────────┘
```

### How It All Connects

| Layer | Role | Files |
|-------|------|-------|
| **Feature Files** | Business-readable test scenarios in Gherkin | `src/features/*.feature` |
| **Step Definitions** | Map Gherkin steps to TypeScript code | `src/steps/*.steps.ts` |
| **Fixtures** | Dependency injection for Page Objects | `src/support/fixtures.ts` |
| **Page Objects** | Encapsulate page-specific locators & actions | `src/pages/*.ts` |
| **Config** | Environment & browser settings | `src/support/config.ts` |
| **playwright-bdd** | Converts features → Playwright specs | `playwright.config.ts` |
| **Playwright Runner** | Executes tests in real browsers | Built-in |

---

## 2. Prerequisites

| Requirement | Minimum Version | Check Command |
|------------|----------------|---------------|
| **Node.js** | 18.x or higher | `node -v` |
| **npm** | 9.x or higher | `npm -v` |
| **VS Code** | Latest | — |

### Recommended VS Code Extensions

| Extension | Purpose |
|-----------|---------|
| **Cucumber (Gherkin) Full Support** | Syntax highlighting, step navigation, auto-complete for `.feature` files |
| **Playwright Test for VS Code** | Run/debug tests from the editor, pick locators |
| **ESLint** | Code quality and linting |
| **Prettier** | Consistent code formatting |

---

## 3. Installation & Setup

### Step 1: Clone / Open the project
```bash
cd "d:\Software testing\VibeGemini2"
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Install Playwright browsers
```bash
npx playwright install
```
This downloads Chromium, Firefox, and WebKit browsers.

### Step 4: Generate BDD specs (first-time)
```bash
npx bddgen
```
This converts your `.feature` files into Playwright test specs in the `.features-gen/` directory.

### Step 5: Run tests
```bash
npm test
```

---

## 4. Project Structure

```
VibeGemini2/
├── 📄 package.json                 # Dependencies & npm scripts
├── 📄 tsconfig.json                # TypeScript compiler options
├── 📄 playwright.config.ts         # Playwright + BDD configuration
├── 📄 .gitignore                   # Files to exclude from Git
│
├── 📂 src/
│   ├── 📂 features/                # 🥒 Gherkin feature files
│   │   └── 📄 login.feature        #    Login test scenarios
│   │
│   ├── 📂 steps/                   # 📝 Step definition files
│   │   └── 📄 login.steps.ts       #    Login step implementations
│   │
│   ├── 📂 pages/                   # 🏗️ Page Object Model classes
│   │   ├── 📄 BasePage.ts          #    Abstract base with common methods
│   │   └── 📄 LoginPage.ts         #    Login page locators & actions
│   │
│   ├── 📂 support/                 # ⚙️ Framework support files
│   │   ├── 📄 fixtures.ts          #    Custom Playwright fixtures (DI)
│   │   └── 📄 config.ts            #    Environment configuration
│   │
│   └── 📂 utils/                   # 🔧 Utility helpers
│       └── 📄 logger.ts            #    Timestamped console logger
│
├── 📂 .features-gen/               # Auto-generated (gitignored)
├── 📂 reports/                     # Test reports (gitignored)
└── 📂 docs/
    └── 📄 framework-guide.md       # This file!
```

---

## 5. Component Deep Dives

### 5.1 What is BDD (Behavior-Driven Development)?

**BDD** bridges the gap between business stakeholders and developers by expressing test cases in natural language that **anyone** can read.

**Traditional Test:**
```typescript
test('login works', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#username', 'tomsmith');
  await page.fill('#password', 'SuperSecretPassword!');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/secure/);
});
```

**BDD Test (Gherkin):**
```gherkin
Scenario: Successful login with valid credentials
  Given I am on the login page
  When I enter username "tomsmith"
  And I enter password "SuperSecretPassword!"
  And I click the login button
  Then I should see the secure area
```

**Benefits:**
- ✅ Readable by non-technical stakeholders
- ✅ Serves as living documentation
- ✅ Encourages collaboration between QA, Dev, and Business
- ✅ Reusable step definitions across scenarios

---

### 5.2 Gherkin Syntax

Gherkin is the language used to write `.feature` files. Here are the key keywords:

| Keyword | Purpose | Example |
|---------|---------|---------|
| `Feature` | Describes the feature being tested | `Feature: Login Functionality` |
| `Scenario` | A single test case | `Scenario: Successful login` |
| `Given` | Precondition / setup | `Given I am on the login page` |
| `When` | Action being performed | `When I click the login button` |
| `Then` | Expected outcome / assertion | `Then I should see the dashboard` |
| `And` / `But` | Continue the previous keyword | `And I enter my password` |
| `Background` | Steps shared by all scenarios in a feature | Runs before each scenario |
| `Scenario Outline` | Data-driven test with Examples table | Runs once per row |
| `Examples` | Data table for Scenario Outlines | Provides test data |
| `@tag` | Tags for filtering and organizing | `@smoke`, `@regression` |

**Example — Scenario Outline (Data-Driven):**
```gherkin
Scenario Outline: Login with invalid credentials
  When I enter username "<username>"
  And I enter password "<password>"
  Then I should see error "<error_message>"

  Examples:
    | username  | password  | error_message            |
    | wronguser | pass123   | Your username is invalid |
    | admin     | wrongpass | Your password is invalid |
```

---

### 5.3 playwright-bdd Integration

**`playwright-bdd`** is the bridge between Cucumber's Gherkin syntax and Playwright's test runner. Here's how it works:

```
Feature Files (.feature)
        │
        ▼
   npx bddgen          ← Generates Playwright spec files
        │
        ▼
.features-gen/*.spec.js  ← Auto-generated (don't edit these!)
        │
        ▼
Playwright Test Runner   ← Executes with full Playwright power
```

**Why this approach?**
- 🚀 You get Playwright's **parallel execution**, **trace viewer**, **auto-waiting**
- 📊 Both Playwright HTML and Cucumber HTML reports
- 🔧 Native Playwright fixtures for dependency injection
- 🧩 No need for a custom World class or manual browser lifecycle

**Configuration in `playwright.config.ts`:**
```typescript
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'src/features/**/*.feature',   // Where to find feature files
  steps: 'src/steps/**/*.ts',              // Where to find step definitions
  importTestFrom: 'src/support/fixtures.ts', // Custom fixtures file
});
```

---

### 5.4 Playwright Fixtures & Custom Fixtures

Fixtures are Playwright's **dependency injection** system. They automatically create and clean up resources for each test.

**How Fixtures Work:**

```typescript
// src/support/fixtures.ts

import { test as base, createBdd } from 'playwright-bdd';
import { LoginPage } from '../pages/LoginPage';

// 1. Define fixture types
type CustomFixtures = {
  loginPage: LoginPage;
};

// 2. Extend base test with your fixtures
export const test = base.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    // Setup: create the page object
    const loginPage = new LoginPage(page);
    // Provide it to the test
    await use(loginPage);
    // Teardown runs automatically after test
  },
});

// 3. Export BDD keywords tied to your fixtures
export const { Given, When, Then } = createBdd(test);
```

**In Step Definitions:**
```typescript
// loginPage is automatically injected!
Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.navigateToLogin();
});
```

**Key Concepts:**
| Concept | Description |
|---------|-------------|
| `base.extend<T>()` | Adds your custom fixtures to Playwright's built-in ones |
| `use()` | Provides the fixture to the test — code after `use()` is teardown |
| `createBdd(test)` | Creates Given/When/Then that can access your custom fixtures |
| `{ page }` | Built-in Playwright fixture — always available |
| `{ loginPage }` | Your custom fixture — auto-instantiated per scenario |

---

### 5.5 Page Object Model (POM)

The **Page Object Model** is a design pattern that creates a class for each page/component of your application. It separates **what** you interact with from **how** you test it.

**Architecture:**

```
BasePage (abstract)
  ├── Common methods: navigate(), click(), fill(), getText()
  ├── Holds the `page` instance
  │
  ├── LoginPage extends BasePage
  │     ├── Locators: usernameInput, passwordInput, loginButton
  │     └── Methods: enterUsername(), enterPassword(), login()
  │
  ├── HomePage extends BasePage (you add this)
  │     ├── Locators: searchBar, navMenu, profileIcon
  │     └── Methods: searchFor(), clickProfile()
  │
  └── DashboardPage extends BasePage (you add this)
       ├── Locators: statsChart, settingsButton
       └── Methods: getStats(), openSettings()
```

**Rules of POM:**
1. ✅ **Encapsulate locators** — Define them in the constructor, not in step definitions
2. ✅ **Use user-facing locators** — `getByRole()`, `getByLabel()`, `getByTestId()`
3. ✅ **Single-responsibility methods** — `enterUsername()`, NOT `fillFormAndSubmit()`
4. ❌ **NO assertions in page objects** — Return data, let step definitions assert
5. ✅ **Extend BasePage** — Reuse common interaction methods

**Example — BasePage:**
```typescript
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async navigate(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async fillInput(locator: Locator, value: string): Promise<void> {
    await locator.clear();
    await locator.fill(value);
  }

  async getText(locator: Locator): Promise<string> {
    return (await locator.textContent()) || '';
  }
}
```

**Example — LoginPage:**
```typescript
export class LoginPage extends BasePage {
  // Locators defined once, used everywhere
  readonly usernameInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#username');
    this.loginButton   = page.getByRole('button', { name: 'Login' });
  }

  // Action method — no assertions!
  async enterUsername(username: string): Promise<void> {
    await this.fillInput(this.usernameInput, username);
  }

  // Data retrieval — caller decides what to assert
  async getFlashMessageText(): Promise<string> {
    return (await this.getText(this.flashMessage)).trim();
  }
}
```

---

### 5.6 Step Definitions

Step definitions are the **glue** between Gherkin steps and TypeScript code.

**File:** `src/steps/login.steps.ts`

```typescript
import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/fixtures';

// Given/When/Then are imported from YOUR fixtures file,
// not directly from playwright-bdd. This gives them access
// to your custom fixtures (loginPage, etc.)

Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.navigateToLogin();
});

When('I enter username {string}', async ({ loginPage }, username: string) => {
  await loginPage.enterUsername(username);
});

Then('I should see the secure area', async ({ page }) => {
  // Assertions live in step definitions, NOT page objects
  await expect(page).toHaveURL(/\/secure/);
});
```

**Parameter Types:**
| Gherkin Syntax | TypeScript Type | Example |
|----------------|-----------------|---------|
| `{string}` | `string` | `"tomsmith"` |
| `{int}` | `number` | `42` |
| `{float}` | `number` | `3.14` |
| `{word}` | `string` | `admin` (no quotes) |

**Best Practices:**
- Keep steps **atomic** (one action or assertion per step)
- Make steps **reusable** across multiple features
- Use **descriptive step text** that reads like plain English
- Import `Given`/`When`/`Then` from **your fixtures file**, not from `playwright-bdd`

---

### 5.7 Configuration

**Environment Configuration (`src/support/config.ts`):**

All settings can be overridden via environment variables:

| Setting | Env Variable | Default |
|---------|-------------|---------|
| Base URL | `BASE_URL` | `https://the-internet.herokuapp.com` |
| Browser | `BROWSER` | `chromium` |
| Headed mode | `HEADED` | `false` |
| Nav timeout | `NAVIGATION_TIMEOUT` | `30000` |
| Action timeout | `ACTION_TIMEOUT` | `15000` |
| Slow motion | `SLOW_MO` | `0` |
| Viewport width | `VIEWPORT_WIDTH` | `1280` |
| Viewport height | `VIEWPORT_HEIGHT` | `720` |
| Retries | `RETRIES` | `0` |
| Workers | `WORKERS` | `1` |

**Example — Run with custom settings:**
```bash
# Run headed with slow motion for debugging
HEADED=true SLOW_MO=500 npm test

# Run against staging environment
BASE_URL=https://staging.myapp.com npm test

# Run with 4 parallel workers
WORKERS=4 npm test
```

---

## 6. Running Tests

### Common Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests on Chromium (headless) |
| `npm run test:headed` | Run with visible browser window |
| `npm run test:firefox` | Run on Firefox |
| `npm run test:webkit` | Run on WebKit (Safari) |
| `npm run test:all-browsers` | Run on all 3 browsers |
| `npm run test:smoke` | Run only `@smoke` tagged scenarios |
| `npm run test:negative` | Run only `@negative` tagged scenarios |
| `npm run test:debug` | Run with Playwright Inspector (step-by-step) |
| `npm run report` | Open the HTML report |
| `npm run bddgen` | Regenerate specs (without running) |
| `npm run typecheck` | Check TypeScript types |

### Advanced CLI Usage

```bash
# Run a specific feature file
npx bddgen && npx playwright test login

# Run with grep pattern
npx bddgen && npx playwright test --grep "Successful login"

# Run with trace recording enabled
npx bddgen && npx playwright test --trace on

# Run with specific number of workers
npx bddgen && npx playwright test --workers=4

# Run and update snapshots
npx bddgen && npx playwright test --update-snapshots
```

---

## 7. Reporting

This framework generates **two types of reports** simultaneously:

### 1. Playwright HTML Report
- **Location:** `reports/playwright-html/`
- **Open:** `npm run report`
- **Features:** Interactive, filterable, includes screenshots/traces/videos

### 2. Cucumber HTML Report
- **Location:** `reports/cucumber-report.html`
- **Open:** Open the file in any browser
- **Features:** Classic BDD-style report with feature/scenario breakdown

### Screenshots
- Automatically captured on test **failure**
- Stored in `test-results/` folder
- Viewable in the HTML report

### Trace Viewer
- Recorded on first retry (configurable)
- Open with: `npx playwright show-trace <path-to-trace.zip>`
- Shows every action, network request, and DOM snapshot

---

## 8. Writing New Tests — Step by Step

Let's walk through adding a **new feature** (e.g., a Shopping Cart feature):

### Step 1: Create the Page Object

```typescript
// src/pages/CartPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly totalPrice: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart-item');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.totalPrice = page.locator('.total-price');
  }

  async navigateToCart(): Promise<void> {
    await this.navigate('/cart');
  }

  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getTotalPrice(): Promise<string> {
    return await this.getText(this.totalPrice);
  }

  async clickCheckout(): Promise<void> {
    await this.clickElement(this.checkoutButton);
  }
}
```

### Step 2: Register the Fixture

```typescript
// src/support/fixtures.ts — ADD to existing file:
import { CartPage } from '../pages/CartPage';

type CustomFixtures = {
  loginPage: LoginPage;
  cartPage: CartPage;    // ← Add this
};

export const test = base.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  cartPage: async ({ page }, use) => {     // ← Add this
    await use(new CartPage(page));
  },
});
```

### Step 3: Write the Feature File

```gherkin
# src/features/cart.feature
@cart
Feature: Shopping Cart

  Scenario: View items in cart
    Given I have items in my cart
    When I navigate to the cart page
    Then I should see 3 items in the cart
    And the total price should be "$45.00"
```

### Step 4: Implement Step Definitions

```typescript
// src/steps/cart.steps.ts
import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/fixtures';

Given('I have items in my cart', async ({ page }) => {
  // Setup: add items via API or UI
});

When('I navigate to the cart page', async ({ cartPage }) => {
  await cartPage.navigateToCart();
});

Then('I should see {int} items in the cart', async ({ cartPage }, count: number) => {
  const itemCount = await cartPage.getItemCount();
  expect(itemCount).toBe(count);
});

Then('the total price should be {string}', async ({ cartPage }, price: string) => {
  const total = await cartPage.getTotalPrice();
  expect(total).toContain(price);
});
```

### Step 5: Run

```bash
npm test
```

---

## 9. Tags & Filtering

Tags allow you to organize and selectively run scenarios.

### Defining Tags (in .feature files)

```gherkin
@smoke              ← Feature-level tag (applies to ALL scenarios)
Feature: Login

  @positive          ← Scenario-level tag
  Scenario: Valid login
    ...

  @negative @critical ← Multiple tags on one scenario
  Scenario: Invalid login
    ...
```

### Running by Tag

```bash
# Run smoke tests only
npm run test:smoke

# Run with custom grep
npx bddgen && npx playwright test --grep "@smoke"

# Run negative tests
npx bddgen && npx playwright test --grep "@negative"

# Exclude a tag
npx bddgen && npx playwright test --grep-invert "@slow"
```

### Recommended Tagging Strategy

| Tag | Purpose |
|-----|---------|
| `@smoke` | Critical path tests, run on every commit |
| `@regression` | Full regression suite |
| `@positive` | Happy path scenarios |
| `@negative` | Error/edge case scenarios |
| `@wip` | Work in progress (skip in CI) |
| `@data-driven` | Scenario Outlines with Examples |
| `@api` | Tests that use API setup |

---

## 10. Best Practices

### Locators
- ✅ **Prefer** `getByRole()`, `getByLabel()`, `getByTestId()`
- ❌ **Avoid** brittle CSS selectors like `.btn-primary > span:nth-child(2)`
- ❌ **Avoid** XPath unless absolutely necessary

### Test Isolation
- ✅ Each scenario should be **independent** — never rely on another scenario's state
- ✅ Use `Background` for shared setup within a feature
- ✅ Use API calls for test data setup when possible (faster than UI)

### Step Definitions
- ✅ Keep steps **atomic** — one action per step
- ✅ Make steps **reusable** — parameterize with `{string}`, `{int}`, etc.
- ❌ Don't put business logic in step definitions — delegate to page objects

### Page Objects
- ✅ One page object per page/major component
- ✅ Extend `BasePage` for common methods
- ❌ Never assert inside page objects
- ✅ Return data, let steps assert

### Performance
- ❌ **Never** use `page.waitForTimeout()` — rely on Playwright's auto-waiting
- ✅ Use `waitForLoadState('networkidle')` only when necessary
- ✅ Set up test data via API instead of UI when possible

### CI/CD
- ✅ Run with `--retries=2` in CI to handle flaky network conditions
- ✅ Capture traces on first retry: `trace: 'on-first-retry'`
- ✅ Use workers for parallel execution: `--workers=4`
- ✅ Set `forbidOnly: true` in CI to prevent accidental `.only` commits

---

## 11. Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| `Cannot find module 'playwright-bdd'` | Run `npm install` |
| `No tests found` | Run `npx bddgen` first to generate specs |
| `Step not found / undefined` | Ensure step text matches exactly between `.feature` and `.steps.ts` |
| `Browser not found` | Run `npx playwright install` |
| `Timeout exceeded` | Increase timeout in `playwright.config.ts` or check locators |
| `Import error in fixtures.ts` | Ensure paths are correct and page object is exported |
| `Type errors` | Run `npm run typecheck` to see full TypeScript errors |

### Debugging Tips

1. **Playwright Inspector:** `npm run test:debug` — Steps through tests interactively
2. **Headed mode:** `npm run test:headed` — Watch the browser
3. **Slow motion:** `SLOW_MO=1000 npm run test:headed` — Slow down actions
4. **Trace Viewer:** After a failed test, open the trace file for a full replay
5. **Screenshots:** Check `test-results/` for failure screenshots
6. **VS Code:** Use the Playwright extension to run/debug individual tests

### Getting Help

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [playwright-bdd Documentation](https://vitalets.github.io/playwright-bdd/)
- [Cucumber Documentation](https://cucumber.io/docs/gherkin/)
- [Gherkin Reference](https://cucumber.io/docs/gherkin/reference/)

---

## Quick Reference Card

```bash
# ── Setup ──────────────────────
npm install                    # Install dependencies
npx playwright install         # Install browsers

# ── Run ────────────────────────
npm test                       # Headless, Chromium
npm run test:headed            # Visible browser
npm run test:debug             # Step-by-step debugger
npm run test:all-browsers      # Chromium + Firefox + WebKit

# ── Filter ─────────────────────
npm run test:smoke             # Only @smoke scenarios
npm run test:negative          # Only @negative scenarios

# ── Reports ────────────────────
npm run report                 # Open Playwright HTML report

# ── Utilities ──────────────────
npm run bddgen                 # Regenerate specs only
npm run typecheck              # Verify TypeScript types
```
