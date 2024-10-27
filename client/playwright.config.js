// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
  },
  
  // Add screenshot settings
  reporter: [['html'], ['list']],
  outputDir: 'test-results/',
  preserveOutput: 'never', // This will clean up the output directory between runs
  
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        screenshot: 'on',
        video: 'off',
        trace: 'off',
      },
    },
  ],
  
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  
  // Clean test results between runs
  retries: 0,
  cleanOutputDir: true,
});