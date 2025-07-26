import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./test/e2e/tests",
  timeout: 30000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["list"]],
  use: {
    baseURL: "https://local.app.climingo.xyz:3000",
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Samsung Galaxy S24"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 16 Pro"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "https://local.app.climingo.xyz:3000",
    reuseExistingServer: !process.env.CI,
  },
});
