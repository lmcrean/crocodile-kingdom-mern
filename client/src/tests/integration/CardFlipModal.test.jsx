import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as loadCardsModule from '../../utils/loadCards';

// Create mock components instead of importing real ones
const mockGameContext = {
  cards: [],
  flippedCards: [],
  matchedPairs: [],
  turnsLeft: 40,
  dispatch: vi.fn()
};

vi.mock('../../context/GameContext', () => ({
  useGameContext: () => mockGameContext
}));

const mockGameLogic = {
  handleCardClick: vi.fn(),
  resetGame: vi.fn(),
  initializeGame: vi.fn(),
  isLoading: false,
  error: null,
  checkAssociation: vi.fn()
};

vi.mock('../../hooks/useGameLogic', () => ({
  useGameLogic: () => mockGameLogic
}));

vi.mock('../../components/game/Card', () => ({
  default: ({ id, onClick }) => (
    <div 
      data-testid="card" 
      onClick={onClick}
    >
      <div data-testid="card-back"></div>
      <div data-testid="card-front"></div>
    </div>
  )
}));

vi.mock('../../components/modals/WordAssociation', () => ({
  default: ({ isOpen, onClose, onSubmit, cards }) => isOpen ? (
    <div data-testid="word-association-modal">
      <textarea data-testid="association-input"></textarea>
      <button data-testid="submit-association" onClick={() => onSubmit('test association', cards ? cards.map(c => c.id) : [])}>Submit</button>
    </div>
  ) : null
}));

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
    
    // Setup mock returns
    mockGameContext.cards = createTestCards(16);
  });

  test('User can flip two cards and see the word association modal', async () => {
    // Import Game dynamically to avoid JSX parsing issues
    const { default: Game } = await import('../../components/game/Game');
    
    // Render the Game component
    render(<Game />);
    
    // Wait for the cards to load
    await waitFor(() => {
      expect(screen.queryAllByTestId('card')).toHaveLength(16);
    });
    
    // Find the first two cards
    const cards = screen.getAllByTestId('card');
    
    // First card click
    fireEvent.click(cards[0]);
    
    // Verify that handleCardClick was called
    expect(mockGameLogic.handleCardClick).toHaveBeenCalledTimes(1);
    
    // Update mock state to simulate first card flipped
    mockGameContext.flippedCards = ['card-1'];
    
    // Second card click
    fireEvent.click(cards[1]);
    
    // Verify that handleCardClick was called again
    expect(mockGameLogic.handleCardClick).toHaveBeenCalledTimes(2);
    
    // Update mock state to simulate second card flipped
    mockGameContext.flippedCards = ['card-1', 'card-2'];
    
    // Force a re-render by updating a state - in a real component this would happen automatically
    // For test purposes, we'll need to simulate this
    render(<Game />);
    
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
    
    // Verify that checkAssociation was called
    expect(mockGameLogic.checkAssociation).toHaveBeenCalled();
  });
}); 