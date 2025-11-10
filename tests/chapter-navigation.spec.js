import { test, expect } from '@playwright/test';

test.describe('Chapter Navigation', () => {
  test('should display chapter list on initial load', async ({ page }) => {
    await page.goto('/?lang=pl&mode=learning');
    const chapterItems = await page.locator('.chapter-item');
    expect(await chapterItems.count()).toBeGreaterThan(0);
  });

  test('should select chapter when clicked in learning mode', async ({ page }) => {
    await page.goto('/?lang=pl&mode=learning');
    const firstChapter = await page.locator('.chapter-item').first();
    await firstChapter.click();

    const dialogContent = await page.locator('#dialogue-content');
    await expect(dialogContent).toBeVisible();
    expect(page.url()).toContain('chapter=1');
  });

  test('should display chapter title when chapter is selected', async ({ page }) => {
    await page.goto('/?lang=pl&mode=learning');
    const firstChapter = await page.locator('.chapter-item').first();
    await firstChapter.click();

    const heading = await page.locator('#dialogue-content h2').first();
    await expect(heading).toBeVisible();
    const text = await heading.textContent();
    expect(text.length).toBeGreaterThan(0);
  });

  test('should go back to chapter list when back button is clicked', async ({ page }) => {
    await page.goto('/?chapter=1&lang=pl&mode=learning');
    const backButton = page.locator('#dialogue-container .back-button');
    await backButton.click();

    const chapterList = page.locator('#chapter-list .chapter-item');
    expect(await chapterList.count()).toBeGreaterThan(0);
    expect(page.url()).not.toContain('chapter=');
  });

  test('should select quiz chapter when clicked in quiz mode', async ({ page }) => {
    await page.goto('/?lang=pl&mode=quiz');
    const firstChapter = page.locator('#quiz-chapter-list .chapter-item').first();
    const hasChapters = await firstChapter.count();
    if (hasChapters > 0) {
      await firstChapter.click();
      expect(page.url()).toContain('chapter=1');
      const quizContent = await page.locator('#quiz-content');
      await expect(quizContent).toBeVisible();
    }
  });

  test('should update URL when selecting different chapters', async ({ page }) => {
    await page.goto('/?lang=pl&mode=learning');
    const chapters = await page.locator('.chapter-item');

    if (await chapters.count() > 1) {
      await chapters.nth(0).click();
      expect(page.url()).toContain('chapter=1');

      await page.goto('/?lang=pl&mode=learning');
      await chapters.nth(1).click();
      expect(page.url()).toContain('chapter=2');
    }
  });

  test('chapter parameter should be 1-indexed', async ({ page }) => {
    await page.goto('/?lang=pl&mode=learning');
    const chapters = await page.locator('.chapter-item');

    if (await chapters.count() > 0) {
      await chapters.first().click();
      expect(page.url()).toMatch(/chapter=1/);
    }
  });
});
