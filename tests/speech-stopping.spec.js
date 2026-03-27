import { test, expect } from '@playwright/test';

test.describe('Speech Stops on Navigation', () => {
  test('should stop audio when switching tabs', async ({ page }) => {
    await page.goto('/?chapter=1&lang=pl&mode=learning');
    const playButton = await page.locator('#play-pause-button');
    await playButton.click();

    const tabs = await page.locator('.tab');
    await tabs.nth(1).click();

    await expect(page.locator('text=Test')).toBeVisible();
    const buttonText = await playButton.textContent();
    expect(buttonText.includes('Odsłuchaj tekst')).toBe(true);
  });

  test('should stop audio when switching language', async ({ page }) => {
    await page.goto('/?chapter=1&lang=pl&mode=learning');
    const playButton = await page.locator('#play-pause-button');
    await playButton.click();

    await page.selectOption('#lang-dropdown', 'en');

    await expect(page.locator('text=Learning')).toBeVisible();
    expect(page.url()).toContain('lang=en');
    await page.waitForFunction(() => {
      const btn = document.getElementById('play-pause-button');
      return btn && btn.textContent.includes('Listen to the text');
    });
    const buttonText = await playButton.textContent();
    expect(buttonText.includes('Listen to the text')).toBe(true);
  });

  test('should stop audio when navigating via URL', async ({ page }) => {
    await page.goto('/?chapter=1&lang=pl&mode=learning');
    const playButton = await page.locator('#play-pause-button');
    await playButton.click();

    await page.goto('/?chapter=1&lang=en&mode=learning');
    const newPlayButton = await page.locator('#play-pause-button');

    expect(page.url()).toContain('lang=en');
    expect(page.url()).toContain('chapter=1');
    await page.waitForFunction(() => {
      const btn = document.getElementById('play-pause-button');
      return btn && btn.textContent.includes('Listen to the text');
    });
    const buttonText = await newPlayButton.textContent();
    expect(buttonText.includes('Listen to the text')).toBe(true);
  });

  test('should stop audio when selecting different chapter', async ({ page }) => {
    await page.goto('/?chapter=1&lang=pl&mode=learning');
    const playButton = await page.locator('#play-pause-button');
    await playButton.click();

    await page.goto('/?chapter=2&lang=pl&mode=learning');

    expect(page.url()).toContain('chapter=2');
    const buttonText = await playButton.textContent();
    expect(buttonText.includes('Odsłuchaj')).toBe(true);
  });

  test('should stop audio when going back to chapter list', async ({ page }) => {
    await page.goto('/?chapter=1&lang=pl&mode=learning');
    const playButton = await page.locator('#play-pause-button');
    await playButton.click();

    const backButton = page.locator('#dialogue-container .back-button');
    await backButton.click();

    expect(page.url()).not.toContain('chapter=');
    const buttonText = await playButton.textContent();
    expect(buttonText.includes('Odsłuchaj')).toBe(true);
  });

  test('should stop audio when clicking different chapter', async ({ page }) => {
    await page.goto('/?chapter=1&lang=pl&mode=learning');
    const playButton = await page.locator('#play-pause-button');
    await playButton.click();

    const backButton = page.locator('#dialogue-container .back-button');
    await backButton.click();

    const chapters = page.locator('#chapter-list .chapter-item');
    if (await chapters.count() > 1) {
      await chapters.nth(1).click();
      expect(page.url()).toContain('chapter=2');
      const buttonText = await playButton.textContent();
      expect(buttonText.includes('Odsłuchaj')).toBe(true);
    }
  });
});
