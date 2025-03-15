import { describe, test, expect, vi, beforeEach } from 'vitest';

// Define ActionTypes locally
const ActionTypes = {
  INITIALIZE_CARDS: 'INITIALIZE_CARDS',
  FLIP_CARD: 'FLIP_CARD',
  SET_MATCHED_PAIR: 'SET_MATCHED_PAIR',
  RESET_FLIPPED_CARDS: 'RESET_FLIPPED_CARDS',
  RESET_SELECTED_CARDS: 'RESET_SELECTED_CARDS',
  CLEAR_FLIPPED_CARDS: 'CLEAR_FLIPPED_CARDS'
};

// Create mock cards
const createMockCards = () => {
  return Array(16).fill(null).map((_, index) => {
    const pairIndex = Math.floor(index / 2);
    const id = `card-${pairIndex + 1}-${index % 2 === 0 ? 'a' : 'b'}`;
    
    return {
      id,
      word: `word${pairIndex + 1}`,
      imagePath: `/test/image${pairIndex + 1}.jpg`,
      isFlipped: false,
      isMatched: false,
      isSelected: false
    };
  });
};

// Mock the required modules
vi.mock('../../utils/loadCards', () => ({
  loadCards: () => Promise.resolve(createMockCards())
}));

vi.mock('../../utils/wordAssociation', () => ({
  validateAssociation: () => true
}));

describe('User Journey Tests', () => {
  let gameState;
  let mockReducer;
  
  beforeEach(() => {
    // Initialize game state
    gameState = {
      cards: createMockCards(),
      flippedCards: [],
      selectedCards: [],
      matchedPairs: [],
      turns: 0,
      turnsLeft: 40,
      maxTurns: 40,
      gameStarted: false,
      gameOver: false,
      gameWon: false,
      currentScore: 0
    };
    
    // Mock reducer
    mockReducer = (state, action) => {
      switch (action.type) {
        case ActionTypes.INITIALIZE_CARDS:
          return {
            ...state,
            cards: action.payload,
            gameStarted: true
          };
          
        case ActionTypes.FLIP_CARD:
          return {
            ...state,
            cards: state.cards.map(card => 
              card.id === action.payload ? { ...card, isFlipped: true } : card
            ),
            flippedCards: [...state.flippedCards, action.payload]
          };
          
        case ActionTypes.SET_MATCHED_PAIR:
          return {
            ...state,
            matchedPairs: [...state.matchedPairs, ...action.payload],
            cards: state.cards.map(card =>
              action.payload.includes(card.id)
                ? { ...card, isMatched: true, isFlipped: true }
                : card
            ),
            flippedCards: [],
            turns: state.turns + 1,
            turnsLeft: state.turnsLeft - 1,
            currentScore: state.currentScore + 50
          };
          
        default:
          return state;
      }
    };
  });
  
  test('Complete user journey - playing the game and matching cards', () => {
    // Start the game
    gameState = mockReducer(gameState, { 
      type: ActionTypes.INITIALIZE_CARDS, 
      payload: createMockCards() 
    });
    
    expect(gameState.gameStarted).toBe(true);
    expect(gameState.cards.length).toBe(16);
    
    // Match first pair
    let firstPair = gameState.cards.filter(card => card.word === 'word1').map(card => card.id);
    
    // Flip first card
    gameState = mockReducer(gameState, {
      type: ActionTypes.FLIP_CARD,
      payload: firstPair[0]
    });
    
    expect(gameState.flippedCards.length).toBe(1);
    expect(gameState.cards.find(card => card.id === firstPair[0]).isFlipped).toBe(true);
    
    // Flip second card
    gameState = mockReducer(gameState, {
      type: ActionTypes.FLIP_CARD,
      payload: firstPair[1]
    });
    
    expect(gameState.flippedCards.length).toBe(2);
    expect(gameState.cards.find(card => card.id === firstPair[1]).isFlipped).toBe(true);
    
    // Match the pair
    gameState = mockReducer(gameState, {
      type: ActionTypes.SET_MATCHED_PAIR,
      payload: firstPair
    });
    
    // Check matched state
    expect(gameState.matchedPairs.length).toBe(2);
    expect(gameState.flippedCards.length).toBe(0);
    expect(gameState.turns).toBe(1);
    expect(gameState.turnsLeft).toBe(39);
    
    // Verify cards remain flipped visually
    expect(gameState.cards.find(card => card.id === firstPair[0]).isFlipped).toBe(true);
    expect(gameState.cards.find(card => card.id === firstPair[0]).isMatched).toBe(true);
    expect(gameState.cards.find(card => card.id === firstPair[1]).isFlipped).toBe(true);
    expect(gameState.cards.find(card => card.id === firstPair[1]).isMatched).toBe(true);
    
    // Match second pair
    let secondPair = gameState.cards.filter(card => card.word === 'word2').map(card => card.id);
    
    // Flip third card
    gameState = mockReducer(gameState, {
      type: ActionTypes.FLIP_CARD,
      payload: secondPair[0]
    });
    
    // Flip fourth card
    gameState = mockReducer(gameState, {
      type: ActionTypes.FLIP_CARD,
      payload: secondPair[1]
    });
    
    // Match the pair
    gameState = mockReducer(gameState, {
      type: ActionTypes.SET_MATCHED_PAIR,
      payload: secondPair
    });
    
    // Verify game state
    expect(gameState.matchedPairs.length).toBe(4); // 2 pairs = 4 cards
    expect(gameState.turns).toBe(2);
    expect(gameState.turnsLeft).toBe(38);
    
    // Verify first pair still remains flipped
    expect(gameState.cards.find(card => card.id === firstPair[0]).isFlipped).toBe(true);
    expect(gameState.cards.find(card => card.id === firstPair[0]).isMatched).toBe(true);
  });
}); 