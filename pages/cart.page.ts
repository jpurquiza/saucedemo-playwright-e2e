import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.items = page.locator('[data-test="inventory-item"]');
    this.itemNames = this.items.locator('[data-test="inventory-item-name"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async removeItem(productId: string): Promise<void> {
    await this.page.locator(`[data-test="remove-${productId}"]`).click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}