import { describe, test, expect, vi, beforeEach } from 'vitest';

// Define ActionTypes
const ActionTypes = {
  INITIALIZE_CARDS: 'INITIALIZE_CARDS',
  FLIP_CARD: 'FLIP_CARD',
  SET_MATCHED_PAIR: 'SET_MATCHED_PAIR',
  RESET_FLIPPED_CARDS: 'RESET_FLIPPED_CARDS',
  CLEAR_FLIPPED_CARDS: 'CLEAR_FLIPPED_CARDS'
};

// Simplified version of the reducer function with logging
function gameReducer(state, action) {
  console.log(`[REDUCER] Handling action: ${action.type}`);
  
  let newState;
  
  switch (action.type) {
    case ActionTypes.INITIALIZE_CARDS:
      newState = {
        ...state,
        cards: action.payload,
        flippedCards: []
      };
      console.log(`[REDUCER] Initialized ${action.payload.length} cards`);
      break;
      
    case ActionTypes.FLIP_CARD:
      newState = {
        ...state,
        cards: state.cards.map(card =>
          card.id === action.payload
            ? { ...card, isFlipped: true }
            : card
        ),
        flippedCards: [...state.flippedCards, action.payload]
      };
      console.log(`[REDUCER] Flipped card: ${action.payload}`);
      console.log(`[REDUCER] Current flippedCards array: ${JSON.stringify(newState.flippedCards)}`);
      break;
      
    case ActionTypes.SET_MATCHED_PAIR:
      const matchedCardIds = action.payload;
      newState = {
        ...state,
        matchedPairs: [...state.matchedPairs, ...matchedCardIds],
        cards: state.cards.map(card =>
          matchedCardIds.includes(card.id)
            ? { ...card, isMatched: true, isFlipped: true }
            : card
        ),
        flippedCards: []
      };
      console.log(`[REDUCER] Matched pair: ${JSON.stringify(matchedCardIds)}`);
      console.log(`[REDUCER] All matched pairs: ${JSON.stringify(newState.matchedPairs)}`);
      break;
      
    case ActionTypes.RESET_FLIPPED_CARDS:
      const cardsToReset = state.cards
        .filter(card => state.flippedCards.includes(card.id) && !card.isMatched)
        .map(card => card.id);
        
      newState = {
        ...state,
        cards: state.cards.map(card =>
          state.flippedCards.includes(card.id) && !card.isMatched
            ? { ...card, isFlipped: false }
            : card
        ),
        flippedCards: []
      };
      console.log(`[REDUCER] Reset flipped cards: ${JSON.stringify(cardsToReset)}`);
      break;
      
    case ActionTypes.CLEAR_FLIPPED_CARDS:
      newState = {
        ...state,
        flippedCards: []
      };
      console.log(`[REDUCER] Cleared flipped cards array, was: ${JSON.stringify(state.flippedCards)}`);
      break;
      
    default:
      newState = state;
      console.log(`[REDUCER] Unknown action: ${action.type}`);
  }
  
  // Debug the state of all cards after each action
  if (newState.cards && newState.cards.length > 0) {
    const flippedCount = newState.cards.filter(c => c.isFlipped).length;
    const matchedCount = newState.cards.filter(c => c.isMatched).length;
    console.log(`[REDUCER] After action: ${flippedCount} cards flipped, ${matchedCount} cards matched`);
    
    // Log full details of each card's state
    if (action.type === ActionTypes.RESET_FLIPPED_CARDS || action.type === ActionTypes.SET_MATCHED_PAIR) {
      console.log('[REDUCER] Detailed card states:');
      newState.cards.forEach(card => {
        if (card.isFlipped || card.isMatched) {
          console.log(`  Card ${card.id}: isFlipped=${card.isFlipped}, isMatched=${card.isMatched}`);
        }
      });
    }
  }
  
  return newState;
}

