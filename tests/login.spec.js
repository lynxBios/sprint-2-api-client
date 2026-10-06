import { test, expect } from '@playwright/test';
import { INVALID_PASSWORD, TEST_USER } from '../config/testData.js';

test('user can log in with valid credentials', async ({ page }) => {
  await page.goto('/#/login');
  await page.getByRole('button', { name: 'Close Welcome Banner' }).click();
  await page.getByLabel('Email').fill(TEST_USER.email);
  await page
    .getByRole('textbox', { name: 'Text field for the login password' })
    .fill(TEST_USER.password);
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  await expect(page).toHaveURL(/\/#\/search$/);
});

test('user cannot log in with invalid credentials', async ({ page }) => {
  await page.goto('/#/login');
  await page.getByRole('button', { name: 'Close Welcome Banner' }).click();
  await page.getByLabel('Email').fill(TEST_USER.email);
  await page
    .getByRole('textbox', { name: 'Text field for the login password' })
    .fill(INVALID_PASSWORD);
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  await expect(page.locator('.error')).toHaveText('Invalid email or password.');
});
