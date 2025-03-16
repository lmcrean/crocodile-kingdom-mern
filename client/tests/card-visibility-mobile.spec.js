// tests/card-visibility-mobile.spec.js
import { test, expect } from '@playwright/test';
import { TAILWIND_VIEWPORTS } from './utils/screenshot';

test('all game cards should be visible in mobile view', async ({ page }) => {
  // Get the mobile viewport from our Tailwind breakpoints
  const mobileViewport = TAILWIND_VIEWPORTS.find(v => v.name === 'xs');
  
  // Set the viewport to mobile size
  await page.setViewportSize({
    width: mobileViewport.width,
    height: mobileViewport.height
  });
  
  // Navigate to the game page
  await page.goto('/');
  
  // Wait for the game to load
  await page.waitForSelector('.grid-cols-4', { state: 'visible' });
  
  // Wait for any loading states to resolve
  await page.waitForTimeout(2000);
  
  // Get game grid information
  const gameGridInfo = await page.evaluate(() => {
    const gameGrid = document.querySelector('.grid-cols-4');
    const allCards = Array.from(document.querySelectorAll('.grid-cols-4 > *'));
    
    // Identify actual game cards (those with text content)
    const gameCards = allCards.filter(card => card.textContent.trim() !== '');
    const rect = gameGrid.getBoundingClientRect();
    
    // Calculate which game cards are in the viewport
    const visibleGameCards = gameCards.filter(card => {
      const cardRect = card.getBoundingClientRect();
      return (
        cardRect.top >= 0 &&
        cardRect.left >= 0 &&
        cardRect.bottom <= window.innerHeight &&
        cardRect.right <= window.innerWidth
      );
    });
    
    return {
      totalCards: allCards.length,
      gameCardCount: gameCards.length,
      visibleGameCards: visibleGameCards.length,
      isFullyVisible: rect.top >= 0 && rect.bottom <= window.innerHeight,
      gridBottom: rect.bottom,
      windowHeight: window.innerHeight,
      gridDimensions: {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height
      }
    };
  });
  
  console.log('Game Grid Information:', gameGridInfo);
  
  // Take a screenshot for visual verification
  await page.screenshot({ 
    path: 'test-results/mobile-card-visibility.png',
    fullPage: true 
  });
  
  // Verify we have 16 game cards
  expect(gameGridInfo.gameCardCount).toBe(16);
  
  // Verify all 16 game cards are visible
  expect(gameGridInfo.visibleGameCards).toBe(16);
  
  // Verify the game grid is fully visible
  expect(gameGridInfo.isFullyVisible).toBe(true);
});

// Investigate card structure in more detail
test('investigate card count and structure', async ({ page }) => {
  // Set the viewport to mobile size
  await page.setViewportSize({
    width: 375,
    height: 667
  });
  
  // Navigate to the game page
  await page.goto('/');
  
  // Wait for the game to load
  await page.waitForSelector('.grid-cols-4', { state: 'visible' });
  
  // Wait for any loading states to resolve
  await page.waitForTimeout(2000);
  
  // Analyze the DOM structure to understand card elements
  const cardInfo = await page.evaluate(() => {
    const gameGrid = document.querySelector('.grid-cols-4');
    const cardElements = Array.from(document.querySelectorAll('.grid-cols-4 > *'));
    
    // Get info about each card
    const cards = cardElements.map((card, index) => {
      const classList = Array.from(card.classList);
      const hasImage = card.querySelector('img') !== null;
      const hasText = card.textContent.trim() !== '';
      const isVisible = getComputedStyle(card).display !== 'none';
      const rect = card.getBoundingClientRect();
      const isInViewport = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
      );
      
      return {
        index,
        classList,
        hasImage,
        hasText,
        isVisible,
        isInViewport,
        dimensions: {
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left
        }
      };
    });
    
    // Count cards with text (actual game cards)
    const gameCards = cards.filter(c => c.hasText);
    
    return {
      totalElements: cardElements.length,
      visibleElements: cards.filter(c => c.isVisible).length,
      gameCardCount: gameCards.length,
      visibleGameCards: gameCards.filter(c => c.isInViewport).length,
      cards
    };
  });
  
  console.log(`Found ${cardInfo.totalElements} total card elements, ${cardInfo.visibleElements} visible`);
  console.log(`Game cards: ${cardInfo.gameCardCount}, visible game cards: ${cardInfo.visibleGameCards}`);
  
  // Take a screenshot
  await page.screenshot({ 
    path: 'test-results/card-investigation.png',
    fullPage: true 
  });
  
  // Verify we have 16 game cards and they're all visible
  expect(cardInfo.gameCardCount).toBe(16);
  expect(cardInfo.visibleGameCards).toBe(16);
});

// Test on various mobile devices
test.describe('mobile device tests', () => {
  const mobileDevices = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone XR', width: 414, height: 896 },
    { name: 'Samsung Galaxy S8', width: 360, height: 740 },
    { name: 'iPhone 12 Mini', width: 360, height: 780 }
  ];
  
  for (const device of mobileDevices) {
    test(`all game cards should be visible on ${device.name}`, async ({ page }) => {
      // Set the viewport to device size
      await page.setViewportSize({
        width: device.width,
        height: device.height
      });
      
      // Navigate to the game page
      await page.goto('/');
      
      // Wait for the game to load
      await page.waitForSelector('.grid-cols-4', { state: 'visible' });
      
      // Wait for any loading states to resolve
      await page.waitForTimeout(2000);
      
      // Check if all game cards are visible
      const visibilityInfo = await page.evaluate(() => {
        const allCards = Array.from(document.querySelectorAll('.grid-cols-4 > *'));
        const gameCards = allCards.filter(card => card.textContent.trim() !== '');
        
        // Check if all game cards are in the viewport
        const visibleGameCards = gameCards.filter(card => {
          const rect = card.getBoundingClientRect();
          return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.right <= window.innerWidth
          );
        });
        
        return {
          gameCardCount: gameCards.length,
          visibleGameCards: visibleGameCards.length,
          isGridVisible: document.querySelector('.grid-cols-4').getBoundingClientRect().bottom <= window.innerHeight
        };
      });
      
      // Take a screenshot for this device
      await page.screenshot({ 
        path: `test-results/mobile-card-visibility-${device.name.replace(/\s+/g, '-').toLowerCase()}.png`,
        fullPage: true 
      });
      
      // Verify all 16 game cards are present and visible
      expect(visibilityInfo.gameCardCount).toBe(16);
      expect(visibilityInfo.visibleGameCards).toBe(16);
      expect(visibilityInfo.isGridVisible).toBe(true);
    });
  }
}); 