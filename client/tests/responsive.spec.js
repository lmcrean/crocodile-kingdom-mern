// tests/responsive.spec.js
import { test } from '@playwright/test';
import { captureScreenshotAtViewports } from './utils/screenshot';

test('capture screenshots at all breakpoints', async ({ page }) => {
  await captureScreenshotAtViewports(page, '/', {
    prefix: 'home',
    directory: 'test-results/homepage'
  });
});

test('capture screenshots at all breakpoints - bottom of page', async ({ page }) => {
  await captureScreenshotAtViewports(page, '/', {
    prefix: 'home-scrolled',
    directory: 'test-results/homepage-scrolled',
    scrollToBottom: true
  });
});