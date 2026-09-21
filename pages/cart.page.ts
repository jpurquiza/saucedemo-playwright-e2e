import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly items: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.items = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}