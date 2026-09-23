import { test, expect } from '@playwright/test';
import { env } from '../config/env';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(env.STANDARD_USERNAME, env.PASSWORD);

    await expect(page).toHaveURL('/inventory.html');
  });

  test('user can complete a purchase', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.openCart();

    await expect(page).toHaveURL('/cart.html');
    await expect(cartPage.items).toHaveCount(1);

    await cartPage.checkout();

    await expect(page).toHaveURL('/checkout-step-one.html');

    await checkoutPage.fillInformation('Test', 'User', '12345');
    await checkoutPage.continue();

    await expect(page).toHaveURL('/checkout-step-two.html');

    await checkoutPage.finish();

    await expect(page).toHaveURL('/checkout-complete.html');
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('user cannot continue checkout without a first name', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();

    await checkoutPage.fillInformation('', 'User', '12345');
    await checkoutPage.continue();

    await expect(checkoutPage.errorMessage).toHaveText('Error: First Name is required');
  });

  test('user cannot continue checkout without a last name', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();

    await checkoutPage.fillInformation('Test', '', '12345');
    await checkoutPage.continue();

    await expect(checkoutPage.errorMessage).toHaveText('Error: Last Name is required');
  });

  test('user cannot continue checkout without a postal code', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();

    await checkoutPage.fillInformation('Test', 'User', '');
    await checkoutPage.continue();

    await expect(checkoutPage.errorMessage).toHaveText('Error: Postal Code is required');
  });

  test('order total equals item total plus tax', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();

    await checkoutPage.fillInformation('Test', 'User', '12345');
    await checkoutPage.continue();

    const itemTotal = await checkoutPage.getItemTotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();

    expect(total).toBeCloseTo(itemTotal + tax, 2);
  });
});