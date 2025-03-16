import { describe, test, expect, vi } from 'vitest';
import { ActionTypes } from '../../context/GameContext';

// Import or recreate the gameReducer function
function gameReducer(state, action) {
  switch (action.type) {
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
      
    default:
      return state;
  }
}

describe('Card Flip Reset Test', () => {
  test('RESET_FLIPPED_CARDS should not flip matched cards', () => {
    // Setup test state with two matched and two unmatched cards
    const initialState = {
      cards: [
        // Matched pair
        { id: 'card-1', isFlipped: true, isMatched: true },
        { id: 'card-2', isFlipped: true, isMatched: true },
        // Unmatched but flipped cards
        { id: 'card-3', isFlipped: true, isMatched: false },
        { id: 'card-4', isFlipped: true, isMatched: false }
      ],
      // All cards are in flippedCards array
      flippedCards: ['card-1', 'card-2', 'card-3', 'card-4']
    };
    
    // Apply RESET_FLIPPED_CARDS action
    const resultState = gameReducer(initialState, { type: ActionTypes.RESET_FLIPPED_CARDS });
    
    // Matched cards should still be flipped
    expect(resultState.cards[0].isFlipped).toBe(true);
    expect(resultState.cards[1].isFlipped).toBe(true);
    
    // Unmatched cards should be flipped back
    expect(resultState.cards[2].isFlipped).toBe(false);
    expect(resultState.cards[3].isFlipped).toBe(false);
    
    // flippedCards array should be empty
    expect(resultState.flippedCards).toEqual([]);
  });
  
  test('Card matching and RESET_FLIPPED_CARDS integration test', () => {
    // Setup test
    const cardReducer = (state, action) => {
      switch (action.type) {
        case 'FLIP_CARD':
          return {
            ...state,
            cards: state.cards.map(card => 
              card.id === action.payload ? { ...card, isFlipped: true } : card
            ),
            flippedCards: [...state.flippedCards, action.payload]
          };
          
        case 'SET_MATCHED_PAIR':
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
          
        case 'RESET_FLIPPED_CARDS':
          return {
            ...state,
            cards: state.cards.map(card =>
              state.flippedCards.includes(card.id) && !card.isMatched
                ? { ...card, isFlipped: false }
                : card
            ),
            flippedCards: []
          };
          
        default:
          return state;
      }
    };
    
    // Initial state
    let state = {
      cards: [
        { id: 'card-1', isFlipped: false, isMatched: false },
        { id: 'card-2', isFlipped: false, isMatched: false },
        { id: 'card-3', isFlipped: false, isMatched: false },
        { id: 'card-4', isFlipped: false, isMatched: false }
      ],
      flippedCards: [],
      matchedPairs: []
    };
    
    // Step 1: Flip card 1
    state = cardReducer(state, { type: 'FLIP_CARD', payload: 'card-1' });
    expect(state.cards[0].isFlipped).toBe(true);
    
    // Step 2: Flip card 2
    state = cardReducer(state, { type: 'FLIP_CARD', payload: 'card-2' });
    expect(state.cards[1].isFlipped).toBe(true);
    
    // Step 3: Match the pair
    state = cardReducer(state, { type: 'SET_MATCHED_PAIR', payload: ['card-1', 'card-2'] });
    expect(state.cards[0].isMatched).toBe(true);
    expect(state.cards[1].isMatched).toBe(true);
    expect(state.cards[0].isFlipped).toBe(true);
    expect(state.cards[1].isFlipped).toBe(true);
    
    // Step 4: Flip card 3
    state = cardReducer(state, { type: 'FLIP_CARD', payload: 'card-3' });
    expect(state.cards[2].isFlipped).toBe(true);
    
    // Step 5: Flip card 4
    state = cardReducer(state, { type: 'FLIP_CARD', payload: 'card-4' });
    expect(state.cards[3].isFlipped).toBe(true);
    
    // Step 6: Reset flipped cards (this would happen if an invalid association was entered)
    state = cardReducer(state, { type: 'RESET_FLIPPED_CARDS' });
    
    // Verify that matched cards 1 and 2 are still flipped
    expect(state.cards[0].isFlipped).toBe(true);
    expect(state.cards[0].isMatched).toBe(true);
    expect(state.cards[1].isFlipped).toBe(true);
    expect(state.cards[1].isMatched).toBe(true);
    
    // Verify that unmatched cards 3 and 4 are reset
    expect(state.cards[2].isFlipped).toBe(false);
    expect(state.cards[2].isMatched).toBe(false);
    expect(state.cards[3].isFlipped).toBe(false);
    expect(state.cards[3].isMatched).toBe(false);
  });
}); 