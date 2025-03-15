import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Game from '../../components/game/Game';
import { GameProvider } from '../../context/GameContext';
import * as loadCardsModule from '../../utils/loadCards';

// Mock the loadCards module
vi.mock('../../utils/loadCards', () => ({
  loadCards: vi.fn()
}));

// Create test cards
const createTestCards = (count = 16) => {
  const cards = [];
  for (let i = 1; i <= count; i++) {
    cards.push({
      id: `card-${i}`,
      word: `test-word-${i}`,
      imagePath: `/test-image-${i}.jpg`,
      isFlipped: false,
      isMatched: false,
      isSelected: false
    });
  }
  return cards;
};

describe('Card Flip and Word Association Flow', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock the loadCards to return test cards
    loadCardsModule.loadCards.mockResolvedValue(createTestCards(16));
  });

  test('User can flip two cards and see the word association modal', async () => {
    // Render the Game component wrapped in GameProvider
    render(
      <GameProvider>
        <Game />
      </GameProvider>
    );
    
    // Wait for the cards to load
    await waitFor(() => {
      expect(screen.queryAllByTestId('card')).toHaveLength(16);
    });
    
    // Find the first two cards
    const cards = screen.getAllByTestId('card');
    
    // Click the first card (flip it)
    fireEvent.click(cards[0]);
    
    // Verify the card is flipped
    await waitFor(() => {
      const cardFront = cards[0].querySelector('[data-testid="card-front"]');
      expect(cardFront.classList.toString()).toContain('scale-100');
    });
    
    // Click the second card (flip it)
    fireEvent.click(cards[1]);
    
    // Verify the second card is flipped
    await waitFor(() => {
      const cardFront = cards[1].querySelector('[data-testid="card-front"]');
      expect(cardFront.classList.toString()).toContain('scale-100');
    });
    
    // Verify that the modal appears
    await waitFor(() => {
      expect(screen.getByTestId('word-association-modal')).toBeInTheDocument();
    });
    
    // Enter a word association
    const associationInput = screen.getByTestId('association-input');
    fireEvent.change(associationInput, { target: { value: 'This is my test association between the words.' } });
    
    // Submit the form
    const submitButton = screen.getByTestId('submit-association');
    fireEvent.click(submitButton);
    
    // Verify the modal is closed
    await waitFor(() => {
      expect(screen.queryByTestId('word-association-modal')).not.toBeInTheDocument();
    });
    
    // Verify the cards remain flipped
    const card1Front = cards[0].querySelector('[data-testid="card-front"]');
    const card2Front = cards[1].querySelector('[data-testid="card-front"]');
    expect(card1Front.classList.toString()).toContain('scale-100');
    expect(card2Front.classList.toString()).toContain('scale-100');
  });
}); 