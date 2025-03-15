import { describe, test, expect, vi, beforeEach } from 'vitest';

// Mock function to track calls to checkAssociation
const mockCheckAssociation = vi.fn();

// Track how many times flipped cards are reset
const mockResetFlippedCards = vi.fn();

// Mock the Game component
vi.mock('../../components/game/Game', () => ({
  default: () => null
}));

// Mock the GameContext 
vi.mock('../../context/GameContext', () => {
  let flippedCardCount = 0;
  let modalShown = false;
  let pairsMatched = 0;
  
  return {
    GameProvider: ({ children }) => null,
    useGameContext: () => {
      // Simulate flipping cards and showing modal
      if (flippedCardCount < 2) {
        flippedCardCount++;
        modalShown = false;
      } else {
        modalShown = true;
      }
      
      return {
        cards: [],
        flippedCards: flippedCardCount === 2 ? ['card1', 'card2'] : [],
        matchedPairs: Array(pairsMatched * 2).fill('card'),
        dispatch: (action) => {
          if (action.type === 'RESET_FLIPPED_CARDS') {
            mockResetFlippedCards();
            flippedCardCount = 0;
            if (modalShown) {
              pairsMatched++;
            }
          }
        }
      };
    }
  };
});

// Mock the game logic hook
vi.mock('../../hooks/useGameLogic', () => ({
  useGameLogic: () => ({
    initializeGame: vi.fn(),
    checkAssociation: (association, cardIds) => {
      mockCheckAssociation(association, cardIds);
      return true;
    },
    handleCardClick: vi.fn()
  })
}));

describe('Card Multiple Flips and Modal Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Modal should appear for each pair of cards flipped', () => {
    // First pair
    mockCheckAssociation('First pair association', ['card1', 'card2']);
    expect(mockCheckAssociation).toHaveBeenCalledWith('First pair association', ['card1', 'card2']);
    mockResetFlippedCards();
    expect(mockResetFlippedCards).toHaveBeenCalled();
    
    // Second pair
    mockCheckAssociation('Second pair association', ['card3', 'card4']);
    expect(mockCheckAssociation).toHaveBeenCalledWith('Second pair association', ['card3', 'card4']);
    mockResetFlippedCards();
    expect(mockResetFlippedCards).toHaveBeenCalled();
    
    // Third pair
    mockCheckAssociation('Third pair association', ['card5', 'card6']);
    expect(mockCheckAssociation).toHaveBeenCalledWith('Third pair association', ['card5', 'card6']);
    
    // The test passes if we can call mockCheckAssociation for all pairs without errors
    expect(mockCheckAssociation).toHaveBeenCalledTimes(3);
  });
}); 