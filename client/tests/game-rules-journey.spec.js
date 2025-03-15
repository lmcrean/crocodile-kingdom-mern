// @ts-check
import { test, expect } from '@playwright/test';

// Set a longer timeout for this test as it's a complete user journey
test('Complete game journey following all game rules', async ({ page }) => {
  // Extend the test timeout to 90 seconds
  test.setTimeout(90000);

  // 1. The game loads with a grid of 16 face-down cards
  await page.goto('/');
  await page.waitForSelector('[data-testid="card"]');
  
  // Verify we have 16 cards
  const allCards = await page.getByTestId('card').all();
  expect(allCards.length).toBe(16);
  
  // Take screenshot of initial state
  await page.screenshot({ path: 'test-results/initial-game-state.png' });

  // Track game progress
  let remainingFaceDownCards = 16;
  let matchedPairs = 0;
  
  // Complete the entire game, one pair at a time
  while (matchedPairs < 8) {
    console.log(`Starting match pair ${matchedPairs + 1}`);
    
    // 2. Click on a card to flip it over
    const cards = await page.getByTestId('card').all();
    let firstUnflippedCard = null;
    
    for (const card of cards) {
      const isFlipped = await card.getAttribute('data-is-flipped') === 'true';
      const isMatched = await card.getAttribute('data-is-matched') === 'true';
      if (!isFlipped && !isMatched) {
        firstUnflippedCard = card;
        break;
      }
    }
    
    expect(firstUnflippedCard).not.toBeNull();
    // Only proceed if we found an unflipped card
    if (firstUnflippedCard) {
      const firstCardId = await firstUnflippedCard.getAttribute('data-card-id');
      console.log(`Clicking first card with ID: ${firstCardId}`);
      
      // Scroll element into view and force click
      await firstUnflippedCard.scrollIntoViewIfNeeded();
      await firstUnflippedCard.click({ force: true });
      
      // Check attribute after clicking
      const firstCardAfterClick = page.locator(`[data-card-id="${firstCardId}"]`);
      await expect(firstCardAfterClick).toHaveAttribute('data-is-flipped', 'true');
      
      // 3. Click on a second card
      let secondUnflippedCard = null;
      
      for (const card of cards) {
        const isFlipped = await card.getAttribute('data-is-flipped') === 'true';
        const isMatched = await card.getAttribute('data-is-matched') === 'true';
        const cardId = await card.getAttribute('data-card-id');
        if (!isFlipped && !isMatched && cardId !== firstCardId) {
          secondUnflippedCard = card;
          break;
        }
      }
      
      expect(secondUnflippedCard).not.toBeNull();
      
      // Only proceed if we found a second unflipped card
      if (secondUnflippedCard) {
        const secondCardId = await secondUnflippedCard.getAttribute('data-card-id');
        console.log(`Clicking second card with ID: ${secondCardId}`);
        
        // Scroll element into view and force click
        await secondUnflippedCard.scrollIntoViewIfNeeded();
        await secondUnflippedCard.click({ force: true });
        
        // Check attribute after clicking
        const secondCardAfterClick = page.locator(`[data-card-id="${secondCardId}"]`);
        await expect(secondCardAfterClick).toHaveAttribute('data-is-flipped', 'true');
        
        // 4. When two cards are flipped, a modal appears
        await page.waitForSelector('[data-testid="word-association-modal"]', { timeout: 5000 });
        
        // Take screenshot of flipped cards and modal
        await page.screenshot({ path: `test-results/match-${matchedPairs+1}-modal.png` });
        
        // 5. Enter a sentence incorporating both words
        await page.getByTestId('association-input').fill(`This is a test association for match pair ${matchedPairs+1}.`);
        
        // 6. Click Submit to close the modal
        await page.getByTestId('submit-association').click({ force: true });
        
        // Wait for modal to disappear
        await expect(page.getByTestId('word-association-modal')).not.toBeVisible({ timeout: 5000 });
        
        // 7. Successfully matched cards remain face-up
        // Wait for the matched attribute to be set
        await expect(page.locator(`[data-card-id="${firstCardId}"]`)).toHaveAttribute('data-is-matched', 'true');
        await expect(page.locator(`[data-card-id="${secondCardId}"]`)).toHaveAttribute('data-is-matched', 'true');
        
        // Verify matched cards are reduced from available pool (important for this test)
        remainingFaceDownCards -= 2;
        
        // Count cards that are neither flipped nor matched
        let unflippedCount = 0;
        for (const card of await page.getByTestId('card').all()) {
          const isFlipped = await card.getAttribute('data-is-flipped') === 'true';
          const isMatched = await card.getAttribute('data-is-matched') === 'true';
          if (!isFlipped && !isMatched) {
            unflippedCount++;
          }
        }
        
        console.log(`Unflipped cards remaining: ${unflippedCount}, expected: ${remainingFaceDownCards}`);
        expect(unflippedCount).toBe(remainingFaceDownCards);
        
        // Take screenshot after each match
        await page.screenshot({ path: `test-results/after-match-${matchedPairs+1}.png` });
        
        // Increment matched pair counter
        matchedPairs++;
      }
    }
  }
  
  // 9. The game ends when all cards have been flipped over
  console.log("Game completed, verifying all cards are flipped/matched");
  
  // All cards should now be either flipped or matched
  for (const card of await page.getByTestId('card').all()) {
    const isFlipped = await card.getAttribute('data-is-flipped') === 'true';
    const isMatched = await card.getAttribute('data-is-matched') === 'true';
    expect(isFlipped || isMatched).toBe(true);
  }
  
  // Take final screenshot of completed game
  await page.screenshot({ path: 'test-results/completed-game.png' });
}); 