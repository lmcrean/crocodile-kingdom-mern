// tests/utils/screenshot.js

// Define Tailwind breakpoints
export const TAILWIND_VIEWPORTS = [
    { width: 375, height: 667, name: 'xs' },
    { width: 640, height: 850, name: 'sm' },
    { width: 768, height: 1024, name: 'md' },
    { width: 1024, height: 768, name: 'lg' },
    { width: 1280, height: 800, name: 'xl' },
    { width: 1536, height: 864, name: '2xl' }
  ];
  
  /**
   * Captures screenshots at different viewport sizes
   * @param {import('@playwright/test').Page} page - Playwright page object
   * @param {string} url - URL to capture
   * @param {Object} options - Configuration options
   * @param {string} [options.directory] - Output directory for screenshots
   * @param {string} [options.prefix] - Prefix for screenshot filenames
   */
  export async function captureScreenshotAtViewports(page, url, options = {}) {
    const { 
      directory = 'test-results',
      prefix = ''
    } = options;
  
    for (const viewport of TAILWIND_VIEWPORTS) {
      // Set viewport size
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height
      });
  
      // Navigate to the page
      await page.goto(url);
  
      // Construct filename
      const filename = prefix 
        ? `${prefix}-${viewport.name}-${viewport.width}x${viewport.height}.png`
        : `${viewport.name}-${viewport.width}x${viewport.height}.png`;
  
      // Take screenshot
      await page.screenshot({
        path: `${directory}/${filename}`,
        fullPage: true
      });
  
      console.log(`📸 Captured screenshot: ${filename}`);
    }
  }