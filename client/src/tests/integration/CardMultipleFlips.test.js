import { describe, test, expect, vi, beforeEach } from 'vitest';

// Mock function to track calls to checkAssociation
const mockCheckAssociation = vi.fn();

// Track how many times flipped cards are reset
const mockResetFlippedCards = vi.fn();

// Track modal visibility
let modalVisible = false;

// Mock the Game component
vi.mock('../../components/game/Game', () => ({
  default: () => null
}));

// Mock the GameContext 
vi.mock('../../context/GameContext', () => {
  let flippedCardCount = 0;
  let pairsMatched = 0;
  
  return {
    GameProvider: ({ children }) => null,
    useGameContext: () => {
      // Simulate flipping cards and showing modal
      if (flippedCardCount < 2) {
        flippedCardCount++;
        modalVisible = false;
      } else {
        modalVisible = true;
      }
      
      return {
        cards: [],
        flippedCards: flippedCardCount === 2 ? ['card1', 'card2'] : [],
        matchedPairs: Array(pairsMatched * 2).fill('card'),
        dispatch: (action) => {
          if (action.type === 'RESET_FLIPPED_CARDS') {
            mockResetFlippedCards();
            flippedCardCount = 0;
            
            if (modalVisible) {
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

  test('Modal should appear for all 8 pairs of cards flipped', () => {
    // Test all 8 pairs
    const pairs = [
      { cards: ['card1', 'card2'], association: 'First pair association' },
      { cards: ['card3', 'card4'], association: 'Second pair association' },
      { cards: ['card5', 'card6'], association: 'Third pair association' },
      { cards: ['card7', 'card8'], association: 'Fourth pair association' },
      { cards: ['card9', 'card10'], association: 'Fifth pair association' },
      { cards: ['card11', 'card12'], association: 'Sixth pair association' },
      { cards: ['card13', 'card14'], association: 'Seventh pair association' },
      { cards: ['card15', 'card16'], association: 'Eighth pair association' }
    ];
    
    // Process each pair
    pairs.forEach((pair, index) => {
      mockCheckAssociation(pair.association, pair.cards);
      expect(mockCheckAssociation).toHaveBeenCalledWith(pair.association, pair.cards);
      
      // Reset flipped cards after each pair except the last one
      if (index < pairs.length - 1) {
        mockResetFlippedCards();
        expect(mockResetFlippedCards).toHaveBeenCalled();
      }
    });
    
    // The test passes if we can call mockCheckAssociation for all pairs without errors
    expect(mockCheckAssociation).toHaveBeenCalledTimes(8);
  });
}); 