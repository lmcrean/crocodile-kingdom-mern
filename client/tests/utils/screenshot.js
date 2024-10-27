// tests/utils/screenshot.js
import fs from 'fs/promises';
import path from 'path';

export const TAILWIND_VIEWPORTS = [
  { width: 375, height: 667, name: 'xs' },
  { width: 640, height: 850, name: 'sm' },
  { width: 768, height: 1024, name: 'md' },
  { width: 1024, height: 768, name: 'lg' },
  { width: 1280, height: 800, name: 'xl' },
  { width: 1536, height: 864, name: '2xl' }
];

/**
 * Ensures directory exists and is empty
 * @param {string} directory Directory path
 */
async function prepareDirectory(directory) {
  try {
    await fs.access(directory);
    const files = await fs.readdir(directory);
    await Promise.all(
      files.map(file => fs.unlink(path.join(directory, file)))
    );
  } catch {
    await fs.mkdir(directory, { recursive: true });
  }
}

/**
 * Captures screenshots at different viewport sizes
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} url - URL to capture
 * @param {Object} options - Configuration options
 * @param {string} [options.directory] - Output directory for screenshots
 * @param {string} [options.prefix] - Prefix for screenshot filenames
 * @param {boolean} [options.scrollToBottom] - Whether to scroll to bottom before capture
 */
export async function captureScreenshotAtViewports(page, url, options = {}) {
  const { 
    directory = 'test-results',
    prefix = '',
    scrollToBottom = false
  } = options;

  await prepareDirectory(directory);
  console.log(`🗑️  Cleaned directory: ${directory}`);

  for (const viewport of TAILWIND_VIEWPORTS) {
    // Set viewport size
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height
    });

    // Navigate to the page
    await page.goto(url);

    // Wait for any animations or content to load
    await page.waitForTimeout(1000);

    if (scrollToBottom) {
      // Scroll to bottom and wait for any lazy-loaded content
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500); // Wait for scroll to complete
    }

    // Construct filename
    const filename = prefix 
      ? `${prefix}-${viewport.name}-${viewport.width}x${viewport.height}.png`
      : `${viewport.name}-${viewport.width}x${viewport.height}.png`;

    // Take screenshot of just the viewport
    await page.screenshot({
      path: `${directory}/${filename}`,
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: viewport.width,
        height: viewport.height
      }
    });

    console.log(`📸 Captured screenshot: ${filename}`);
  }
}