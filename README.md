# SauceDemo Playwright E2E

End-to-end test automation framework for [SauceDemo](https://www.saucedemo.com/) using Playwright and TypeScript.

## Prerequisites

- Node.js LTS
- npm

## Installation

Install the project dependencies:

```bash
npm install
```

Install the Chromium browser used by the test suite:

```bash
npx playwright install chromium
```

## Environment Variables

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

The `.env` file contains the SauceDemo credentials used by the tests. It is ignored by Git and must not be committed.

Required variables:

```env
STANDARD_USERNAME=
LOCKED_USERNAME=
PASSWORD=
```

All required variables must be set. Playwright stops before running tests and reports the missing variable when one is absent or empty.

## Running Tests

Run the complete test suite:

```bash
npm test
```

Run the login tests only:

```bash
npm run test:login
```

Run tests with the browser visible:

```bash
npm run test:headed
```

Headed tests run sequentially using one worker.

Open Playwright UI mode:

```bash
npm run test:ui
```

List discovered tests without running them:

```bash
npm run test:list
```

Open the HTML report after a test run:

```bash
npm run report
```

Check TypeScript without running tests:

```bash
npm run typecheck
```

## Project Structure

```text
config/env.ts          Environment variable loading and validation
pages/                 Page Object Model classes
tests/                 Test specifications
playwright.config.ts   Playwright configuration
.env.example           Environment variable template
```

## Test Design

The project uses the Page Object Model (POM). Page selectors and user actions belong in the `pages` directory, while test files describe scenarios and assertions.

Environment variables are loaded and validated by `config/env.ts`. The Playwright configuration imports this module before the test suite starts, so missing credentials fail fast with a clear error.