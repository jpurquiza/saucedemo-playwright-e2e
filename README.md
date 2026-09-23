# SauceDemo Playwright E2E

[![Playwright Tests](https://github.com/jpurquiza/saucedemo-playwright-e2e/actions/workflows/playwright.yml/badge.svg)](https://github.com/jpurquiza/saucedemo-playwright-e2e/actions/workflows/playwright.yml)

End-to-end test automation framework for [SauceDemo](https://www.saucedemo.com/), built with Playwright and TypeScript and executed automatically on GitHub Actions.

## Highlights

- **Page Object Model:** selectors and user actions live in page classes, and test files only describe scenarios and assertions.
- **Fail-fast configuration:** environment variables are loaded and validated in a single typed module before any test runs.
- **Continuous integration:** tests run on every push and pull request, and the HTML report is uploaded as a build artifact.
- **No hardcoded credentials:** values are read from environment variables locally and from GitHub variables and secrets in CI.

## Test Coverage

Full scenario list in [`docs/test-coverage.md`](docs/test-coverage.md).


## Tech Stack

Playwright · TypeScript · Node.js · GitHub Actions

## Getting Started

### Prerequisites

- Node.js 24 (LTS)
- npm

### Installation

```bash
npm install
npx playwright install chromium
```

On Linux, if the browser fails to start because of missing system libraries, use `npx playwright install --with-deps chromium` instead.

### Environment Variables

```bash
cp .env.example .env
```

| Variable            | Description                                  |
| ------------------- | -------------------------------------------- |
| `STANDARD_USERNAME` | User that can log in normally                |
| `LOCKED_USERNAME`   | User that is locked out                      |
| `PASSWORD`          | Password shared by the SauceDemo demo users  |

SauceDemo is a public demo site and its credentials are listed on its own login page, so these values are not real secrets. They are still read from environment variables to keep the framework configurable and to follow the same practice used in real projects. The `.env` file is ignored by Git and must not be committed.

All variables are required. Playwright stops before running any test and reports the missing variable when one is absent or empty.

## Running Tests

```bash
npm run test
```

Opens the HTML report of the last run:

```bash
npm run report
```

More commands (running a single suite, headed mode, UI mode, type checking) are in `package.json`.

## Project Structure

```text
saucedemo-playwright-e2e/
├── .github/workflows/playwright.yml   # CI pipeline (GitHub Actions)
├── config/env.ts                      # Environment variable loading and validation
├── docs/                              # Test coverage
├── pages/                             # Page Object Model classes
├── tests/                             # Test specifications
├── .env.example                       # Environment variable template
└── playwright.config.ts               # Playwright configuration
```

## Continuous Integration

Runs on every push and pull request to `main`, and can also be started manually from the Actions tab. To run it on your own fork, add the following in **Settings → Secrets and variables → Actions**:

| Type     | Name                |
| -------- | ------------------- |
| Variable | `STANDARD_USERNAME` |
| Variable | `LOCKED_USERNAME`   |
| Secret   | `SAUCE_PASSWORD`    |

## Design Decisions

- **Page Object Model:** keeps selectors in one place, so a UI change means updating a page class instead of every test.
- **Centralized environment handling:** `config/env.ts` validates and exports typed values. The Playwright configuration imports it before the suite starts, so a missing credential fails immediately with a clear error instead of an obscure failure in the middle of a test.
- **Pinned CI environment:** the workflow fixes the Node.js and Ubuntu versions so pipeline runs stay predictable.

## Author

Juan Pablo Urquiza · [LinkedIn](https://www.linkedin.com/in/juan-pablo-urquiza/)