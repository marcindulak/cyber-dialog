import { test, expect } from '@playwright/test';

test.describe('Tab Switching', () => {
  test('should switch from Learning to Quiz tab', async ({ page }) => {
    await page.goto('/?lang=pl&mode=learning');
    await expect(page.locator('text=Nauka')).toBeVisible();

    const tabs = await page.locator('.tab');
    await tabs.nth(1).click();

    await expect(page.locator('text=Test')).toBeVisible();
    expect(page.url()).toContain('mode=quiz');
    await expect(tabs.nth(1)).toHaveClass(/active/);
    await expect(page.locator('#quiz-tab')).toHaveClass(/active/);
    await expect(tabs.nth(0)).not.toHaveClass(/active/);
    await expect(page.locator('#learn-tab')).not.toHaveClass(/active/);
  });

  test('should switch from Quiz to Learning tab', async ({ page }) => {
    await page.goto('/?lang=pl&mode=quiz');
    await expect(page.locator('text=Test')).toBeVisible();

    const tabs = await page.locator('.tab');
    await tabs.nth(0).click();

    await expect(page.locator('text=Nauka')).toBeVisible();
    expect(page.url()).toContain('mode=learning');
    await expect(tabs.nth(0)).toHaveClass(/active/);
    await expect(page.locator('#learn-tab')).toHaveClass(/active/);
    await expect(tabs.nth(1)).not.toHaveClass(/active/);
    await expect(page.locator('#quiz-tab')).not.toHaveClass(/active/);
  });

  test('should update URL when switching tabs', async ({ page }) => {
    await page.goto('/?lang=pl&mode=learning');
    const tabs = await page.locator('.tab');

    await tabs.nth(1).click();
    expect(page.url()).toContain('mode=quiz');
    await expect(tabs.nth(1)).toHaveClass(/active/);
    await expect(page.locator('#quiz-tab')).toHaveClass(/active/);

    await tabs.nth(0).click();
    expect(page.url()).toContain('mode=learning');
    await expect(tabs.nth(0)).toHaveClass(/active/);
    await expect(page.locator('#learn-tab')).toHaveClass(/active/);
  });

  test('should remove chapter parameter when switching tabs', async ({ page }) => {
    await page.goto('/?chapter=1&lang=pl&mode=learning');
    expect(page.url()).toContain('chapter=1');

    const tabs = await page.locator('.tab');
    await tabs.nth(1).click();

    expect(page.url()).not.toContain('chapter=');
    await expect(tabs.nth(1)).toHaveClass(/active/);
    await expect(page.locator('#quiz-tab')).toHaveClass(/active/);
  });
});
