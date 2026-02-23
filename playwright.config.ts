import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
  testDir: './tests',
  
  // timeout: 50 * 1000,
  // expect: {
  //   timeout: 10000
  // },

  reporter: 'html',
  use: {
    trace: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }

    /*{
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },*/
  ],
});