import { defineConfig, devices } from '@playwright/test';

// Tests run against the canonical www.twobreath.com source directory.
// Reuses @playwright/test from ../TwoBreath-app/node_modules — no separate install.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  timeout: 30000,
  use: {
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx serve . -l 3458 --no-clipboard',
    port: 3458,
    reuseExistingServer: true,
    timeout: 30000,
  },
  projects: [
    { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:3458' } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 13'], baseURL: 'http://localhost:3458' } },
    { name: 'Desktop Firefox', use: { ...devices['Desktop Firefox'], baseURL: 'http://localhost:3458' } },
  ],
});
