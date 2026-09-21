import { test, expect } from '@playwright/test';
import { env } from '../config/env';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';

const standardUsername = env.STANDARD_USERNAME;
const lockedUsername = env.LOCKED_USERNAME;
const password = env.PASSWORD;

const INVALID_CREDENTIALS_MESSAGE = 'Epic sadface: Username and password do not match any user in this service';
const USERNAME_REQUIRED_MESSAGE = 'Epic sadface: Username is required';
const PASSWORD_REQUIRED_MESSAGE = 'Epic sadface: Password is required';
const LOCKED_OUT_MESSAGE = 'Epic sadface: Sorry, this user has been locked out.';
const NOT_LOGGED_IN_MESSAGE = "Epic sadface: You can only access '/inventory.html' when you are logged in.";

test.describe('Login', () => {
  test('user can log in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(standardUsername, password);

    await expect(page).toHaveURL('/inventory.html');
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('locked out user cannot log in', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(lockedUsername, password);

    await expect(loginPage.errorMessage).toHaveText(LOCKED_OUT_MESSAGE);
  });

  test('user cannot log in with invalid username', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('invalid_username', password);

    await expect(loginPage.errorMessage).toHaveText(INVALID_CREDENTIALS_MESSAGE);
  });

  test('user cannot log in with invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(standardUsername, 'invalid_password');

    await expect(loginPage.errorMessage).toHaveText(INVALID_CREDENTIALS_MESSAGE);
  });

  test('user cannot log in without a username', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('', password);

    await expect(loginPage.errorMessage).toHaveText(USERNAME_REQUIRED_MESSAGE);
  });

  test('user cannot log in without a password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(standardUsername, '');

    await expect(loginPage.errorMessage).toHaveText(PASSWORD_REQUIRED_MESSAGE);
  });

  test('unauthenticated user cannot access inventory', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto('/inventory.html');  

    await expect(page).toHaveURL('/');
    await expect(loginPage.errorMessage).toHaveText(NOT_LOGGED_IN_MESSAGE);
  });

  test('user cannot access inventory after logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(standardUsername, password);
    await inventoryPage.logout();

    await expect(page).toHaveURL('/');
    await expect(loginPage.usernameInput).toBeVisible();

    await page.goBack();

    await expect(page).toHaveURL('/');
    await expect(loginPage.errorMessage).toHaveText(NOT_LOGGED_IN_MESSAGE);
  });
});
