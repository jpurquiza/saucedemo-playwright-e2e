import { test, expect } from '@playwright/test';
import { env } from '../config/env';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';

const username = env.STANDARD_USERNAME;
const password = env.PASSWORD;
const lockedUsername = env.LOCKED_USERNAME;

test.describe('Login', () => {
  test('user can log in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(username, password);

    await expect(page).toHaveURL(/inventory.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('locked out user cannot log in', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(lockedUsername, password);

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.',
    );
  });

  test('user cannot log in with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('invalid_user', 'invalid_password');

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username and password do not match any user in this service',
    );
  });

  test('user cannot log in without a username', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('', password);

    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username is required');
  });

  test('user cannot log in without a password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(username, '');

    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Password is required');
  });

  test('unauthenticated user cannot access inventory', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.gotoInventory();

    await expect(page).toHaveURL(/\/$/);
    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: You can only access \'/inventory.html\' when you are logged in.',
    );
  });

  test('user cannot access inventory after logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(username, password);
    await inventoryPage.logout();

    await expect(page).toHaveURL(/\/$/);
    await expect(loginPage.usernameInput).toBeVisible();

    await page.goBack();

    await expect(page).toHaveURL(/\/$/);
    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: You can only access \'/inventory.html\' when you are logged in.',
    );
  });
});
