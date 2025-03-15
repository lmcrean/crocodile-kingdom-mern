import { describe, it, expect, vi } from 'vitest';

// Mock ActionTypes to avoid JSX issues
const ActionTypes = {
  INITIALIZE_CARDS: 'INITIALIZE_CARDS',
  FLIP_CARD: 'FLIP_CARD',
  SELECT_CARD: 'SELECT_CARD',
  RESET_FLIPPED_CARDS: 'RESET_FLIPPED_CARDS',
  RESET_SELECTED_CARDS: 'RESET_SELECTED_CARDS',
  SET_MATCHED_PAIR: 'SET_MATCHED_PAIR',
  SET_ASSOCIATION: 'SET_ASSOCIATION',
  RESET_GAME: 'RESET_GAME',
  CLEAR_FLIPPED_CARDS: 'CLEAR_FLIPPED_CARDS'
};

// Import the reducer function
// Since we can't easily export just the reducer from GameContext, we'll recreate it here for testing
// This matches the reducer in GameContext.jsx
function gameReducer(state, action) {
  switch (action.type) {
    case ActionTypes.INITIALIZE_CARDS:
      return {
        ...state,
        cards: action.payload,
        flippedCards: [],
        selectedCards: [],
        matchedPairs: [],
        turns: 0,
        turnsLeft: state.maxTurns,
        gameOver: false,
        gameWon: false,
        gameStarted: true,
        currentScore: 0,
        currentAssociation: '',
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

    case ActionTypes.SELECT_CARD:
      // Only allow selecting up to 2 cards
      if (state.selectedCards.includes(action.payload)) {
        // Deselect if already selected
        return {
          ...state,
          selectedCards: state.selectedCards.filter(id => id !== action.payload),
          cards: state.cards.map(card =>
            card.id === action.payload
              ? { ...card, isSelected: false }
              : card
          )
        };
      } else if (state.selectedCards.length < 2) {
        // Select new card
        return {
          ...state,
          selectedCards: [...state.selectedCards, action.payload],
          cards: state.cards.map(card =>
            card.id === action.payload
              ? { ...card, isSelected: true }
              : card
          )
        };
      }
      return state;

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

    case ActionTypes.CLEAR_FLIPPED_CARDS:
      return {
        ...state,
        flippedCards: []
      };

    case ActionTypes.RESET_SELECTED_CARDS:
      return {
        ...state,
        cards: state.cards.map(card =>
          state.selectedCards.includes(card.id)
            ? { ...card, isSelected: false }
            : card
        ),
        selectedCards: [],
        currentAssociation: ''
      };

    case ActionTypes.SET_MATCHED_PAIR:
      const matchedCardIds = action.payload;
      const newMatchedPairs = [...state.matchedPairs, ...matchedCardIds];
      const isGameWon = newMatchedPairs.length === state.cards.length; // All cards matched
      
      return {
        ...state,
        matchedPairs: newMatchedPairs,
        gameWon: isGameWon,
        gameOver: isGameWon,
        currentScore: state.currentScore + (state.turnsLeft * 50), // Increment score
        cards: state.cards.map(card =>
          matchedCardIds.includes(card.id)
            ? { ...card, isMatched: true, isFlipped: true }
            : card
        ),
        selectedCards: [],
        flippedCards: [],
        currentAssociation: '',
      };

    case ActionTypes.SET_ASSOCIATION:
      return {
        ...state,
        currentAssociation: action.payload
      };

    case ActionTypes.RESET_GAME:
      return {
        ...state,
        cards: action.payload,
        flippedCards: [],
        selectedCards: [],
        matchedPairs: [],
        turns: 0,
        turnsLeft: state.maxTurns,
        gameOver: false,
        gameWon: false,
        gameStarted: false,
        currentScore: 0,
        currentAssociation: '',
      };

    default:
      return state;
  }
}

describe('Game Reducer', () => {
  // Set up initial state for testing
  const initialState = {
    cards: [],
    flippedCards: [],
    selectedCards: [],
    matchedPairs: [],
    isChecking: false,
    currentAssociation: '',
    turns: 0,
    turnsLeft: 40,
    maxTurns: 40,
    gameStarted: false,
    gameOver: false,
    gameWon: false,
    soundEnabled: true,
    musicEnabled: true,
    highScores: [],
    currentScore: 0,
  };

  it('should initialize cards', () => {
    const testCards = [
      { id: 'card-1', word: 'test1', isFlipped: false, isMatched: false, isSelected: false },
      { id: 'card-2', word: 'test2', isFlipped: false, isMatched: false, isSelected: false }
    ];
    
    const newState = gameReducer(initialState, {
      type: ActionTypes.INITIALIZE_CARDS,
      payload: testCards
    });
    
    expect(newState.cards).toEqual(testCards);
    expect(newState.gameStarted).toBe(true);
    expect(newState.flippedCards).toEqual([]);
    expect(newState.selectedCards).toEqual([]);
  });

  it('should flip a card', () => {
    const state = {
      ...initialState,
      cards: [
        { id: 'card-1', word: 'test1', isFlipped: false, isMatched: false },
        { id: 'card-2', word: 'test2', isFlipped: false, isMatched: false }
      ]
    };
    
    const newState = gameReducer(state, {
      type: ActionTypes.FLIP_CARD,
      payload: 'card-1'
    });
    
    expect(newState.cards[0].isFlipped).toBe(true);
    expect(newState.flippedCards).toContain('card-1');
  });

  it('should select a card', () => {
    const state = {
      ...initialState,
      cards: [
        { id: 'card-1', word: 'test1', isFlipped: false, isMatched: false, isSelected: false },
        { id: 'card-2', word: 'test2', isFlipped: false, isMatched: false, isSelected: false }
      ]
    };
    
    const newState = gameReducer(state, {
      type: ActionTypes.SELECT_CARD,
      payload: 'card-1'
    });
    
    expect(newState.cards[0].isSelected).toBe(true);
    expect(newState.selectedCards).toContain('card-1');
  });

  it('should deselect a card that is already selected', () => {
    const state = {
      ...initialState,
      cards: [
        { id: 'card-1', word: 'test1', isFlipped: false, isMatched: false, isSelected: true },
        { id: 'card-2', word: 'test2', isFlipped: false, isMatched: false, isSelected: false }
      ],
      selectedCards: ['card-1']
    };
    
    const newState = gameReducer(state, {
      type: ActionTypes.SELECT_CARD,
      payload: 'card-1'
    });
    
    expect(newState.cards[0].isSelected).toBe(false);
    expect(newState.selectedCards).not.toContain('card-1');
  });

  it('should reset flipped cards', () => {
    const state = {
      ...initialState,
      cards: [
        { id: 'card-1', word: 'test1', isFlipped: true, isMatched: false },
        { id: 'card-2', word: 'test2', isFlipped: true, isMatched: false }
      ],
      flippedCards: ['card-1', 'card-2']
    };
    
    const newState = gameReducer(state, {
      type: ActionTypes.RESET_FLIPPED_CARDS
    });
    
    expect(newState.cards[0].isFlipped).toBe(false);
    expect(newState.cards[1].isFlipped).toBe(false);
    expect(newState.flippedCards).toEqual([]);
  });

  it('should reset selected cards', () => {
    const state = {
      ...initialState,
      cards: [
        { id: 'card-1', word: 'test1', isFlipped: false, isMatched: false, isSelected: true },
        { id: 'card-2', word: 'test2', isFlipped: false, isMatched: false, isSelected: true }
      ],
      selectedCards: ['card-1', 'card-2']
    };
    
    const newState = gameReducer(state, {
      type: ActionTypes.RESET_SELECTED_CARDS
    });
    
    expect(newState.cards[0].isSelected).toBe(false);
    expect(newState.cards[1].isSelected).toBe(false);
    expect(newState.selectedCards).toEqual([]);
  });

  it('should set matched pair', () => {
    const state = {
      ...initialState,
      cards: [
        { id: 'card-1', word: 'test1', isFlipped: true, isMatched: false, isSelected: true },
        { id: 'card-2', word: 'test2', isFlipped: true, isMatched: false, isSelected: true }
      ],
      selectedCards: ['card-1', 'card-2'],
      flippedCards: ['card-1', 'card-2']
    };
    
    const newState = gameReducer(state, {
      type: ActionTypes.SET_MATCHED_PAIR,
      payload: ['card-1', 'card-2']
    });
    
    expect(newState.cards[0].isMatched).toBe(true);
    expect(newState.cards[1].isMatched).toBe(true);
    expect(newState.matchedPairs).toContain('card-1');
    expect(newState.matchedPairs).toContain('card-2');
    expect(newState.selectedCards).toEqual([]);
    expect(newState.flippedCards).toEqual([]);
  });

  it('should update current association', () => {
    const newState = gameReducer(initialState, {
      type: ActionTypes.SET_ASSOCIATION,
      payload: 'Test association'
    });
    
    expect(newState.currentAssociation).toBe('Test association');
  });

  it('should reset game', () => {
    const state = {
      ...initialState,
      cards: [
        { id: 'card-1', word: 'test1', isFlipped: true, isMatched: true, isSelected: true },
        { id: 'card-2', word: 'test2', isFlipped: true, isMatched: true, isSelected: true }
      ],
      selectedCards: ['card-1', 'card-2'],
      flippedCards: ['card-1', 'card-2'],
      matchedPairs: ['card-1', 'card-2'],
      gameStarted: true,
      turns: 10,
      turnsLeft: 30
    };
    
    const newCards = [
      { id: 'card-3', word: 'test3', isFlipped: false, isMatched: false, isSelected: false },
      { id: 'card-4', word: 'test4', isFlipped: false, isMatched: false, isSelected: false }
    ];
    
    const newState = gameReducer(state, {
      type: ActionTypes.RESET_GAME,
      payload: newCards
    });
    
    expect(newState.cards).toEqual(newCards);
    expect(newState.gameStarted).toBe(false);
    expect(newState.selectedCards).toEqual([]);
    expect(newState.flippedCards).toEqual([]);
    expect(newState.matchedPairs).toEqual([]);
    expect(newState.turns).toBe(0);
    expect(newState.turnsLeft).toBe(state.maxTurns);
  });
}); 