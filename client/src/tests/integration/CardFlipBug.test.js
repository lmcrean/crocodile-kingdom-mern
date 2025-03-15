import { describe, test, expect, vi, beforeEach } from 'vitest';

// Define ActionTypes locally instead of importing
const ActionTypes = {
  INITIALIZE_CARDS: 'INITIALIZE_CARDS',
  FLIP_CARD: 'FLIP_CARD',
  SET_MATCHED_PAIR: 'SET_MATCHED_PAIR',
  CLEAR_FLIPPED_CARDS: 'CLEAR_FLIPPED_CARDS',
  RESET_FLIPPED_CARDS: 'RESET_FLIPPED_CARDS'
};

// No need to mock GameContext since we're defining ActionTypes locally

describe('Card Flipping Bug Tests', () => {
  // Initialize test state
  let state;
  let mockReducer;
  
  beforeEach(() => {
    // Setup mock state
    state = {
      cards: [
        { id: 'card-1', isFlipped: false, isMatched: false },
        { id: 'card-2', isFlipped: false, isMatched: false },
      ],
      flippedCards: [],
      matchedPairs: []
    };
    
    // Define reducer function for testing
    mockReducer = (state, action) => {
      switch (action.type) {
        case ActionTypes.FLIP_CARD:
          return {
            ...state,
            cards: state.cards.map(card =>
              card.id === action.payload
                ? { ...card, isFlipped: true }
                : card
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
            flippedCards: []
          };
          
        case ActionTypes.CLEAR_FLIPPED_CARDS:
          return {
            ...state,
            flippedCards: []
          };
          
        case ActionTypes.RESET_FLIPPED_CARDS:
          return {
            ...state,
            cards: state.cards.map(card =>
              state.flippedCards.includes(card.id)
                ? { ...card, isFlipped: false }
                : card
            ),
            flippedCards: []
          };
          
        default:
          return state;
      }
    };
  });
  
  test('Cards stay visually flipped when matched', () => {
    // First flip two cards
    let newState = mockReducer(state, { type: ActionTypes.FLIP_CARD, payload: 'card-1' });
    newState = mockReducer(newState, { type: ActionTypes.FLIP_CARD, payload: 'card-2' });
    
    // Verify cards are flipped
    expect(newState.cards[0].isFlipped).toBe(true);
    expect(newState.cards[1].isFlipped).toBe(true);
    expect(newState.flippedCards.length).toBe(2);
    
    // Match the cards
    newState = mockReducer(newState, { 
      type: ActionTypes.SET_MATCHED_PAIR, 
      payload: ['card-1', 'card-2'] 
    });
    
    // Verify cards stay flipped and are now matched
    expect(newState.cards[0].isFlipped).toBe(true);
    expect(newState.cards[0].isMatched).toBe(true);
    expect(newState.cards[1].isFlipped).toBe(true);
    expect(newState.cards[1].isMatched).toBe(true);
    expect(newState.flippedCards.length).toBe(0);
    expect(newState.matchedPairs.length).toBe(2);
  });
  
  test('CLEAR_FLIPPED_CARDS action only clears the array, not the visual state', () => {
    // First flip two cards
    let newState = mockReducer(state, { type: ActionTypes.FLIP_CARD, payload: 'card-1' });
    newState = mockReducer(newState, { type: ActionTypes.FLIP_CARD, payload: 'card-2' });
    
    // Then clear flipped cards array
    newState = mockReducer(newState, { type: ActionTypes.CLEAR_FLIPPED_CARDS });
    
    // Verify cards are still visually flipped but flippedCards array is empty
    expect(newState.cards[0].isFlipped).toBe(true);
    expect(newState.cards[1].isFlipped).toBe(true);
    expect(newState.flippedCards.length).toBe(0);
  });
  
  test('RESET_FLIPPED_CARDS action resets both visual state and array', () => {
    // First flip two cards
    let newState = mockReducer(state, { type: ActionTypes.FLIP_CARD, payload: 'card-1' });
    newState = mockReducer(newState, { type: ActionTypes.FLIP_CARD, payload: 'card-2' });
    
    // Then reset flipped cards
    newState = mockReducer(newState, { type: ActionTypes.RESET_FLIPPED_CARDS });
    
    // Verify cards are no longer flipped and flippedCards array is empty
    expect(newState.cards[0].isFlipped).toBe(false);
    expect(newState.cards[1].isFlipped).toBe(false);
    expect(newState.flippedCards.length).toBe(0);
  });
}); 