// Setup the testing environment
describe('Card State Tracking', () => {
  let initialState;
  
  beforeEach(() => {
    // Setup initial state with mocked cards - for simplicity, just use 2 pairs
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
    
    // Clear console for each test
    console.clear();
    console.log('[TEST] Starting new test');
  });
  
  test('Track complete game flow with matched cards and modal interaction', () => {
    console.log('[TEST] --- SCENARIO: Matching first pair ---');
    
    // Flip first card
    let state = gameReducer(initialState, { 
      type: ActionTypes.FLIP_CARD, 
      payload: 'card-1' 
    });
    
    // Check first card is flipped
    expect(state.cards.find(c => c.id === 'card-1').isFlipped).toBe(true);
    
    // Flip second card (matching pair)
    state = gameReducer(state, { 
      type: ActionTypes.FLIP_CARD, 
      payload: 'card-2' 
    });
    
    // Both cards should be flipped
    expect(state.flippedCards.length).toBe(2);
    expect(state.cards.find(c => c.id === 'card-2').isFlipped).toBe(true);
    
    console.log('[TEST] --- SCENARIO: Submit valid association in modal ---');
    
    // Simulate modal association submission - mark pair as matched
    state = gameReducer(state, { 
      type: ActionTypes.SET_MATCHED_PAIR, 
      payload: ['card-1', 'card-2'] 
    });
    
    // Check that the pair is matched and still flipped
    const card1 = state.cards.find(c => c.id === 'card-1');
    const card2 = state.cards.find(c => c.id === 'card-2');
    
    console.log('[TEST] First pair status after matching:');
    console.log(`  Card card-1: isFlipped=${card1.isFlipped}, isMatched=${card1.isMatched}`);
    console.log(`  Card card-2: isFlipped=${card2.isFlipped}, isMatched=${card2.isMatched}`);
    
    expect(card1.isMatched).toBe(true);
    expect(card1.isFlipped).toBe(true);
    expect(card2.isMatched).toBe(true);
    expect(card2.isFlipped).toBe(true);
    
    console.log('[TEST] --- SCENARIO: Starting next pair ---');
    
    // Flip third card
    state = gameReducer(state, { 
      type: ActionTypes.FLIP_CARD, 
      payload: 'card-3' 
    });
    
    // Flip fourth card
    state = gameReducer(state, { 
      type: ActionTypes.FLIP_CARD, 
      payload: 'card-4' 
    });
    
    // Check all four cards are flipped
    expect(state.cards.filter(c => c.isFlipped).length).toBe(4);
    
    console.log('[TEST] --- SCENARIO: Modal appears for second pair ---');
    console.log('[TEST] Current flipped cards before validation:', state.flippedCards);
    
    // Simulate submitting an invalid association for second pair
    console.log('[TEST] --- SCENARIO: Submit invalid association ---');
    
    // Reset flipped cards (this should only affect non-matched cards)
    state = gameReducer(state, { type: ActionTypes.RESET_FLIPPED_CARDS });
    
    // THE CRITICAL TEST: Check if matched cards remain flipped
    const finalCard1 = state.cards.find(c => c.id === 'card-1');
    const finalCard2 = state.cards.find(c => c.id === 'card-2');
    const finalCard3 = state.cards.find(c => c.id === 'card-3');
    const finalCard4 = state.cards.find(c => c.id === 'card-4');
    
    console.log('[TEST] Final card states after reset:');
    console.log(`  Card card-1: isFlipped=${finalCard1.isFlipped}, isMatched=${finalCard1.isMatched}`);
    console.log(`  Card card-2: isFlipped=${finalCard2.isFlipped}, isMatched=${finalCard2.isMatched}`);
    console.log(`  Card card-3: isFlipped=${finalCard3.isFlipped}, isMatched=${finalCard3.isMatched}`);
    console.log(`  Card card-4: isFlipped=${finalCard4.isFlipped}, isMatched=${finalCard4.isMatched}`);
    
    // Matched cards should still be flipped
    expect(finalCard1.isFlipped).toBe(true);
    expect(finalCard1.isMatched).toBe(true);
    expect(finalCard2.isFlipped).toBe(true);
    expect(finalCard2.isMatched).toBe(true);
    
    // Non-matched cards should be reset
    expect(finalCard3.isFlipped).toBe(false);
    expect(finalCard3.isMatched).toBe(false);
    expect(finalCard4.isFlipped).toBe(false);
    expect(finalCard4.isMatched).toBe(false);
  });
}); 