import { test, expect } from '@playwright/test';
import { TEST_USER } from '../config/testData.js';
import { LoginPage } from '../pages/LoginPage.js';
import { ProductsPage } from '../pages/ProductsPage.js';
import { BasketPage } from '../pages/BasketPage.js';
import { applicationSetup } from '../utils/applicationSetup.js';

const APPLE_JUICE = 'Apple Juice';
const APPLE_JUICE_IN_BASKET = 'Apple Juice (1000ml)';
const APPLE_JUICE_PRICE = '1.99¤';

test.beforeEach(async ({ page }) => {
  await page.goto('/#/login');
  await applicationSetup(page);

  const loginPage = new LoginPage(page);
  await loginPage.login(TEST_USER.email, TEST_USER.password);
});

test('user can add Apple Juice to basket', async ({ page }) => {
  const productsPage = new ProductsPage(page);

  const basketCountBefore = await page
    .locator('.fa-layers-counter')
    .innerText();

  await productsPage.addProductToBasket(APPLE_JUICE);

  await expect(page.locator('.fa-layers-counter')).not.toHaveText(
    basketCountBefore,
  );
});

test('Apple Juice displays correct information', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const product = productsPage.findProduct(APPLE_JUICE);

  await expect(product).toContainText(APPLE_JUICE_IN_BASKET);
  await expect(product).toContainText(APPLE_JUICE_PRICE);
});

test('user can open basket', async ({ page }) => {
  const basketPage = new BasketPage(page);

  await basketPage.open();

  await expect(
    page.getByText(`Your Basket (${TEST_USER.email})`),
  ).toBeVisible();
});

test('added product is displayed in basket', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const basketPage = new BasketPage(page);

  await productsPage.addProductToBasket(APPLE_JUICE);
  await basketPage.open();

  await expect(basketPage.getProductRow(APPLE_JUICE_IN_BASKET)).toBeVisible();
});

test('user can remove product from basket', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const basketPage = new BasketPage(page);

  await productsPage.addProductToBasket(APPLE_JUICE);
  await basketPage.open();

  await expect(basketPage.getProductRow(APPLE_JUICE_IN_BASKET)).toBeVisible();

  await basketPage.removeProduct(APPLE_JUICE_IN_BASKET);

  await expect(
    basketPage.getProductRow(APPLE_JUICE_IN_BASKET),
  ).not.toBeVisible();
});
