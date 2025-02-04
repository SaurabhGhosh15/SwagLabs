// tests/example.spec.js
import { test, expect } from '@playwright/test';
import { timeout } from '../playwright.config';

test('Verify page title', async ({ page }) => {
    await page.goto('https://example.com');
    const title = await page.title();
    expect(title).toBe('Example Domain');
});