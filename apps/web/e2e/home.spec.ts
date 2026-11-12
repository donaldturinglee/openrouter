import {expect, test} from '@playwright/test';

test.describe('Home', () => {
  test('is what the site root serves', async ({page}) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', {name: 'openrouter', level: 1}),
    ).toBeVisible();
  });
});
