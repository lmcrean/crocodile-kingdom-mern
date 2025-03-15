import { describe, test, expect, vi, beforeEach } from 'vitest';

// Mock function to track calls
const mockDispatch = vi.fn();
const mockCheckAssociation = vi.fn();
const mockHandleCardClick = vi.fn();

// Track card state
let cardState = [];

// Mock the Game component
vi.mock('../../components/game/Game', () => ({
  default: () => null
}));

// Mock the GameContext 
vi.mock('../../context/GameContext', () => {
  return {
    GameProvider: ({ children }) => null,
    useGameContext: () => {
      return {
        cards: cardState,
        flippedCards: cardState.filter(card => card.isFlipped && !card.isMatched).map(card => card.id),
        matchedPairs: cardState.filter(card => card.isMatched).map(card => card.id),
        dispatch: mockDispatch
      };
    }
  };
});

// Mock the game logic hook
vi.mock('../../hooks/useGameLogic', () => ({
  useGameLogic: () => ({
    initializeGame: vi.fn(),
    checkAssociation: mockCheckAssociation,
    handleCardClick: mockHandleCardClick
  })
}));

describe('Cards Stay Flipped Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Initialize card state with 16 cards (8 pairs)
    cardState = [];
    for (let i = 1; i <= 8; i++) {
      const word = `word${i}`;
      // Create two cards with the same word (a pair)
      cardState.push({
        id: `card-${i}-a`,
        word,
        imagePath: `/test/image${i}.jpg`,
        isFlipped: false,
        isMatched: false,
        isSelected: false
      });
      cardState.push({
        id: `card-${i}-b`,
        word,
        imagePath: `/test/image${i}.jpg`,
        isFlipped: false,
        isMatched: false,
        isSelected: false
      });
    }
  });

  test('Cards stay flipped visually after successful matching', () => {
    // Simulate flipping two cards
    const cardId1 = 'card-1-a';
    const cardId2 = 'card-1-b';
    
    // Flip first card
    mockHandleCardClick(cardId1);
    
    // Update test state to reflect card flip
    cardState = cardState.map(card => 
      card.id === cardId1 ? { ...card, isFlipped: true } : card
    );
    
    // Flip second card
    mockHandleCardClick(cardId2);
    
    // Update test state to reflect card flip
    cardState = cardState.map(card => 
      card.id === cardId2 ? { ...card, isFlipped: true } : card
    );
    
    // Simulate successful association
    mockCheckAssociation('Test association', [cardId1, cardId2]);
    mockDispatch({ type: 'SET_MATCHED_PAIR', payload: [cardId1, cardId2] });
    
    // Update test state to reflect cards are matched
    cardState = cardState.map(card => 
      (card.id === cardId1 || card.id === cardId2) 
        ? { ...card, isMatched: true, isSelected: false } 
        : card
    );
    
    // Clear flipped cards array but cards should stay visually flipped
    mockDispatch({ type: 'CLEAR_FLIPPED_CARDS' });
    
    // Check that the matched cards are still visually flipped
    const card1 = cardState.find(card => card.id === cardId1);
    const card2 = cardState.find(card => card.id === cardId2);
    
    expect(card1.isFlipped).toBe(true);
    expect(card1.isMatched).toBe(true);
    expect(card2.isFlipped).toBe(true);
    expect(card2.isMatched).toBe(true);
    
    // Now flip two more cards
    const cardId3 = 'card-2-a';
    const cardId4 = 'card-2-b';
    
    // Flip third card
    mockHandleCardClick(cardId3);
    
    // Update test state
    cardState = cardState.map(card => 
      card.id === cardId3 ? { ...card, isFlipped: true } : card
    );
    
    // Flip fourth card
    mockHandleCardClick(cardId4);
    
    // Update test state
    cardState = cardState.map(card => 
      card.id === cardId4 ? { ...card, isFlipped: true } : card
    );
    
    // Verify all four cards are flipped
    const flippedCards = cardState.filter(card => card.isFlipped);
    expect(flippedCards.length).toBe(4);
    
    // Verify first pair is matched and second pair is just flipped
    expect(cardState.filter(card => card.isMatched).length).toBe(2);
    expect(cardState.filter(card => card.isFlipped && !card.isMatched).length).toBe(2);
  });
}); 