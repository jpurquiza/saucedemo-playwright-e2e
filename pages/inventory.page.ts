import { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  async addToCart(productId: string): Promise<void> {
    await this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}