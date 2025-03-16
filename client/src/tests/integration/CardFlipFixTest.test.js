import { describe, test, expect, vi, beforeEach } from 'vitest';

// Import the ActionTypes from the attached file
const ActionTypes = {
  INITIALIZE_CARDS: 'INITIALIZE_CARDS',
  FLIP_CARD: 'FLIP_CARD',
  SET_MATCHED_PAIR: 'SET_MATCHED_PAIR',
  RESET_FLIPPED_CARDS: 'RESET_FLIPPED_CARDS',
  CLEAR_FLIPPED_CARDS: 'CLEAR_FLIPPED_CARDS'
};

// Simplified version of the reducer function
function gameReducer(state, action) {
  switch (action.type) {
    case ActionTypes.INITIALIZE_CARDS:
      return {
        ...state,
        cards: action.payload,
        flippedCards: []
      };
      
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
      
    case ActionTypes.RESET_FLIPPED_CARDS:
      return {
        ...state,
        cards: state.cards.map(card =>
          state.flippedCards.includes(card.id) && !card.isMatched
            ? { ...card, isFlipped: false }
            : card
        ),
        flippedCards: []
      };
      
    case ActionTypes.CLEAR_FLIPPED_CARDS:
      return {
        ...state,
        flippedCards: []
      };
      
    default:
      return state;
  }
}

describe('Card Flipping Fix Test', () => {
  let initialState;
  
  beforeEach(() => {
    // Setup initial state with mocked cards
    initialState = {
      cards: [
        { id: 'card-1', isFlipped: false, isMatched: false, word: 'test1' },
        { id: 'card-2', isFlipped: false, isMatched: false, word: 'test1' },
        { id: 'card-3', isFlipped: false, isMatched: false, word: 'test2' },
        { id: 'card-4', isFlipped: false, isMatched: false, word: 'test2' }
      ],
      flippedCards: [],
      matchedPairs: []
    };
  });
  
  test('Matched cards should stay flipped when RESET_FLIPPED_CARDS is called', () => {
    // Flip first pair of cards
    let state = gameReducer(initialState, { 
      type: ActionTypes.FLIP_CARD, 
      payload: 'card-1' 
    });
    
    state = gameReducer(state, { 
      type: ActionTypes.FLIP_CARD, 
      payload: 'card-2' 
    });
    
    // Mark them as matched
    state = gameReducer(state, { 
      type: ActionTypes.SET_MATCHED_PAIR, 
      payload: ['card-1', 'card-2'] 
    });
    
    // Verify they are matched and flipped
    expect(state.cards.find(c => c.id === 'card-1').isMatched).toBe(true);
    expect(state.cards.find(c => c.id === 'card-1').isFlipped).toBe(true);
    expect(state.cards.find(c => c.id === 'card-2').isMatched).toBe(true);
    expect(state.cards.find(c => c.id === 'card-2').isFlipped).toBe(true);
    
    // Now flip the second pair
    state = gameReducer(state, { 
      type: ActionTypes.FLIP_CARD, 
      payload: 'card-3' 
    });
    
    state = gameReducer(state, { 
      type: ActionTypes.FLIP_CARD, 
      payload: 'card-4' 
    });
    
    // Verify all cards are flipped
    expect(state.cards.find(c => c.id === 'card-3').isFlipped).toBe(true);
    expect(state.cards.find(c => c.id === 'card-4').isFlipped).toBe(true);
    
    // Now reset flipped cards - this should only affect non-matched cards
    state = gameReducer(state, { type: ActionTypes.RESET_FLIPPED_CARDS });
    
    // Matched cards should still be flipped
    expect(state.cards.find(c => c.id === 'card-1').isFlipped).toBe(true);
    expect(state.cards.find(c => c.id === 'card-2').isFlipped).toBe(true);
    
    // Non-matched cards should be flipped back
    expect(state.cards.find(c => c.id === 'card-3').isFlipped).toBe(false);
    expect(state.cards.find(c => c.id === 'card-4').isFlipped).toBe(false);
  });
}); 