// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests', // Directory where your test files are located
    timeout: 30000,     // Global timeout for tests in milliseconds
    use: {
        browserName: 'chromium',
        headless: true, // Run tests in headless mode
        baseURL: 'https://www.saucedemo.com',
        viewport: { width: 1280, height: 720 },
    },
reporter: [['html', { open: 'on-failure' }]], // Generate an HTML report after tests
});
