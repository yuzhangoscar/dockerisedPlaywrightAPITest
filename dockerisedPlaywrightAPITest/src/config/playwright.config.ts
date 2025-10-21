import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for API testing in Docker environment
 * Focuses on API request testing with comprehensive reporting
 */
export default defineConfig({
  // Test directory structure
  testDir: "./src/tests",
  
  // Parallel execution for faster test runs
  fullyParallel: true,
  
  // Fail the build on CI if tests were skipped
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Limit parallel workers on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Test timeout (4 minutes as per constitution)
  timeout: 4 * 60 * 1000, // 4 minutes in milliseconds
  
  // Expect timeout for assertions
  expect: {
    // API response timeout
    timeout: 10 * 1000 // 10 seconds
  },
  
  // Reporter configuration
  reporter: [
    ["html", { 
      outputFolder: "playwright-report",
      open: "never" 
    }],
    ["json", { 
      outputFile: "test-results/results.json" 
    }],
    ["junit", { 
      outputFile: "test-results/results.xml" 
    }],
    ["list"]
  ],
  
  // Output directories
  outputDir: "test-results/",
  
  // Global test setup
  use: {
    // Base URL for API requests - will be overridden in Docker
    baseURL: process.env.API_BASE_URL || "http://localhost:3000",
    
    // API request context configuration
    extraHTTPHeaders: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    
    // Request timeout (shorter than test timeout)
    actionTimeout: 30 * 1000, // 30 seconds
    
    // Trace configuration for debugging
    trace: "on-first-retry",
    
    // Screenshot on failure
    screenshot: "only-on-failure",
    
    // Video recording for failed tests
    video: "retain-on-failure"
  },

  // Project configuration for different test types
  projects: [
    {
      name: "api-tests",
      testMatch: "src/tests/api/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"] // Base device config even for API tests
      }
    },
    {
      name: "integration-tests", 
      testMatch: "src/tests/integration/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"]
      }
    }
  ],

  // Development server configuration (for local testing)
  webServer: process.env.CI ? undefined : {
    command: "node docker/fake-api/server.js",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 30 * 1000 // 30 seconds to start
  }
});