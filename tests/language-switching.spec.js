import { test, expect } from '@playwright/test';

test.describe('Language Switching', () => {
  test('should switch from Polish to English', async ({ page }) => {
    await page.goto('/?lang=pl&mode=learning');
    await expect(page.locator('text=Nauka')).toBeVisible();

    await page.selectOption('#lang-dropdown', 'en');
    await expect(page.locator('text=Learning')).toBeVisible();
    expect(page.url()).toContain('lang=en');
  });

  test('should switch from English to Polish', async ({ page }) => {
    await page.goto('/?lang=en&mode=learning');
    await expect(page.locator('text=Learning')).toBeVisible();

    await page.selectOption('#lang-dropdown', 'pl');
    await expect(page.locator('text=Nauka')).toBeVisible();
    expect(page.url()).toContain('lang=pl');
  });

  test('should preserve chapter when switching language', async ({ page }) => {
    await page.goto('/?chapter=1&lang=pl&mode=learning');
    const polishContent = await page.locator('h2').first().textContent();

    await page.selectOption('#lang-dropdown', 'en');
    await page.selectOption('#lang-dropdown', 'pl');

    expect(page.url()).toContain('chapter=1');
    expect(page.url()).toContain('lang=pl');
  });

  test('should preserve mode when switching language', async ({ page }) => {
    await page.goto('/?lang=pl&mode=quiz');
    await expect(page.locator('text=Test')).toBeVisible();

    await page.selectOption('#lang-dropdown', 'en');
    await expect(page.locator('text=Quiz')).toBeVisible();
    expect(page.url()).toContain('mode=quiz');
    expect(page.url()).toContain('lang=en');
  });

  test('should stop audio when switching language', async ({ page }) => {
    await page.goto('/?chapter=1&lang=pl&mode=learning');
    await page.click('#play-pause-button');
    await page.selectOption('#lang-dropdown', 'en');
    await expect(page.locator('text=Learning')).toBeVisible();
  });

  test('should render quiz content in new language when switching', async ({ page }) => {
    await page.goto('/?chapter=1&lang=en&mode=quiz');
    await expect(page.locator('text=Quiz')).toBeVisible();
    const englishQuestion = await page.locator('.question-text').first().textContent();

    await page.selectOption('#lang-dropdown', 'pl');
    await expect(page.locator('text=Test')).toBeVisible();
    await expect(page.locator('h2:has-text("Temat 1")')).toBeVisible();

    const polishQuestion = await page.locator('.question-text').first().textContent();
    expect(polishQuestion).not.toBe(englishQuestion);

    expect(page.url()).toContain('lang=pl');
    expect(page.url()).toContain('mode=quiz');
  });
});
