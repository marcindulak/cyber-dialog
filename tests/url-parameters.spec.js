import { test, expect } from '@playwright/test';

test.describe('URL Parameters', () => {
  test('default URL should load with lang=pl and mode=learning', async ({ page }) => {
    await page.goto('/');
    expect(page.url()).toContain('lang=pl');
    expect(page.url()).toContain('mode=learning');
  });

  test('should load Polish learning mode', async ({ page }) => {
    await page.goto('/?lang=pl&mode=learning');
    await expect(page.locator('text=Nauka')).toBeVisible();
    expect(page.url()).toContain('lang=pl');
    expect(page.url()).toContain('mode=learning');
  });

  test('should load English learning mode', async ({ page }) => {
    await page.goto('/?lang=en&mode=learning');
    await expect(page.locator('text=Learning')).toBeVisible();
    expect(page.url()).toContain('lang=en');
    expect(page.url()).toContain('mode=learning');
  });

  test('should load Polish quiz mode', async ({ page }) => {
    await page.goto('/?lang=pl&mode=quiz');
    await expect(page.locator('text=Test')).toBeVisible();
    expect(page.url()).toContain('lang=pl');
    expect(page.url()).toContain('mode=quiz');
  });

  test('should load English quiz mode', async ({ page }) => {
    await page.goto('/?lang=en&mode=quiz');
    await expect(page.locator('text=Quiz')).toBeVisible();
    expect(page.url()).toContain('lang=en');
    expect(page.url()).toContain('mode=quiz');
  });

  test('should load specific chapter with 1-indexed numbering', async ({ page }) => {
    await page.goto('/?chapter=1&lang=pl&mode=learning');
    expect(page.url()).toContain('chapter=1');
    await expect(page.locator('#dialogue-content h2').first()).toBeVisible();
  });

  test('URL parameters should be in alphabetical order', async ({ page }) => {
    await page.goto('/?lang=pl&mode=learning');
    const url = page.url();
    const params = new URL(url).searchParams;
    const keys = Array.from(params.keys()).sort();
    const actualKeys = Array.from(params.keys());
    expect(actualKeys).toEqual(keys);
  });
});
