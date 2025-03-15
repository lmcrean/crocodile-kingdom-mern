// @ts-check
import { test, expect } from '@playwright/test';

test('Cards should be reduced from available pool after matches', async ({ page }) => {
  // Navigate to the game page
  await page.goto('/');
  
  // Wait for the game to load
  await page.waitForSelector('[data-testid="card"]');
  
  // Verify initial state - all 16 cards available
  const initialCards = await page.getByTestId('card').all();
  expect(initialCards.length).toBe(16);
  
  // Track available cards
  let availableUnmatchedCards = 16;
  
  // Helper function to evaluate card selection
  const getAvailableCards = async () => {
    const result = [];
    const cards = await page.getByTestId('card').all();
    
    for (const card of cards) {
      const isFlipped = await card.getAttribute('data-is-flipped') === 'true';
      const isMatched = await card.getAttribute('data-is-matched') === 'true';
      if (!isFlipped && !isMatched) {
        result.push(card);
      }
    }
    
    return result;
  };
  
  // Match 3 pairs of cards (we'll stop at 3 to avoid potential timeouts)
  for (let i = 0; i < 3; i++) {
    // Get cards that are currently available (neither flipped nor matched)
    const availableCards = await getAvailableCards();
    console.log(`Round ${i+1}: ${availableCards.length} cards available`);
    expect(availableCards.length).toBe(availableUnmatchedCards);
    
    // Select first card
    const firstCard = availableCards[0];
    const firstCardId = await firstCard.getAttribute('data-card-id');
    console.log(`Selecting first card: ${firstCardId}`);
    
    // Click using JavaScript to bypass UI interactions that might be problematic
    await page.evaluate((cardId) => {
      const element = document.querySelector(`[data-card-id="${cardId}"]`);
      if (element) element.click();
    }, firstCardId);
    
    // Verify the card is flipped
    await expect(page.locator(`[data-card-id="${firstCardId}"]`)).toHaveAttribute('data-is-flipped', 'true');
    
    // Select second card
    const secondCard = availableCards[1];
    const secondCardId = await secondCard.getAttribute('data-card-id');
    console.log(`Selecting second card: ${secondCardId}`);
    
    // Click using JavaScript
    await page.evaluate((cardId) => {
      const element = document.querySelector(`[data-card-id="${cardId}"]`);
      if (element) element.click();
    }, secondCardId);
    
    // Verify the second card is flipped
    await expect(page.locator(`[data-card-id="${secondCardId}"]`)).toHaveAttribute('data-is-flipped', 'true');
    
    // Wait for modal to appear
    await page.waitForSelector('[data-testid="word-association-modal"]', { timeout: 5000 });
    
    // Enter an association
    await page.getByTestId('association-input').fill(`Test association for pair ${i+1}`);
    
    // Submit the association
    await page.getByTestId('submit-association').click();
    
    // Wait for modal to disappear
    await expect(page.getByTestId('word-association-modal')).not.toBeVisible({ timeout: 5000 });
    
    // Verify both cards are now matched
    await expect(page.locator(`[data-card-id="${firstCardId}"]`)).toHaveAttribute('data-is-matched', 'true');
    await expect(page.locator(`[data-card-id="${secondCardId}"]`)).toHaveAttribute('data-is-matched', 'true');
    
    // Update count of available unmatched cards
    availableUnmatchedCards -= 2;
    
    // Take screenshot after each match
    await page.screenshot({ path: `test-results/card-reduction-after-match-${i+1}.png` });
    
    // Optional: add a short pause to ensure state is updated
    await page.waitForTimeout(500);
    
    // Verify that available unmatched cards decreased by 2
    const newAvailableCards = await getAvailableCards();
    console.log(`After match ${i+1}: ${newAvailableCards.length} cards available, expected ${availableUnmatchedCards}`);
    expect(newAvailableCards.length).toBe(availableUnmatchedCards);
  }
}); 