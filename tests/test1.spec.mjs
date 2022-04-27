import { test, expect } from '@playwright/test';
test('test1', async ({ page }) => {
    await page.goto('./tests/test1.html');
    const form = page.locator('form');
    await expect(form).toHaveClass('invalid');
});
