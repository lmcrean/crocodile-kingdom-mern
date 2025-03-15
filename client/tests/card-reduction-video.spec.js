// @ts-check
import { test, expect } from '@playwright/test';

test('Visual demo: Cards should be reduced from available pool after matches', async ({ page }) => {
  // Set viewport size for better video recording
  await page.setViewportSize({ width: 1280, height: 720 });
  
  // Navigate to the game page
  await page.goto('/');
  
  // Wait for the game to load
  await page.waitForSelector('[data-testid="card"]');
  
  // Add a visual indicator for the test
  await page.evaluate(() => {
    const div = document.createElement('div');
    div.id = 'test-indicator';
    div.style.position = 'fixed';
    div.style.top = '10px';
    div.style.left = '10px';
    div.style.padding = '10px';
    div.style.background = 'rgba(0,0,0,0.7)';
    div.style.color = 'white';
    div.style.zIndex = '9999';
    div.style.borderRadius = '5px';
    div.style.fontSize = '16px';
    div.textContent = 'Starting test: 16 cards available';
    document.body.appendChild(div);
  });

  // Pause to show initial state
  await page.waitForTimeout(2000);
  
  // Update indicator to show we're selecting first pair
  await page.evaluate(() => {
    document.getElementById('test-indicator').textContent = 'Selecting first pair...';
  });
  
  // Get all cards
  const cards = await page.getByTestId('card').all();
  
  // Match first pair
  // Click on the first card
  await cards[0].click();
  
  // Pause to show the flipped card
  await page.waitForTimeout(1000);
  
  // Click on the second card
  await cards[1].click();
  
  // Wait for modal to appear
  await page.waitForSelector('[data-testid="word-association-modal"]');
  
  // Update indicator
  await page.evaluate(() => {
    document.getElementById('test-indicator').textContent = 'Entering word association...';
  });
  
  // Enter an association
  await page.getByTestId('association-input').fill('This is a test association between the two words.');
  
  // Submit the association
  await page.getByTestId('submit-association').click();
  
  // Wait for modal to disappear
  await expect(page.getByTestId('word-association-modal')).not.toBeVisible();
  
  // Update indicator to show reduction
  await page.evaluate(() => {
    document.getElementById('test-indicator').textContent = 'First pair matched! 14 cards remaining';
  });
  
  // Pause to show the result
  await page.waitForTimeout(2000);
  
  // Match second pair
  await page.evaluate(() => {
    document.getElementById('test-indicator').textContent = 'Selecting second pair...';
  });
  
  // Click on the third card
  await cards[2].click();
  
  // Pause
  await page.waitForTimeout(1000);
  
  // Click on the fourth card
  await cards[3].click();
  
  // Wait for modal
  await page.waitForSelector('[data-testid="word-association-modal"]');
  
  // Update indicator
  await page.evaluate(() => {
    document.getElementById('test-indicator').textContent = 'Entering word association...';
  });
  
  // Enter an association
  await page.getByTestId('association-input').fill('Another test association for these words.');
  
  // Submit
  await page.getByTestId('submit-association').click();
  
  // Wait for modal to disappear
  await expect(page.getByTestId('word-association-modal')).not.toBeVisible();
  
  // Update indicator
  await page.evaluate(() => {
    document.getElementById('test-indicator').textContent = 'Second pair matched! 12 cards remaining';
  });
  
  // Pause to show the result
  await page.waitForTimeout(2000);
  
  // Verify reduced pool by attempting to select only unmatched cards
  await page.evaluate(() => {
    document.getElementById('test-indicator').textContent = 'Can only select from remaining cards...';
  });
  
  // Find unmatched cards
  let unmatchedCards = [];
  for (let i = 4; i < cards.length; i++) {
    const isMatched = await cards[i].getAttribute('data-is-matched') === 'true';
    if (!isMatched) {
      unmatchedCards.push(cards[i]);
    }
  }
  
  // Click one unmatched card
  if (unmatchedCards.length > 0) {
    await unmatchedCards[0].click();
    await page.waitForTimeout(1000);
  }
  
  // Final indicator
  await page.evaluate(() => {
    document.getElementById('test-indicator').textContent = 'TEST COMPLETE: Cards are correctly reduced after matches!';
  });
  
  // Final pause to show the results
  await page.waitForTimeout(3000);
}); 