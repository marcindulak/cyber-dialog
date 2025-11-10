import { test, expect } from '@playwright/test';

test.describe('Play/Pause/Resume Button', () => {
  test('button should exist on chapter page', async ({ page }) => {
    await page.goto('/?chapter=1&lang=pl&mode=learning');
    const button = await page.locator('#play-pause-button');
    await expect(button).toBeVisible();
  });

  test('button text should show play initially', async ({ page }) => {
    await page.goto('/?chapter=1&lang=pl&mode=learning');
    const button = await page.locator('#play-pause-button');
    const text = await button.textContent();
    expect(text.includes('Odsłuchaj')).toBe(true);
  });

  test('button should be clickable', async ({ page }) => {
    await page.goto('/?chapter=1&lang=pl&mode=learning');
    const button = await page.locator('#play-pause-button');
    const initialText = await button.textContent();

    await button.click();

    const afterClickText = await button.textContent();
    expect(afterClickText).not.toEqual(initialText);
  });

  test('button should not be visible on chapter list', async ({ page }) => {
    await page.goto('/?lang=pl&mode=learning');
    const button = await page.locator('#play-pause-button');
    expect(await button.isVisible()).toBe(false);
  });

  test('button should not be visible in quiz mode without chapter selected', async ({ page }) => {
    await page.goto('/?lang=pl&mode=quiz');
    const button = await page.locator('#play-pause-button');
    expect(await button.isVisible()).toBe(false);
  });

  test('clicking button multiple times should work', async ({ page }) => {
    await page.goto('/?chapter=1&lang=pl&mode=learning');
    const button = await page.locator('#play-pause-button');

    for (let i = 0; i < 3; i++) {
      await button.click();
    }

    await expect(button).toBeVisible();
  });

  test('button text should be consistent with state', async ({ page }) => {
    await page.goto('/?chapter=1&lang=pl&mode=learning');
    const button = await page.locator('#play-pause-button');

    const initialText = await button.textContent();
    expect(initialText.length).toBeGreaterThan(0);

    await button.click();
    await expect(button).toBeVisible();
  });
});
