import { test, expect } from '@playwright/test';
import { env } from '../config/env';
import { CartPage } from '../pages/cart.page';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(env.STANDARD_USERNAME, env.PASSWORD);

    await expect(page).toHaveURL('/inventory.html');
  });

  test('user can add a product to the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addToCart('sauce-labs-backpack');

    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.openCart();

    await expect(page).toHaveURL('/cart.html');
    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.itemNames).toHaveText(['Sauce Labs Backpack']);
  });

  test('user can add multiple products to the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.addToCart('sauce-labs-bike-light');
    await inventoryPage.addToCart('sauce-labs-bolt-t-shirt');

    await expect(inventoryPage.cartBadge).toHaveText('3');
  });

  test('user can remove a product from the inventory page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.addToCart('sauce-labs-bike-light');

    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.removeFromCart('sauce-labs-backpack');

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('user can remove a product from the cart page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.addToCart('sauce-labs-bike-light');
    await inventoryPage.openCart();

    await expect(cartPage.items).toHaveCount(2);

    await cartPage.removeItem('sauce-labs-backpack');

    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.itemNames).toHaveText(['Sauce Labs Bike Light']);
  });

  test('user can return to the inventory page from the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.openCart();
    await cartPage.continueShopping();

    await expect(page).toHaveURL('/inventory.html');
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
});