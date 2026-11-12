import {defineConfig, devices} from '@playwright/test';

// The suite starts a dev server of its own, on a port that `npm run dev`
// doesn't use, so a run neither needs that port free nor takes it over.
const PORT = 3106;
const BASE_URL = `http://localhost:${PORT}`;

// Playwright reads this file's default export.
export default defineConfig({
  // The unit tests are in tests and run under Vitest.
  testDir: './e2e',
  fullyParallel: true,
  // A focused test passes by skipping the others, so CI refuses one.
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', {open: 'never'}]],
  // The first request to a cold dev server waits while Vite pre-bundles the
  // design system, which can take most of the default 30 seconds.
  timeout: 60_000,
  expect: {
    // Vite transforms each module when a browser first asks for it, and every
    // browser asks at once, so the first assertions wait longer than the
    // default five seconds.
    timeout: 15_000,
  },
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome']},
    },
    {
      name: 'firefox',
      use: {...devices['Desktop Firefox']},
    },
    {
      name: 'webkit',
      use: {...devices['Desktop Safari']},
    },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
