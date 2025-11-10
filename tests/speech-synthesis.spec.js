import { test, expect } from '@playwright/test';

test.describe('Speech Synthesis', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.speechSynthesisCalls = [];
      window.speechSynthesisCancelCalls = 0;

      const synth = window.speechSynthesis;
      const proto = Object.getPrototypeOf(synth);

      // WebKit-specific: In WebKit, speak() and cancel() methods are on the prototype
      // (SpeechSynthesis.prototype), not on the instance (window.speechSynthesis).
      // This differs from Chromium/Firefox where methods can be wrapped on the instance.
      // We must wrap the prototype methods, not the instance properties.
      // Verified with:
      //   synth.hasOwnProperty('speak') === false
      //   proto.hasOwnProperty('speak') === true
      const originalSpeak = proto.speak;
      const originalCancel = proto.cancel;

      Object.defineProperty(proto, 'speak', {
        value: function(utterance) {
          window.speechSynthesisCalls.push({
            text: utterance.text,
            lang: utterance.lang
          });
          originalSpeak.call(this, utterance);
        },
        writable: true,
        configurable: true
      });

      Object.defineProperty(proto, 'cancel', {
        value: function() {
          window.speechSynthesisCancelCalls++;
          originalCancel.call(this);
        },
        writable: true,
        configurable: true
      });
    });
  });

  test('should call speechSynthesis.speak when play button is clicked', async ({ page }) => {
    await page.goto('/?chapter=1&lang=pl&mode=learning');
    const playButton = await page.locator('#play-pause-button');

    await playButton.click();

    const calls = await page.evaluate(() => window.speechSynthesisCalls);
    expect(calls.length).toBeGreaterThan(0);
  });

  test('should queue multiple utterances for dialogue lines', async ({ page }) => {
    await page.goto('/?chapter=1&lang=pl&mode=learning');
    const playButton = await page.locator('#play-pause-button');

    await playButton.click();

    const calls = await page.evaluate(() => window.speechSynthesisCalls);
    expect(calls.length).toBeGreaterThan(5);
  });

  test('should use correct language for Polish', async ({ page }) => {
    await page.goto('/?chapter=1&lang=pl&mode=learning');
    const playButton = await page.locator('#play-pause-button');

    await playButton.click();

    const calls = await page.evaluate(() => window.speechSynthesisCalls);
    expect(calls.length).toBeGreaterThan(0);
    expect(calls[0].lang).toBe('pl-PL');
  });

  test('should use correct language for English', async ({ page }) => {
    await page.goto('/?chapter=1&lang=en&mode=learning');
    const playButton = await page.locator('#play-pause-button');

    await playButton.click();

    const calls = await page.evaluate(() => window.speechSynthesisCalls);
    expect(calls.length).toBeGreaterThan(0);
    expect(calls[0].lang).toBe('en-US');
  });

  test('should call cancel when pause button is clicked', async ({ page }) => {
    await page.goto('/?chapter=1&lang=pl&mode=learning');
    const playButton = await page.locator('#play-pause-button');

    await playButton.click();
    await playButton.click();

    const cancelCalls = await page.evaluate(() => window.speechSynthesisCancelCalls);
    expect(cancelCalls).toBeGreaterThan(0);
  });

  test('should call cancel when switching language', async ({ page }) => {
    await page.goto('/?chapter=1&lang=pl&mode=learning');
    const playButton = await page.locator('#play-pause-button');

    await playButton.click();
    await page.selectOption('#lang-dropdown', 'en');

    const cancelCalls = await page.evaluate(() => window.speechSynthesisCancelCalls);
    expect(cancelCalls).toBeGreaterThan(0);
  });

  test('should call cancel when navigating to different chapter', async ({ page }) => {
    await page.goto('/?chapter=1&lang=pl&mode=learning');
    const playButton = await page.locator('#play-pause-button');

    await playButton.click();
    await page.goto('/?chapter=1&lang=en&mode=learning');

    const cancelCalls = await page.evaluate(() => window.speechSynthesisCancelCalls);
    expect(cancelCalls).toBeGreaterThan(0);
  });

  test('should call cancel when switching tabs', async ({ page }) => {
    await page.goto('/?chapter=1&lang=pl&mode=learning');
    const playButton = await page.locator('#play-pause-button');

    await playButton.click();

    const tabs = await page.locator('.tab');
    await tabs.nth(1).click();

    const cancelCalls = await page.evaluate(() => window.speechSynthesisCancelCalls);
    expect(cancelCalls).toBeGreaterThan(0);
  });
});
