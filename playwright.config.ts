import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Sprint 49 Testing
 * Testing 3 critical bug fixes in production environment
 */
export default defineConfig({
  // Test directory
  testDir: './tests/e2e/sprint49',
  
  // Maximum time one test can run for
  timeout: 30 * 1000,
  
  // Test execution settings
  fullyParallel: false, // Run sequentially for stability
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker to avoid race conditions
  
  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL for tests
    baseURL: 'http://localhost:3001',
    
    // Collect trace when retrying failed tests
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
    
    // Timeout for each action
    actionTimeout: 10 * 1000,
    
    // Navigation timeout
    navigationTimeout: 30 * 1000,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Run local dev server before starting the tests (optional)
  // webServer: {
  //   command: 'pm2 start orquestrador-v3',
  //   url: 'http://localhost:3001',
  //   reuseExistingServer: true,
  //   timeout: 30 * 1000,
  // },
});
