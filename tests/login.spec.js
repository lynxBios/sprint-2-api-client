import { test, expect } from '@playwright/test';
import { INVALID_PASSWORD, TEST_USER } from '../config/testData.js';

const LOGIN_TEST_CASES = [
  {
    name: 'user can log in with valid credentials',
    email: TEST_USER.email,
    password: TEST_USER.password,
    expectedResult: 'success',
  },

  {
    name: 'user cannot log in with invalid password',
    email: TEST_USER.email,
    password: INVALID_PASSWORD,
    expectedResult: 'error',
  },

  {
    name: 'user cannot log in with empty email',
    email: '',
    password: TEST_USER.password,
    expectedResult: 'disabled',
  },
];

for (const testCase of LOGIN_TEST_CASES) {
  test(testCase.name, async ({ page }) => {
    await page.goto('/#/login');
    await page.getByRole('button', { name: 'Close Welcome Banner' }).click();

    await page.getByLabel('Email').fill(testCase.email);
    await page
      .getByRole('textbox', { name: 'Text field for the login password' })
      .fill(testCase.password);

    const loginButton = page.getByRole('button', {
      name: 'Login',
      exact: true,
    });

    if (testCase.expectedResult === 'disabled') {
      await expect(loginButton).toBeDisabled();
      return;
    }

    await loginButton.click();

    if (testCase.expectedResult === 'success') {
      await expect(page).toHaveURL(/#\/search$/);
      return;
    }

    await expect(page.locator('.error')).toHaveText(
      'Invalid email or password.',
    );
  });
}
