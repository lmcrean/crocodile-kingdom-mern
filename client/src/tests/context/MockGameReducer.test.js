import { describe, it, expect } from 'vitest';
import { gameReducer, ActionTypes, initialState } from '../../context/MockGameReducer';

describe('Game Reducer', () => {
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
      selectedCards: ['card-1', 'card-2'],
      currentAssociation: 'test association'
    };
    
    const newState = gameReducer(state, {
      type: ActionTypes.RESET_SELECTED_CARDS
    });
    
    expect(newState.cards[0].isSelected).toBe(false);
    expect(newState.cards[1].isSelected).toBe(false);
    expect(newState.selectedCards).toEqual([]);
    expect(newState.currentAssociation).toBe('');
  });

  it('should set matched pairs', () => {
    const state = {
      ...initialState,
      cards: [
        { id: 'card-1', word: 'test1', isFlipped: true, isMatched: false, isSelected: true },
        { id: 'card-2', word: 'test2', isFlipped: true, isMatched: false, isSelected: true }
      ],
      selectedCards: ['card-1', 'card-2'],
      turnsLeft: 30
    };
    
    const newState = gameReducer(state, {
      type: ActionTypes.SET_MATCHED_PAIR,
      payload: ['card-1', 'card-2']
    });
    
    expect(newState.cards[0].isMatched).toBe(true);
    expect(newState.cards[1].isMatched).toBe(true);
    expect(newState.cards[0].isSelected).toBe(false);
    expect(newState.cards[1].isSelected).toBe(false);
    expect(newState.matchedPairs).toContain('card-1');
    expect(newState.matchedPairs).toContain('card-2');
    expect(newState.currentScore).toBe(30 * 50); // turnsLeft * 50
  });

  it('should set association text', () => {
    const state = { ...initialState };
    
    const newState = gameReducer(state, {
      type: ActionTypes.SET_ASSOCIATION,
      payload: 'My new association'
    });
    
    expect(newState.currentAssociation).toBe('My new association');
  });

  it('should reset the game', () => {
    const state = {
      ...initialState,
      cards: [
        { id: 'card-1', word: 'test1', isFlipped: true, isMatched: true, isSelected: false },
        { id: 'card-2', word: 'test2', isFlipped: true, isMatched: true, isSelected: false }
      ],
      matchedPairs: ['card-1', 'card-2'],
      gameStarted: true,
      gameWon: true,
      gameOver: true,
      currentScore: 1500
    };
    
    const newCards = [
      { id: 'new-1', word: 'new1', isFlipped: false, isMatched: false, isSelected: false },
      { id: 'new-2', word: 'new2', isFlipped: false, isMatched: false, isSelected: false }
    ];
    
    const newState = gameReducer(state, {
      type: ActionTypes.RESET_GAME,
      payload: newCards
    });
    
    expect(newState.cards).toEqual(newCards);
    expect(newState.matchedPairs).toEqual([]);
    expect(newState.gameStarted).toBe(false);
    expect(newState.gameWon).toBe(false);
    expect(newState.gameOver).toBe(false);
    expect(newState.currentScore).toBe(0);
  });
}); 