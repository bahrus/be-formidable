import { test, expect } from '@playwright/test';
test('test1', async ({ page }) => {
    await page.goto('./tests/test1.html');
    //   const title = page.locator('.navbar__inner .navbar__title');
    //   await expect(title).toHaveText('Playwright');
    const form = page.locator('form');
    await expect(form).toHaveClass('invalidx');
});
