// @ts-check
import { test, expect } from '@playwright/test';

test('Cards should remain flipped after matching', async ({ page }) => {
  // Navigate to the game page
  await page.goto('/');
  
  // Wait for the game to load
  await page.waitForSelector('[data-testid="card"]');
  
  // Get all cards
  const cards = await page.getByTestId('card').all();
  expect(cards.length).toBeGreaterThan(0);
  
  // Click on the first card
  await cards[0].click();
  
  // Verify the first card is flipped (front is visible)
  await expect(page.getByTestId('card-front').nth(0)).toBeVisible();
  
  // Click on the second card
  await cards[1].click();
  
  // Wait for modal to appear
  await page.waitForSelector('[data-testid="word-association-modal"]');
  
  // Enter an association
  await page.getByTestId('association-input').fill('This is a test association between the two words.');
  
  // Submit the association
  await page.getByTestId('submit-association').click();
  
  // Wait for modal to disappear
  await expect(page.getByTestId('word-association-modal')).not.toBeVisible();
  
  // Verify both cards are still flipped (their fronts should be visible)
  await expect(page.getByTestId('card-front').nth(0)).toBeVisible();
  await expect(page.getByTestId('card-front').nth(1)).toBeVisible();
  
  // Take screenshot as evidence
  await page.screenshot({ path: 'test-results/cards-after-match.png' });
  
  // Click on two more cards
  await cards[2].click();
  await cards[3].click();
  
  // Wait for modal to appear again
  await page.waitForSelector('[data-testid="word-association-modal"]');
  
  // Enter another association
  await page.getByTestId('association-input').fill('Another test association for these words.');
  
  // Submit the association
  await page.getByTestId('submit-association').click();
  
  // Wait for modal to disappear
  await expect(page.getByTestId('word-association-modal')).not.toBeVisible();
  
  // Verify all four cards are still flipped
  await expect(page.getByTestId('card-front').nth(0)).toBeVisible();
  await expect(page.getByTestId('card-front').nth(1)).toBeVisible();
  await expect(page.getByTestId('card-front').nth(2)).toBeVisible();
  await expect(page.getByTestId('card-front').nth(3)).toBeVisible();
  
  // Take final screenshot
  await page.screenshot({ path: 'test-results/four-cards-flipped.png' });
}); 