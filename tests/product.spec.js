import { test, expect } from '@playwright/test';
import { TEST_USER } from '../config/testData.js';

test('user can add Apple Juice to basket', async ({ page }) => {
  await page.goto('/#/login');
  await page.getByRole('button', { name: 'Close Welcome Banner' }).click();
  await page.getByLabel('Email').fill(TEST_USER.email);
  await page
    .getByRole('textbox', { name: 'Text field for the login password' })
    .fill(TEST_USER.password);
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  const product = page.locator('mat-card').filter({ hasText: 'Apple Juice' });

  const basketCountBefore = await page
    .locator('.fa-layers-counter')
    .innerText();

  await product.getByRole('button', { name: 'Add to Basket' }).click();

  await expect(page.locator('.fa-layers-counter')).not.toHaveText(
    basketCountBefore,
  );
});

test('Apple Juice displays correct information', async ({ page }) => {
  await page.goto('/#/login');
  await page.getByRole('button', { name: 'Close Welcome Banner' }).click();
  await page.getByLabel('Email').fill(TEST_USER.email);
  await page
    .getByRole('textbox', { name: 'Text field for the login password' })
    .fill(TEST_USER.password);
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  const product = page.locator('mat-card').filter({ hasText: 'Apple Juice' });

  await expect(product).toContainText('Apple Juice (1000ml)');

  await expect(product).toContainText('1.99¤');
});

test('user can open basket', async ({ page }) => {
  await page.goto('/#/login');
  await page.getByRole('button', { name: 'Close Welcome Banner' }).click();
  await page.getByLabel('Email').fill(TEST_USER.email);
  await page
    .getByRole('textbox', { name: 'Text field for the login password' })
    .fill(TEST_USER.password);
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  await page.getByText('Your Basket', { exact: true }).click();

  await expect(
    page.getByText(`Your Basket (${TEST_USER.email})`),
  ).toBeVisible();
});

test('added product is displayed in basket', async ({ page }) => {
  await page.goto('/#/login');
  await page.getByRole('button', { name: 'Close Welcome Banner' }).click();
  await page.getByLabel('Email').fill(TEST_USER.email);
  await page
    .getByRole('textbox', { name: 'Text field for the login password' })
    .fill(TEST_USER.password);
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  const product = page.locator('mat-card').filter({ hasText: 'Apple Juice' });

  await product.getByRole('button', { name: 'Add to Basket' }).click();

  await page.getByText('Your Basket', { exact: true }).click();

  await expect(
    page.getByText('Apple Juice (1000ml)', { exact: true }),
  ).toBeVisible();
});

test('user can remove product from basket', async ({ page }) => {
  await page.goto('/#/login');
  await page.getByRole('button', { name: 'Close Welcome Banner' }).click();

  await page.getByLabel('Email').fill(TEST_USER.email);
  await page
    .getByRole('textbox', { name: 'Text field for the login password' })
    .fill(TEST_USER.password);
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  const product = page.locator('mat-card').filter({ hasText: 'Apple Juice' });

  await product.getByRole('button', { name: 'Add to Basket' }).click();

  await expect(
    page.getByText('Apple Juice (1000ml)', { exact: true }),
  ).toBeVisible();

  await page.getByText('Your Basket', { exact: true }).click();

  await expect(
    page.getByText('Apple Juice (1000ml)', { exact: true }),
  ).toBeVisible();

  const productRow = page
    .getByText('Apple Juice (1000ml)', { exact: true })
    .locator('..');

  await productRow.locator('mat-cell.mat-column-remove button').click();

  await expect(
    page.getByText('Apple Juice (1000ml)', { exact: true }),
  ).not.toBeVisible();
});
